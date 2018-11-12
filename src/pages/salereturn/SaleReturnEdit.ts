import { Component, Vue } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import SaleReturnTitle from 'pages/salereturn/cmp/SaleReturnTitle.vue'
import { Dialog, FormValidator, Loading, ObjectUtil } from 'fant'
import SaleReturnSummary from 'pages/salereturn/cmp/SaleReturnSummary.vue'
import SaleReturn from 'model/salereturn/SaleReturn'
import SaleReturnApi from 'http/salereturn/SaleReturnApi'
import OperateLogView from 'cmp/OperateLogView.vue'
import SaleReturnLine from 'model/salereturn/SaleReturnLine.ts'
import SkuSelectionWin from 'cmp/selectionwin/SkuSelectionWin.vue'
import Sku from 'model/basicdata/sku/Sku.ts'
import SaleReturnEditTable from 'pages/salereturn/cmp/SaleReturnEditTable.vue'
import BillBody from 'cmp/BillBody.vue'
import SaleReturnEditHeader from 'pages/salereturn/cmp/SaleReturnEditHeader.vue'
import WarehouseApi from 'http/basicdata/warehouses/WarehouseApi'
import QueryParam from 'model/request/QueryParam'
import Warehouse from 'model/basicdata/warehouses/Warehouse'
import Ucn from 'model/entity/Ucn'
import { State } from 'vuex-class'
import User from 'model/framework/user/User'
import PermissionMgr from 'mgr/PermissionMgr'
import ConstantMgr from 'mgr/ConstantMgr'

@Component({
  components: {
    PageBody, BillBody, SaleReturnTitle, SaleReturnEditHeader, SaleReturnEditTable, SaleReturnSummary, OperateLogView
  }
})
export default class SaleReturnEdit extends Vue {
  @State('user') user: User

  menuList = [{
    name: '销售退货单',
    url: '/saleReturnList'
  }, {
    name: '编辑'
  }]
  hasPermissions: Function = PermissionMgr.hasOptionPermission
  warehouses: Warehouse[] = []
  presentation: string = 'edit'
  pre0: string = 'edit'
  validator: FormValidator = new FormValidator()
  fromSale = ''
  sale: string = ''
  bill: SaleReturn = new SaleReturn()
  selected: SaleReturnLine[] = []
  $refs: {
    saleReturnTable: any
  }

  beforeMount() {
    let id: string = this.$route.query.id
    let isCopy: string = this.$route.query.isCopy
    if (id && id.length > 0) {
      if (isCopy === 'true') {
        this.menuList = [{
          name: '销售退货单',
          url: '/saleReturnList'
        }, {
          name: '新建'
        }]
      }
    } else {
      this.menuList = [{
        name: '销售退货单',
        url: '/saleReturnList'
      }, {
        name: '新建'
      }]
    }
  }

