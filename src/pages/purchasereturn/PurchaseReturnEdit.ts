import { Component, Vue } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import PurchaseReturnTitle from 'pages/purchasereturn/cmp/PurchaseReturnTitle.vue'
import { Dialog, FormValidator, Loading, ObjectUtil } from 'fant'
import PurchaseReturnSummary from 'pages/purchasereturn/cmp/PurchaseReturnSummary.vue'
import OperateLogView from 'cmp/OperateLogView.vue'
import SkuSelectionWin from 'cmp/selectionwin/SkuSelectionWin.vue'
import Sku from 'model/basicdata/sku/Sku.ts'
import PurchaseReturnEditTable from 'pages/purchasereturn/cmp/PurchaseReturnEditTable.vue'
import BillBody from 'cmp/BillBody.vue'
import PurchaseReturnEditHeader from 'pages/purchasereturn/cmp/PurchaseReturnEditHeader.vue'
import WarehouseApi from 'http/basicdata/warehouses/WarehouseApi'
import QueryParam from 'model/request/QueryParam'
import Warehouse from 'model/basicdata/warehouses/Warehouse'
import ConstantMgr from 'mgr/ConstantMgr'
import PurchaseReturn from 'model/purchasereturn/PurchaseReturn'
import PurchaseReturnLine from 'model/purchasereturn/PurchaseReturnLine'
import PurchaseReturnApi from 'http/purchasereturn/PurchaseReturnApi'
import Ucn from 'model/entity/Ucn'
import User from 'model/framework/user/User'
import { State } from 'vuex-class'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  components: {
    PageBody,
    BillBody,
    PurchaseReturnTitle,
    PurchaseReturnEditHeader,
    PurchaseReturnEditTable,
    PurchaseReturnSummary,
    OperateLogView
  }
})
export default class PurchaseReturnEdit extends Vue {
  @State('user') user: User
  menuList = [{
    name: '进货退货',
    url: '/purchaseReturnList'
  }, {
    name: '编辑'
  }]
  purchase: string = ''
  isReturnFromPurchase: boolean = false
  presentation: string = 'edit'
  validator: FormValidator = new FormValidator()
  limits = ConstantMgr.limits.purchaseReturn
  warehouses: Warehouse[] = []
  bill: PurchaseReturn = new PurchaseReturn()
  hasPermissions = PermissionMgr.hasOptionPermission
  selected: Array<PurchaseReturnLine> = new Array()
  $refs: {
    purchaseReturnTable: any
  }

  beforeMount() {
    let id: string = this.$route.query.id
    let isCopy: string = this.$route.query.isCopy
    if (id && id.length > 0) {
      if (isCopy === 'true') {
        this.menuList = [{
          name: '进货退货单',
          url: '/purchaseReturnList'
        }, {
          name: '新建'
        }]
      }
    } else {
      this.menuList = [{
        name: '进货退货单',
        url: '/purchaseReturnList'
      }, {
        name: '新建'
      }]
    }
  }

  mounted() {
    let id: string = this.$route.query.id
    this.purchase = this.$route.query.purchase
    let isCopy: string = this.$route.query.isCopy
    if (id && id.length > 0) {
      if (isCopy === 'true') {
        this.presentation = 'create'
        this.menuList = [{
          name: '进货退货单',
          url: '/purchaseReturnList'
        }, {
          name: '新建'
        }]
        this.copyPurchaseReturn(id)
      } else {
        this.presentation = 'edit'
        this.getPurchaseReturn(id)
      }
    } else {
      this.presentation = 'create'
      this.menuList = [{
        name: '进货退货',
        url: '/purchaseReturnList'
      }, {
        name: '新建'
      }]
      this.presentation = 'create'
      this.createPurchaseReturn()
    }
    this.listWarehouse()

    this.bindValidator()
  }

