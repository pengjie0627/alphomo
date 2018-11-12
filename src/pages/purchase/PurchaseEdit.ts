import { Component, Vue } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import PurchaseTitle from 'pages/purchase/cmp/PurchaseTitle.vue'
import { Dialog, FormValidator, Loading, ObjectUtil } from 'fant'
import PurchaseSummary from 'pages/purchase/cmp/PurchaseSummary.vue'
import Purchase from 'model/purchase/Purchase'
import PurchaseApi from 'http/purchase/PurchaseApi'
import OperateLogView from 'cmp/OperateLogView.vue'
import PurchaseLine from 'model/purchase/PurchaseLine.ts'
import SkuSelectionWin from 'cmp/selectionwin/SkuSelectionWin.vue'
import Sku from 'model/basicdata/sku/Sku.ts'
import PurchaseEditTable from 'pages/purchase/cmp/PurchaseEditTable.vue'
import BillBody from 'cmp/BillBody.vue'
import PurchaseEditHeader from 'pages/purchase/cmp/PurchaseEditHeader.vue'
import WarehouseApi from 'http/basicdata/warehouses/WarehouseApi'
import QueryParam from 'model/request/QueryParam'
import Warehouse from 'model/basicdata/warehouses/Warehouse'
import ConstantMgr from 'mgr/ConstantMgr'
import User from 'model/framework/user/User'
import Ucn from 'model/entity/Ucn'
import { State } from 'vuex-class'
import PermissionMgr from 'mgr/PermissionMgr'


@Component({
  components: {
    PageBody, BillBody, PurchaseTitle, PurchaseEditHeader, PurchaseEditTable, PurchaseSummary, OperateLogView
  }
})
export default class PurchaseEdit extends Vue {
  @State('user') user: User
  menuList = [{
    name: '进货单',
    url: '/purchaseList'
  }, {
    name: '编辑'
  }]
  presentation: string = 'edit'
  validator: FormValidator = new FormValidator()
  limits = ConstantMgr.limits.purchase
  warehouses: Warehouse[] = []
  bill: Purchase = new Purchase()
  selected: Array<PurchaseLine> = new Array()
  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限
  $refs: {
    purchaseTable: any
  }