  mounted() {
    this.bill!.sale = 'cancel'
    let id: string = this.$route.query.id
    this.sale = this.$route.query.sale
    this.fromSale = this.$route.query.from
    let isCopy: string = this.$route.query.isCopy
    if (id && id.length > 0) {
      if (isCopy === 'true') {
        this.presentation = 'create'
        this.pre0 = 'copy'
        this.copySaleReturn(id)
      } else {
        this.presentation = 'edit'
        this.pre0 = 'edit'
        this.getSaleReturn(id)
      }
    } else {
      this.presentation = 'create'
      this.pre0 = 'create'
      this.createSaleReturn(this.sale)
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
        min: 0.00,
        message: '税率的最小值为0'
      }, {
        max: 100,
        message: '税率的最大值为100'
      }]
    })
    // this.validator.bindTravel()
  }

  getSaleReturn(uuid: string) {
    let loading = Loading.show({
      msg: '查询中'
    })
    SaleReturnApi.get(uuid, true).then((resp) => {
      loading.hide()
      if (resp.data) {
        this.bill = resp.data as SaleReturn
        if (this.bill) {
          for (let line of this.bill.lines) {
            line.sku!.skuMunitList = []
          }
        }
        this.addEmptyLine()
        this.$refs.saleReturnTable.editLastRow()
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
    })
  }

  createSaleReturn(sale: string) {
    let loading = Loading.show({
      msg: '创建中'
    })
    SaleReturnApi.create(sale).then((resp) => {
      loading.hide()
      if (resp.data) {
        this.bill = resp.data as SaleReturn
        if (!this.isReturnFromSale()) {
          this.defaultManagerFromUser()
        }
        this.bill.lines.map((item) => {
          item.id = ObjectUtil.uuid()
        })
        this.addEmptyLine()
        this.$refs.saleReturnTable.editLastRow()
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
      this.$router.back()
    })
  }

  isReturnFromSale() {
    return this.bill.sale !== undefined && this.bill.sale !== null && this.bill.sale !== ''
  }

  copySaleReturn(id: string) {
    let loading = Loading.show({
      msg: '创建中'
    })
    SaleReturnApi.copy(id).then((resp) => {
      loading.hide()
      if (resp.data) {
        this.bill = resp.data as SaleReturn
        // this.defaultManagerFromUser()
        if (this.bill) {
          for (let line of this.bill.lines) {
            line.sku!.skuMunitList = []
          }
        }
        this.addEmptyLine()
        this.$refs.saleReturnTable.editLastRow()
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

  addEmptyLine() {
    if (this.isReturnFromSale()) {
      return
    }
    let empty = new SaleReturnLine()
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
    let bill: SaleReturn = this.beforeSave()
    this.validator.validate(true).then(() => {
      let loading = Loading.show({
        msg: '保存中'
      })
      SaleReturnApi.save(bill).then((resp) => {
        loading.hide()
        this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
        this.toView()
      }).catch(e => {
        loading.hide()
        this.$message.error(e.message)
      })
    })
  }

  beforeSave(): SaleReturn {
    // 去掉空行
    let saleReturn: SaleReturn = ObjectUtil.copy(this.bill)
    for (let i = saleReturn.lines.length - 1; i >= 0; i--) {
      let line: SaleReturnLine = saleReturn.lines[i]
      // 删除 添加的属性
      if (line.sku) {
        delete line.sku!.skuMunitList
        delete line.sku!.times
      }
      if (!line.sku || !line.sku.id) {
        saleReturn.lines.splice(i, 1)
      }
    }
    return saleReturn
  }

  onSaveAndCreate() {
    let bill: SaleReturn = this.beforeSave()
    this.validator.validate(true).then(() => {
      let loading = Loading.show({
        msg: '保存中'
      })
      SaleReturnApi.save(bill).then((resp) => {
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
    let bill: SaleReturn = this.beforeSave()
    this.validator.validate(true).then(() => {
      let loading = Loading.show({
        msg: '保存中'
      })
      SaleReturnApi.saveAndAudit(bill).then((resp) => {
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
    this.$router.replace(`/saleReturnView?id=${this.bill.id}&from=${this.$route.query.from}`)
  }

  toCreate() {
    // this.$router.replace('/saleReturnEdit?aa=' + ObjectUtil.uuid())
    this.bill.customer = new Ucn()
    this.createSaleReturn('')
  }

  onCancel() {
    this.$router.back()
  }

  onSelectionChange(selected: SaleReturnLine[]) {
    this.selected = selected
  }

  onAddSku() {
    if (!this.bill.warehouse) {
      this.$message.warning('请先选择仓库')
      return
    }
    new Dialog(SkuSelectionWin, {
      warehouse: this.bill.warehouse,
      multiple: true,
      excludes: this.$refs.saleReturnTable.getAllSkuIds(),
      callback: (skus: Array<Sku>) => {
        if (skus && skus.length > 0) {
          this.$refs.saleReturnTable.addSkus(skus)
          this.$refs.saleReturnTable.editLastRow()
        }
      }
    }).show()
  }

  onRemoveLines() {
    this.$msgBox.confirm('删除商品', '确认删除选中商品吗？', () => {
      this.$refs.saleReturnTable.removeLines(this.selected)
    }, () => {
      // do nothing
    })
  }

  onLinesChange() {
    if (this.bill.lines.length <= 0) {
      this.$refs.saleReturnTable.addEmptyLine()
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
    this.$refs.saleReturnTable.freeTaxRate(this.selected)
  }
}
