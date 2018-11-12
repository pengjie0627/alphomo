import { Component, Vue } from 'vue-property-decorator'
import QfPageBody from 'cmp/PageBody.vue'
import QfBillBody from 'cmp/BillBody.vue'
import QfBillTitle from 'cmp/BillViewTitle.vue'
import Warehouse from 'model/basicdata/warehouses/Warehouse'
import WarehouseApi from 'http/basicdata/warehouses/WarehouseApi'
import QueryParam from 'model/request/QueryParam'
import Search from 'cmp/Search.vue'
import Ucn from 'model/entity/Ucn'
import { Dialog, FormValidator, ObjectUtil } from 'fant'
import SkuSelectionWin from 'cmp/selectionwin/SkuSelectionWin.vue'
import InventoryEditTable from 'pages/inventory/cmp/InventoryCheckEditTable.vue'
import { State } from 'vuex-class'
import User from 'model/framework/user/User'
import CommonUtil from 'util/CommonUtil'
import CheckInventory from 'model/inventory/check/CheckInventory'
import CheckInventoryApi from 'http/inventory/check/CheckInventoryApi'
import CheckInventoryLine from 'model/inventory/check/CheckInventoryLine'
import ThinSku from 'model/commons/ThinSku'
import OperateLogView from 'cmp/OperateLogView.vue'
import ConstantMgr from 'mgr/ConstantMgr'
import PermissionMgr from 'mgr/PermissionMgr'
import FilterParam from 'model/request/FilterParam'

@Component({
  name: 'InventoryTransferEdit',
  components: {
    QfPageBody,
    QfBillBody,
    QfBillTitle,
    Search,
    InventoryEditTable,
    OperateLogView
  }
})
export default class InventoryTransferEdit extends Vue {
  @State('user') user: User
  // 面包屑
  menu = [{ name: '库存盘点', url: '/inventoryCheckList' }, { name: '新建盘点单', url: '' }]
  // 页面绑定数据
  bill: CheckInventory = new CheckInventory()
  // 仓库列表
  warehouseList: Warehouse[] = []
  // 表单验证
  validator: FormValidator = new FormValidator()
  // 已选择
  selected: any[] = []
  // 复制单号
  copyBillNum: string = ''
  isLastLine: boolean = false
  isEdit: boolean = false
  limits = ConstantMgr.limits.inventory
  hasPermissions: Function = PermissionMgr.hasOptionPermission
  oldWarehouse: Ucn = new Ucn()
  $refs: {
    goodsTable: any
  }

  created() {
    let queryParams = this.$route.query || null
    this.doGetWarehouseList()
    if (queryParams && queryParams.id) {
      this.isLastLine = true
      if (queryParams.isCopy === 'true') {
        this.doCreateReady()
      } else {
        this.isEdit = true
        this.menu.splice(1, 1, { name: '编辑盘点单', url: '' })
        this.doGetDetail(queryParams.id)
      }
    } else {
      this.doInitData()
      this.doCreateReady()
    }
  }

  mounted() {
    this.validator.push({
      warehouse: [{
        required: true, message: '盘点仓库不能为空！'
      }],
      businessDate: [{
        required: true, message: '盘点日期不能为空！'
      }],
      manager: [{
        required: true, message: '经办人不能为空！'
      }],
      qty: [{
        required: true, message: '实盘数量不能为空！'
      }, {
        min: 0, message: '实盘数量不能小于0！'
      }]
    })
  }

  // 监听删除状态
  get onDeletedStatus() {
    return this.selected && this.selected.length && this.selected.some((item) => {
      return item.sku && item.sku.id
    })
  }

  /**
   * 初始化数据
   */
  doInitData() {
    this.bill.checkDate = new Date()
    this.bill.manager = new Ucn()
    this.bill.manager = this.doGetUcn(this.user)
    this.addEmptyLine(null, false)
  }

  onLinesChange() {
    if (this.bill.lines.length <= 0) {
      this.$refs.goodsTable.addEmptyLine()
    }
    let amount: number = 0
    let taxAmount: number = 0
    this.bill.lines.forEach(line => {
      amount += Number(line.amount)
    })
    this.bill.lossAmount = amount
    this.bill.profitAmount = taxAmount
  }

