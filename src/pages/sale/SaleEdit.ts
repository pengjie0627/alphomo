import { Component, Vue, Provide } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import SaleTitle from 'pages/sale/cmp/SaleTitle.vue'
import { Dialog, FormValidator, Loading, ObjectUtil } from 'fant'
import SaleSummary from 'pages/sale/cmp/SaleSummary.vue'
import Sale from 'model/sale/Sale'
import SaleApi from 'http/sale/SaleApi'
import OperateLogView from 'cmp/OperateLogView.vue'
import SaleLine from 'model/sale/SaleLine.ts'
import SkuSelectionWin from 'cmp/selectionwin/SkuSelectionWin.vue'
import Sku from 'model/basicdata/sku/Sku.ts'
import SaleEditTable from 'pages/sale/cmp/SaleEditTable.vue'
import BillBody from 'cmp/BillBody.vue'
import SaleEditHeader from 'pages/sale/cmp/SaleEditHeader.vue'
import WarehouseApi from 'http/basicdata/warehouses/WarehouseApi'
import QueryParam from 'model/request/QueryParam'
import Warehouse from 'model/basicdata/warehouses/Warehouse'
import { State } from 'vuex-class'
import User from 'model/framework/user/User'
import Ucn from 'model/entity/Ucn'
import PermissionMgr from 'mgr/PermissionMgr'
import ConstantMgr from 'mgr/ConstantMgr'
import { sessionStorage } from 'mgr/BrowserMgr.js'

@Component({
  components: {
    PageBody, BillBody, SaleTitle, SaleEditHeader, SaleEditTable, SaleSummary, OperateLogView
  }
})
export default class SaleEdit extends Vue {

  @State('user') user: User
  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限
  menuList = [{
    name: '销售单',
    url: '/saleList'
  }, {
    name: '编辑'
  }]
  warehouses: Warehouse[] = []
  presentation: string = 'edit'
  pre0: string = 'edit'
  validator: FormValidator = new FormValidator()

  bill: Sale = new Sale()
  selected: SaleLine[] = []
  $refs: {
    saleTable: any
  }

  @Provide('queryParam') // 条件过滤，用于子组件查询
  queryParam = new QueryParam()

  // @Watch('bill', { deep: true })
  // watchBill() {
  //   this.queryParam.filters = []
  //   if (this.bill.customer) {
  //     this.queryParam.filters.push({ 'property': 'customer:=', value: this.bill.customer!.id })
  //   }
  //   if (this.bill.warehouse) {
  //     this.queryParam.filters.push({ 'property': 'warehouse:=', value: this.bill.warehouse!.id })
  //   }
  //   // if (this.bill.manager) {
  //   //   this.queryParam.filters.push({ 'property': 'manager:=', value: this.bill.manager!.id })
  //   // }
  //   // if (this.bill.businessDate) {
  //   //   this.queryParam.filters.push({ 'property': 'businessDate:=', value: this.bill.businessDate })
  //   // }
  // }

  beforeMount() {
    let id: string = this.$route.query.id
    let isCopy: string = this.$route.query.isCopy
    if (id && id.length > 0) {
      if (isCopy === 'true') {
        this.menuList = [{
          name: '销售单',
          url: '/saleList'
        }, {
          name: '新建'
        }]
      }
    } else {
      this.menuList = [{
        name: '销售单',
        url: '/saleList'
      }, {
        name: '新建'
      }]
    }
  }

  mounted() {
    let id: string = this.$route.query.id
    let isCopy: string = this.$route.query.isCopy
    if (id && id.length > 0) {
      if (isCopy === 'true') {
        this.presentation = 'create'
        this.pre0 = 'copy'
        this.copySale(id)
      } else {
        this.presentation = 'edit'
        this.pre0 = 'edit'
        this.getSale(id)
      }
    } else {
      this.presentation = 'create'
      this.pre0 = 'create'
      this.createSale()
    }
    this.listWarehouse()

    this.bindValidator()
  }

  bindValidator() {
    this.validator.push({
      customer: [{
        required: true, message: '客户不允许为空'
      }],
      warehouse: [{
        required: true, message: '仓库不允许为空'
      }],
      manager: [{
        required: true, message: '经办人不允许为空'
      }],
      businessDate: [{
        required: true, message: '业务日期不允许为空'
      }],
      remark: [{
        maxLength: 140, message: '备注最多输入140个字符'
      }],
      chargeAmount: [{
        min: -999999.99,
        message: '费用的最小值为-999999.99'
      }, {
        max: 999999.99,
        message: '费用的最大值为999999.99'
      }],
      discountAmount: [{
        min: 0,
        message: '优惠金额的最小值为0'
      }, {
        max: 999999.99,
        message: '优惠金额的最大值为999999.99'
      }, {
        validate: (value: number) => {
          if (value > ((Number(this.bill.amount) + Number(this.bill.chargeAmount)))) {
            return false
          }
          return true
        }, message: '优惠金额不能大于合计金额与其他费用总和'
      }],
      lineQty: [{
        min: 0,
        message: '数量的最小值为0'
      }, {
        max: 999999,
        message: '数量的最大值为999999'
      }],
      lineAmount: [{
        min: 0,
        message: '金额的最小值为0'
      }, {
        max: 999999.99,
        message: '金额的最大值为999999.99'
      }],
      lineTaxRate: [{
        min: 0,
        message: '税率的最小值为0'
      }, {
        max: 100,
        message: '税率的最大值为100'
      }]
    })
    // this.validator.bindTravel()
  }

