import { Component, Vue } from 'vue-property-decorator'
import QfPageBody from 'cmp/PageBody.vue'
import QfBillBody from 'cmp/BillBody.vue'
import QfBillTitle from 'cmp/BillViewTitle.vue'
import InventoryTransfer from 'model/inventory/transfer/InventoryTransfer'
import Warehouse from 'model/basicdata/warehouses/Warehouse'
import WarehouseApi from 'http/basicdata/warehouses/WarehouseApi'
import QueryParam from 'model/request/QueryParam'
import Search from 'cmp/Search.vue'
import Ucn from 'model/entity/Ucn'
import { Dialog, FormValidator, ObjectUtil } from 'fant'
import SkuSelectionWin from 'cmp/selectionwin/SkuSelectionWin.vue'
import InventoryEditTable from 'pages/inventory/cmp/InventoryTransferEditTable.vue'
import InventoryTransferLine from 'model/inventory/transfer/InventoryTransferLine'
import ThinSku from 'model/commons/ThinSku'
import { State } from 'vuex-class'
import User from 'model/framework/user/User'
import CommonUtil from 'util/CommonUtil'
import InventoryTransferApi from 'http/inventory/transfer/InventoryTransferApi'
import OperateLogView from 'cmp/OperateLogView.vue'
import PermissionMgr from 'mgr/PermissionMgr'
import ConstantMgr from 'mgr/ConstantMgr'
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
  menu = [{ name: '库存调拨', url: '/inventoryTransferList' }, { name: '新建调拨单', url: '' }]
  // 页面绑定数据
  bill: InventoryTransfer = new InventoryTransfer()
  // 仓库列表
  warehouseList: Warehouse[] = []
  // 表单验证
  validator: FormValidator = new FormValidator()
  // 已选择
  selected: any[] = []
  // 复制
  copyBillNum: string = ''
  limits = ConstantMgr.limits.inventory
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  $refs: {
    editTable: any
  }
  isEdit: boolean = false

  created() {
    let queryParams = this.$route.query || null
    this.doGetWarehouseList()
    if (queryParams && queryParams.id) {
      if (queryParams.isCopy === 'isCopy') {
        this.doCreateReady()
      } else {
        this.isEdit = true
        this.menu.splice(1, 1, { name: '编辑调拨单', url: '' })
        this.doGetDetail(queryParams.id)
      }
    } else {
      this.doInitData()
      this.doCreateReady()
    }
  }

  mounted() {
    this.validator.push({
      warehouseIn: [{
        required: true, message: '调入仓库不能为空！'
      }],
      warehouseOut: [{
        required: true, message: '调出仓库不能为空！'
      }],
      businessDate: [{
        required: true, message: '业务时间不能为空！'
      }],
      manager: [{
        required: true, message: '经办人不能为空！'
      }],
      qty: [{
        min: 0, message: '最小值为0！'
      }, {
        max: 999999, message: '最大值为999999！'
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
    this.bill.transferDate = new Date()
    this.bill.manager = new Ucn()
    this.bill.manager = this.doGetUcn(this.user)
    this.addEmptyLine(null, false)
  }

  /**
   * 创建单据信息
   */
  doCreateReady() {
    InventoryTransferApi.create().then((resp) => {
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
   * 复制获取对象
   */
  doGetCopy(id: string) {
    InventoryTransferApi.getAndCreate(id).then((resp) => {
      let transferDate: any = resp.data.transferDate
      this.bill = resp.data as InventoryTransfer
      this.bill.transferDate = new Date(Date.parse(transferDate)) as any
      this.addEmptyLine(null, true)
      // if (this.$route.query && this.$route.query.isCopy === 'isCopy') {
      //   this.bill.status = 'unaudited'
      //   this.bill.billNum = CommonUtil.copy(this.copyBillNum)
      // }
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  /**
   * 编辑界面-获取单据详情
   */
  doGetDetail(id: string) {
    InventoryTransferApi.get(id).then((resp) => {
      let transferDate: any = resp.data.transferDate
      this.bill = resp.data as InventoryTransfer
      this.bill.transferDate = new Date(Date.parse(transferDate)) as any
      this.addEmptyLine(null, true)
      // if (this.$route.query && this.$route.query.isCopy === 'isCopy') {
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
    if (!this.bill.outWarehouse) {
      this.$message.warning('请先选择调出仓库')
      return
    }
    new Dialog(SkuSelectionWin, {
      multiple: true,
      warehouse: this.bill.outWarehouse,
      excludes: this.$refs.editTable.getAllSkuIds(),
      callback: (sku: any) => {
        // sku.forEach((item: any) => {
        //   this.addEmptyLine(item, false)
        // })
        if (sku && sku.length > 0) {
          this.$refs.editTable.addSkus(sku)
          this.$refs.editTable.editLastRow()
        }
      }
    }).show()
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
    query.filters.push(new FilterParam('category:=', 'SHOP'))
    WarehouseApi.query(query).then((resp) => {
      this.warehouseList = resp.data
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  /**
   * 添加一个空行
   */
  addEmptyLine(sku: any, isLastLine: boolean) {
    let currSku = sku || null
    let line = new InventoryTransferLine()
    line.sku = new ThinSku()
    if (currSku) {
      line.sku.id = currSku.id
      line.sku.barcode = currSku.barcode
      line.sku.name = currSku.name
      line.sku.code = currSku.code
      line.sku.munit = currSku.munit
      line.sku.category = currSku.category
      line.sku.spec = currSku.spec
      line.sku.qpc = currSku.qpc
      line.remark = ''
      line.id = ObjectUtil.uuid()
      line.qty = 1
      line.merchant = this.user.merchant
      line.inventoryTransfer = ''
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

  /**
   * 检查是否添加了新行
   */
  onChangeList() {
    this.addEmptyLine(null, false)
  }

  /**
   * 监听数据
   * @param {InventoryTransferLine[]} selected
   */
  onSelectionChange(selected: InventoryTransferLine[]) {
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
  dataHandler(data: InventoryTransfer) {
    if (data.lines && data.lines.length) {
      data.lines.splice(data.lines.length - 1, 1) // 处理掉最后一行空行
    }
    data.inWarehouse = this.doGetUcn(data.inWarehouse)
    data.outWarehouse = this.doGetUcn(data.outWarehouse)
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
    if (postData.outWarehouse!.code === postData.inWarehouse!.code) {
      this.$message.error('调出仓库和调入仓库不能是同一个仓库!')
      return false
    }
    this.validator.validate(true).then(() => {
      InventoryTransferApi.saveAndCreate(postData).then((resp) => {
        this.$message.success(ConstantMgr.tips.saveNewAndModifySuccessTip)
        this.menu.splice(1, 1, { name: '新增调拨单', url: '' })
        this.doCreateReady()
        this.$router.replace('/inventoryTransferEdit?')
        // this.bill = new InventoryTransfer()
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
    if (postData.outWarehouse!.code === postData.inWarehouse!.code) {
      this.$message.error('调出仓库和调入仓库不能是同一个仓库!')
      return false
    }
    this.validator.validate(true).then(() => {
      InventoryTransferApi.save(postData).then((resp) => {
        this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
        if (resp.data && resp.data.id) {
          this.$router.replace({ name: 'inventoryTransferView', query: { id: resp.data.id } })
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
    if (postData.outWarehouse!.code === postData.inWarehouse!.code) {
      this.$message.error('调出仓库和调入仓库不能是同一个仓库!')
      return false
    }
    this.validator.validate(true).then(() => {
      InventoryTransferApi.saveAndAudit(postData).then((resp) => {
        this.$message.success(ConstantMgr.tips.saveNewAndAuditSuccessTip)
        if (resp.data && resp.data.id) {
          this.$router.replace({ name: 'inventoryTransferView', query: { id: resp.data.id } })
        }
      }).catch((err) => {
        this.$message.error(err.message)
      })
    }).catch(() => {
      // todo
    })
  }
}