  copyPurchaseReturn(id: string) {
    let loading = Loading.show({
      msg: '创建中'
    })
    PurchaseReturnApi.copy(id).then((resp) => {
      loading.hide()
      if (resp.data) {
        this.bill = resp.data as PurchaseReturn
        if (this.bill) {
          for (let line of this.bill.lines) {
            line.sku!.skuMunitList = []
          }
        }
        this.bill.lines.push(new PurchaseReturnLine())
        this.$refs.purchaseReturnTable.editLastRow()
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
      this.$router.back()
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

  getPurchaseReturn(uuid: string) {
    let loading = Loading.show({
      msg: '查询中'
    })
    PurchaseReturnApi.get(uuid).then((resp) => {
      loading.hide()
      if (resp.data) {
        this.bill = resp.data as PurchaseReturn
        if (this.bill) {
          for (let line of this.bill.lines) {
            line.sku!.skuMunitList = []
          }
        }
        this.bill.lines.push(new PurchaseReturnLine())
        this.$refs.purchaseReturnTable.editLastRow()
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
    })
  }

  createPurchaseReturn() {
    let loading = Loading.show({
      msg: '创建中'
    })
    PurchaseReturnApi.create(this.purchase).then((resp) => {
      loading.hide()
      if (resp.data) {
        this.bill = resp.data as PurchaseReturn
        if (this.user) {
          let manager = new Ucn()
          manager.id = this.user.id
          manager.name = this.user.name
          this.bill.manager = manager
        }
        this.isReturnFromPurchase = this.bill.purchase !== undefined && this.bill.purchase !== null && this.bill.purchase !== ''
        if (!this.isReturnFromPurchase) {
          this.bill.lines.push(new PurchaseReturnLine())
        }
        this.bill.lines.map((item) => {
          item.id = ObjectUtil.uuid()
        })
        this.$refs.purchaseReturnTable.editLastRow()
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
      this.$router.back()
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
      PurchaseReturnApi.save(this.bill).then((resp) => {
        loading.hide()
        this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
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
      PurchaseReturnApi.save(this.bill).then((resp) => {
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
      PurchaseReturnApi.saveAndAudit(this.bill).then((resp) => {
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
    let bill: PurchaseReturn = ObjectUtil.copy(this.bill)
    for (let i = bill.lines.length - 1; i >= 0; i--) {
      let line: PurchaseReturnLine = bill.lines[i]
      if (line.sku) {
        delete line.sku!.skuMunitList
        delete line.sku!.times
      }
    }
    this.bill = bill
  }

  toView(id: String) {
    this.$router.replace(`/purchaseReturnView?id=` + id)
  }

  toCreate() {
    this.bill.supplier = new Ucn()
    this.createPurchaseReturn()
    // this.$router.push('/purchaseReturnEdit?dc=' + Date.now())
  }

  onCancel() {
    this.$router.back()
  }

  onSelectionChange(selected: PurchaseReturnLine[]) {
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
      excludes: this.$refs.purchaseReturnTable.getAllSkuIds(),
      callback: (skus: Array<Sku>) => {
        if (skus && skus.length > 0) {
          this.$refs.purchaseReturnTable.addSkus(skus)
          this.$refs.purchaseReturnTable.editLastRow()
        }
      }
    }).show()
  }

  onRemoveLines() {
    this.$msgBox.confirm('删除商品', '确认删除选中商品吗？', () => {
      // if (this.selected.length === this.bill.lines.length) {
      //   this.bill.taxAmount = 0
      //   this.bill.chargeAmount = 0
      //   this.bill.discountAmount = 0
      //   this.bill.amount = 0
      //   this.bill.realAmount = 0
      // }

      this.$refs.purchaseReturnTable.removeLines(this.selected)

    }, () => {
      // do nothing
    })
  }

  onLinesChange() {
    if (this.bill.lines.length <= 0) {
      this.$refs.purchaseReturnTable.addEmptyLine()
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
    this.$refs.purchaseReturnTable.freeTaxRate(this.selected)
  }
}