  beforeMount() {
    let id: string = this.$route.query.id
    let isCopy: string = this.$route.query.isCopy
    if (id && id.length > 0) {
      if (isCopy === 'true') {
        this.menuList = [{
          name: '进货单',
          url: '/purchaseList'
        }, {
          name: '新建'
        }]
      }
    } else {
      this.menuList = [{
        name: '进货单',
        url: '/purchaseList'
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
        this.menuList = [{
          name: '进货单',
          url: '/purchaseList'
        }, {
          name: '新建'
        }]
        this.copyPurchase(id)
      } else {
        this.presentation = 'edit'
        this.getPurchase(id)
      }
    } else {
      this.presentation = 'create'
      this.menuList = [{
        name: '进货单',
        url: '/purchaseList'
      }, {
        name: '新建'
      }]
      this.createPurchase()
    }
    this.listWarehouse()

    this.bindValidator()
  }

  copyPurchase(id: string) {
    let loading = Loading.show({
      msg: '创建中'
    })
    PurchaseApi.copy(id).then((resp) => {
      loading.hide()
      if (resp.data) {
        this.bill = resp.data as Purchase
        if (this.bill) {
          for (let line of this.bill.lines) {
            line.sku!.skuMunitList = []
          }
        }
        this.bill.lines.push(new PurchaseLine())
        this.$refs.purchaseTable.editLastRow()
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
    })
  }

  bindValidator() {
    this.validator.push({
      supplier: [{
        required: true, message: '供应商不允许为空'
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
        maxLength: 140, message: '超过140字长度限制'
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
          if (value > (Number(this.bill.amount) + Number(this.bill.chargeAmount))) {
            return false
          }
          return true
        }, message: '优惠金额不能大于合计金额与其他费用总和'
      }],
      lineQty: [{
        min: 0,
        max: 999999,
        message: '数量的最小值为0,最大值为999999'
      }],
      lineAmount: [{
        min: 0.00,
        max: 999999.99,
        message: '金额的最小值为0.00,最大值为999999.99'
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

  getPurchase(uuid: string) {
    let loading = Loading.show({
      msg: '查询中'
    })
    PurchaseApi.get(uuid).then((resp) => {
      loading.hide()
      if (resp.data) {
        this.bill = resp.data as Purchase
        if (this.bill) {
          for (let line of this.bill.lines) {
            line.sku!.skuMunitList = []
          }
        }
        this.bill.lines.push(new PurchaseLine())
        this.$refs.purchaseTable.editLastRow()
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
    })
  }

  createPurchase() {
    let loading = Loading.show({
      msg: '创建中'
    })
    PurchaseApi.create().then((resp) => {
      loading.hide()
      if (resp.data) {
        this.bill = resp.data as Purchase
        if (this.user) {
          let manager = new Ucn()
          manager.id = this.user.id
          manager.name = this.user.name
          this.bill.manager = manager
        }
        this.bill.lines.push(new PurchaseLine())
        this.$refs.purchaseTable.editLastRow()
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
    })
  }

  listWarehouse() {
    WarehouseApi.queryExcludeCar(new QueryParam()).then((resp) => {
      this.warehouses = resp.data
    }).catch(e => {
      this.$message.error(e.message)
    })
  }

  onSave() {
    this.removeBlankSkuLine()
    this.validator.validate(true).then(() => {
      let loading = Loading.show({
        msg: '保存中'
      })
      PurchaseApi.save(this.bill).then((resp) => {
        this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
        loading.hide()
        console.log('resp.data.id:' + resp.data.id)
        this.toView(resp.data.id!)
      }).catch(e => {
        loading.hide()
        this.$message.error(e.message)
      })
    })
  }

  onSaveAndCreate() {
    this.removeBlankSkuLine()
    this.validator.validate(true).then(() => {
      let loading = Loading.show({
        msg: '保存中'
      })
      PurchaseApi.save(this.bill).then((resp) => {
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
    this.removeBlankSkuLine()
    this.validator.validate(true).then(() => {
      let loading = Loading.show({
        msg: '保存中'
      })
      PurchaseApi.saveAndAudit(this.bill).then((resp) => {
        loading.hide()
        this.$message.success(ConstantMgr.tips.saveNewAndAuditSuccessTip)
        this.toView(resp.data.id!)
      }).catch(e => {
        loading.hide()
        this.$message.error(e.message)
      })
    })
  }

  removeBlankSkuLine() {
    let arr = this.bill.lines
    for (let i = 0; i < arr.length - 1; i++) {
      // 删除 添加的属性
      delete arr[i].sku!.skuMunitList
      delete arr[i].sku!.times
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] && !arr[j].sku) {
          arr.splice(j--, 1)
        }
      }
    }
    this.bill.lines = arr
    this.beforeSave()
  }

  beforeSave() {
    // 删除 添加的属性
    let bill: Purchase = ObjectUtil.copy(this.bill)
    for (let i = bill.lines.length - 1; i >= 0; i--) {
      let line: PurchaseLine = bill.lines[i]
      if (line.sku) {
        delete line.sku!.skuMunitList
        delete line.sku!.times
      }
    }
    this.bill = bill
  }

  toView(id: String) {
    this.$router.replace(`/purchaseView?id=` + id)
  }

  toCreate() {
    this.bill.supplier = new Ucn()
    this.createPurchase()
    // this.$router.push('/purchaseEdit?dc=' + Date.now())
  }

  onCancel() {
    this.$router.back()
  }

  onSelectionChange(selected: PurchaseLine[]) {
    this.selected = selected
  }

  onAddSku() {
    if (!this.bill.warehouse) {
      this.$message.warning('请先选择仓库')
      return
    }
    if (!this.bill.supplier) {
      this.$message.warning('请先输入供应商')
      return
    }
    new Dialog(SkuSelectionWin, {
      warehouse: this.bill.warehouse,
      supplier: this.bill.supplier,
      multiple: true,
      excludes: this.$refs.purchaseTable.getAllSkuIds(),
      callback: (skus: Array<Sku>) => {
        if (skus && skus.length > 0) {
          this.$refs.purchaseTable.addSkus(skus)
          this.$refs.purchaseTable.editLastRow()
        }
      }
    }).show()
  }

  onRemoveLines() {
    this.$msgBox.confirm('删除商品', '确认删除选中商品吗？', () => {
      this.$refs.purchaseTable.removeLines(this.selected)
    }, () => {
      // do nothing
    })
  }

  onLinesChange() {
    if (this.bill.lines.length <= 0) {
      this.$refs.purchaseTable.addEmptyLine()
    }
    let amount: number = 0
    let taxAmount: number = 0
    let taxExcAmount: number = 0
    this.bill.lines.forEach(line => {
      taxExcAmount += Number(line.taxExcAmount)
      amount += line.amount
      taxAmount += line.taxAmount
    })
    this.bill.amount = amount
    this.bill.taxAmount = taxAmount
    this.bill.taxExcAmount = taxExcAmount
  }

  onFreeTaxRate() {
    this.$refs.purchaseTable.freeTaxRate(this.selected)
  }
}