  getSale(uuid: string) {
    let loading = Loading.show({
      msg: '查询中'
    })
    SaleApi.get(uuid).then((resp) => {
      loading.hide()
      if (resp.data) {
        this.bill = resp.data as Sale
        if (this.bill) {
          for (let line of this.bill.lines) {
            line.sku!.skuMunitList = []
          }
        }
        this.addEmptyLine()
        this.$refs.saleTable.editLastRow()
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
    })
  }

  createSale() {
    let loading = Loading.show({
      msg: '创建中'
    })
    SaleApi.create().then((resp) => {
      loading.hide()
      if (resp.data) {
        this.bill = resp.data as Sale
        this.defaultManagerFromUser()
        this.addEmptyLine()
        this.$refs.saleTable.editLastRow()
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
      this.$router.back()
    })
  }

  defaultManagerFromUser() {
    let manager: Ucn = new Ucn()
    manager.id = this.user.id
    manager.code = this.user.mobile
    manager.name = this.user.name
    this.bill.manager = manager
  }

  copySale(id: string) {
    let loading = Loading.show({
      msg: '创建中'
    })
    SaleApi.copy(id).then((resp) => {
      loading.hide()
      if (resp.data) {
        this.bill = resp.data as Sale
        if (this.bill) {
          for (let line of this.bill.lines) {
            line.sku!.skuMunitList = []
          }
        }
        this.addEmptyLine()
        this.$refs.saleTable.editLastRow()
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
      this.$router.back()
    })
  }

  addEmptyLine() {
    let empty = new SaleLine()
    empty.id = ObjectUtil.uuid()
    this.bill.lines.push(empty)
  }

  listWarehouse() {
    // do nothing
    WarehouseApi.queryExcludeCar(new QueryParam()).then((resp) => {
      this.warehouses = resp.data
    }).catch(e => {
      this.$message.error(e.message)
    })
  }

  onSave() {
    let bill: Sale = this.beforeSave()
    this.validator.validate(true).then(() => {
      let loading = Loading.show({
        msg: '保存中'
      })
      SaleApi.save(bill).then((resp) => {
        loading.hide()
        this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
        this.toView()
      }).catch(e => {
        loading.hide()
        this.$message.error(e.message)
      })
    })
  }

  beforeSave(): Sale {
    // 去掉空行
    let sale: Sale = ObjectUtil.copy(this.bill)
    for (let i = sale.lines.length - 1; i >= 0; i--) {
      let line: SaleLine = sale.lines[i]
      if (line.sku) {
        delete line.sku!.skuMunitList
        delete line.sku!.times
      }
      if (!line.sku || !line.sku.id) {
        sale.lines.splice(i, 1)
      }
    }
    return sale
  }

  onSaveAndCreate() {
    let bill: Sale = this.beforeSave()
    this.validator.validate(true).then(() => {
      let loading = Loading.show({
        msg: '保存中'
      })
      SaleApi.save(bill).then((resp) => {
        loading.hide()
        this.$message.success(ConstantMgr.tips.saveNewAndModifySuccessTip)
        this.toCreate()
      }).catch(e => {
        loading.hide()
        this.$message.error(e.message)
      })
    })
  }

  onSaveAndAudit() {
    let bill: Sale = this.beforeSave()
    this.validator.validate(true).then(() => {
      let loading = Loading.show({
        msg: '保存中'
      })
      SaleApi.saveAndAudit(bill).then((resp) => {
        loading.hide()
        this.$message.success(ConstantMgr.tips.saveNewAndAuditSuccessTip)
        this.toView()
      }).catch(e => {
        loading.hide()
        this.$message.error(e.message)
      })
    })
  }

  toView() {
    this.$router.replace(`/saleView?id=${this.bill.id}`)
  }

  toCreate() {
    // this.$router.replace('/saleEdit?aa=' + ObjectUtil.uuid())
    this.bill.customer = new Ucn()
    this.createSale()
  }

  onCancel() {
    this.$router.back()
  }

  onSelectionChange(selected: SaleLine[]) {
    this.selected = selected
  }

  onAddSku() {
    if (!sessionStorage.getItem('customer')) {
      this.$message.warning('请先选择客户')
      return
    }
    if (!this.bill.warehouse) {
      this.$message.warning('请先选择仓库')
      return
    }
    new Dialog(SkuSelectionWin, {
      warehouse: this.bill.warehouse,
      customId: sessionStorage.getItem('customer'),
      multiple: true,
      excludes: this.$refs.saleTable.getAllSkuIds(),
      callback: (skus: Array<Sku>) => {
        if (skus && skus.length > 0) {
          this.$refs.saleTable.addSkus(skus)
          this.$refs.saleTable.editLastRow()
        }
      }
    }).show()
  }

  onRemoveLines() {
    this.$msgBox.confirm('删除商品', '确认删除选中商品吗？', () => {
      this.$refs.saleTable.removeLines(this.selected)
    }, () => {
      // do nothing
    })
  }

  onLinesChange() {
    if (this.bill.lines.length <= 0) {
      this.$refs.saleTable.addEmptyLine()
    }
    let taxExcAmount = 0
    let amount: number = 0
    let taxAmount: number = 0
    this.bill.lines.forEach(line => {
      taxExcAmount += Number(line.taxExcAmount)
      amount += Number(line.amount)
      taxAmount += Number(line.taxAmount)
    })
    this.bill.taxExcAmount = taxExcAmount
    this.bill.amount = amount
    this.bill.taxAmount = taxAmount
  }

  onFreeTaxRate() {
    this.$refs.saleTable.freeTaxRate(this.selected)
  }
}