  /**
   * 创建单据信息
   */
  doCreateReady() {
    CheckInventoryApi.create().then((resp) => {
      this.bill = resp.data
      this.copyBillNum = resp.data.billNum!
      this.bill.lines = []
      this.doInitData()
      if (this.$route.query && this.$route.query.isCopy) {
        this.doGetCopy(this.$route.query.id)
      }
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  /**
   * 复制界面-获取单据详情
   */
  doGetCopy(id: string) {
    CheckInventoryApi.getAndCreate(id).then((resp) => {
      let checkDate: any = resp.data.checkDate
      this.bill = resp.data as CheckInventory
      this.bill.checkDate = new Date(Date.parse(checkDate)) as any
      this.addEmptyLine(null, true)
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  /**
   * 编辑界面-获取单据详情
   */
  doGetDetail(id: string) {
    CheckInventoryApi.get(id).then((resp) => {
      let checkDate: any = resp.data.checkDate
      this.bill = resp.data as CheckInventory
      this.bill.checkDate = new Date(Date.parse(checkDate)) as any
      this.addEmptyLine(null, true)
      // if (this.$route.query && this.$route.query.isCopy === 'true') {
      //   this.bill.id = ObjectUtil.uuid()
      //   this.bill.status = 'unaudited'
      //   this.bill.billNum = CommonUtil.copy(this.copyBillNum)
      // }
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  /**
   * 添加商品
   */
  onAddSku() {
    if (!this.bill.warehouse) {
      this.$message.warning('请先选择仓库')
      return
    }
    new Dialog(SkuSelectionWin, {
      warehouse: this.bill.warehouse,
      multiple: true,
      excludes: this.$refs.goodsTable.getAllSkuIds(),
      callback: (sku: any) => {
        // sku.forEach((item: any) => {
        //   this.addEmptyLine(item, false)
        // })
        if (sku && sku.length > 0) {
          this.$refs.goodsTable.addSkus(sku)
          this.$refs.goodsTable.editLastRow()
        }
      }
    }).show()
  }

  addEmptyLine(sku: any, isLastLine: boolean) {
    let currSku = sku || null
    let line = new CheckInventoryLine()
    line.sku = new ThinSku()
    if (currSku) {
      line.sku.id = currSku.id
      line.sku.barcode = currSku.barcode
      line.sku.name = currSku.name
      line.sku.code = currSku.code
      line.paperQty = currSku.inventory
      line.sku.munit = currSku.munit
      line.sku.category = currSku.category
      line.sku.spec = currSku.spec
      line.sku.qpc = currSku.qpc
      line.costPrice = currSku.costPrice
      line.remark = ''
      line.id = ObjectUtil.uuid()
      line.qty = 1
      line.amount = (1 - Number(line.paperQty)) * Number(line.costPrice)
      line.merchant = this.user.merchant

    }
    line.id = ObjectUtil.uuid()
    if (!this.bill.lines || !this.bill.lines.length) {
      this.bill.lines = []
    }
    if (isLastLine) {
      this.bill.lines.splice(this.bill.lines.length, 0, line)
    } else {
      this.bill.lines.splice(this.bill.lines.length - 1, 0, line)
    }

  }

  getAllSkuIds(): string[] {
    let ids: string[] = []
    this.bill.lines.forEach((item) => {
      if (item.sku && item.sku.id) {
        ids.push(item.sku.id)
      }
    })
    return ids
  }

  /**
   * 获取UCN对象
   */
  doGetUcn(ucn: any) {
    let newValue = new Ucn()
    if (ucn) {
      newValue.id = ucn.id
      newValue.name = ucn.name
      newValue.code = ucn.code
    }
    return newValue
  }

  /**
   * 获取仓库列表
   */
  doGetWarehouseList() {
    let query: QueryParam = new QueryParam()
    query.filters.push(new FilterParam('category:=', 'NORMAL'))
    query.filters.push(new FilterParam('category:=', 'CAR'))
    WarehouseApi.query(query).then((resp) => {
      this.warehouseList = resp.data
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }


  /**
   * 检查是否添加了新行
   */
  onChangeList() {
    this.addEmptyLine(null, false)
  }

  /**
   * 监听数据
   * @param {CheckInventoryLine[]} selected
   */
  onSelectionChange(selected: CheckInventoryLine[]) {
    this.selected = selected
  }

  /**
   * 删除行数据
   */
  doDeletedLine() {
    this.$msgBox.confirm('删除商品行', '请确认是否删除所选中的商品行？', () => {
      let selectedLine = CommonUtil.copy(this.selected).filter((item: any) => {
        return item.sku && item.sku.id
      })
      this.bill.lines = CommonUtil.copy(this.bill.lines).filter((item: any) => {
        let isExist = selectedLine.some((item1: any) => {
          return item.sku.id === item1.sku.id
        })
        return !isExist
      })
    })
  }

  setRowCustomer(manager: Ucn) {
    if (!manager) {
      return new Ucn()
    }
    this.bill.manager!.id = manager.id
    this.bill.manager!.code = manager.code
    this.bill.manager!.name = manager.name
  }

  onCustomerClear() {
    this.bill.manager = null
  }

  /**
   * 取消新增或编辑
   */
  doCancelEdit() {
    this.$router.back()
  }

  /**
   * 数据格式处理
   * @param {InventoryTransfer} data
   * @returns {InventoryTransfer}
   */
  dataHandler(data: CheckInventory) {
    if (data.lines && data.lines.length) {
      data.lines.splice(data.lines.length - 1, 1) // 处理掉最后一行空行
    }
    data.warehouse = this.doGetUcn(data.warehouse)
    return data
  }

  /**
   * 保存并新增
   */
  doSaveAndCreate() {
    let postData = this.dataHandler(CommonUtil.copy(this.bill))
    if (!(postData.lines && postData.lines.length)) {
      this.$message.error('至少需要添加一行商品!')
      return false
    }
    this.validator.validate(true).then(() => {
      CheckInventoryApi.saveAndCreate(postData).then((resp) => {
        this.$message.success(ConstantMgr.tips.saveNewAndModifySuccessTip)
        this.menu.splice(1, 1, { name: '新增盘点单', url: '' })
        this.$router.replace('/inventoryCheckEdit')
        this.doCreateReady()
      }).catch((err) => {
        this.$message.error(err.message)
      })
    }).catch(() => {
      // todo
    })
  }

  /**
   * 保存
   */
  doSave() {
    // todo
    let postData = this.dataHandler(CommonUtil.copy(this.bill))
    if (!(postData.lines && postData.lines.length)) {
      this.$message.error('至少需要添加一行商品!')
      return false
    }
    this.validator.validate(true).then(() => {
      CheckInventoryApi.save(postData).then((resp) => {
        this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
        if (resp.data && resp.data.id) {
          this.$router.replace({ name: 'inventoryCheckView', query: { id: resp.data.id } })
        }
      }).catch((err) => {
        this.$message.error(err.message)
      })
    }).catch(() => {
      // todo
    })
  }

  /**
   * 保存并审核
   */
  doSaveAndAudit() {
    // todo
    let postData = this.dataHandler(CommonUtil.copy(this.bill))
    if (!(postData.lines && postData.lines.length)) {
      this.$message.error('至少需要添加一行商品!')
      return false
    }
    this.validator.validate(true).then(() => {
      CheckInventoryApi.saveAndAudit(postData).then((resp) => {
        this.$message.success(ConstantMgr.tips.saveNewAndAuditSuccessTip)
        if (resp.data && resp.data.id) {
          this.$router.replace({ name: 'inventoryCheckView', query: { id: resp.data.id } })
        }
      }).catch((err) => {
        this.$message.error(err.message)
      })
    }).catch(() => {
      // todo
    })
  }

  doWarehouseChange(newWarehouse: Ucn) {
    if (newWarehouse && this.bill.lines && this.bill.lines.length > 1) {
      this.$msgBox.confirm('更换仓库', '更换仓库将清空商品明细，是否继续？', () => {
        this.bill.lines = []
        this.addEmptyLine(null, true)
        this.oldWarehouse = newWarehouse
      }, () => {
        this.bill.warehouse = this.oldWarehouse
      })
    } else {
      this.oldWarehouse = newWarehouse
    }
  }
}
