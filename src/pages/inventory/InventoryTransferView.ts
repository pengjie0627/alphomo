import {Component, Vue} from 'vue-property-decorator'
import QfPageBody from 'cmp/PageBody.vue'
import QfBillBody from 'cmp/BillBody.vue'
import QfBillViewTitle from 'cmp/BillViewTitle.vue'
import InventoryViewTable from 'pages/inventory/cmp/InventoryTransferViewTable.vue'
import {Loading} from 'fant'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import InventoryTransfer from 'model/inventory/transfer/InventoryTransfer'
import InventoryTransferApi from 'http/inventory/transfer/InventoryTransferApi'
import InventoryDetailButton from 'pages/inventory/cmp/InventoryDetailButton.vue'
import OperateLogView from 'cmp/OperateLogView.vue'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  components: {
    QfPageBody,
    QfBillBody,
    QfBillViewTitle,
    InventoryViewTable,
    InventoryDetailButton,
    OperateLogView
  }
})
export default class InventoryTransferView extends Vue {
  // 面包屑
  menu = [{
    name: '库存调拨',
    url: '/inventoryTransferList'
  }, {
    name: '调拨单详情',
    url: ''
  }]


  // 出库单详情
  bill: InventoryTransfer = new InventoryTransfer()
  // 详情页面上下文
  contextPageInfo: ContextPageInfo = new ContextPageInfo()
  cacheId: Nullable<string> = ''
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  /**
   * 出库单状态
   * @returns {{type: string; text: string}}
   */
  get status() {
    if (this.bill && this.bill.status) {
      switch (this.bill.status) {
        case 'unaudited':
          return {type: 'warning', text: '草稿'}
        case 'audited':
          return {type: 'info', text: '已审核'}
        case 'placed':
          return {type: 'info', text: '已入库'}
        case 'delivered':
          return {type: 'danger', text: '已出库'}
        case 'abolished':
          return {type: 'danger', text: '已作废'}
        case 'applying':
          return {type: 'warning', text: '申请中'}
      }
    }
  }

  /**
   * 挂载前数据处理
   */
  created() {
    if (this.$route.query && this.$route.query.id) {
      this.contextPageInfo.id = this.$route.query.id
      this.doGetDetail(this.$route.query.id)
    }
    if (this.$route.params && this.$route.params.ids) {
      this.contextPageInfo.ids = JSON.parse(this.$route.params.ids)
      this.contextPageInfo.query = JSON.parse(this.$route.params.query)
    }
  }

  /**
   * 获取详情
   * @param {string} id
   */
  doGetDetail(id: string) {
    let loading = Loading.show()
    InventoryTransferApi.get(id).then((resp) => {
      this.bill = resp.data
      loading.hide()
    }).catch((err) => {
      loading.hide()
      this.$message.error(err.message)
    })
  }

  /**
   * 上一单
   */
  prev() {
    // todo
    InventoryTransferApi.getPrev(this.contextPageInfo).then((resp) => {
      if (resp.data.id !== this.bill.id) {
        this.contextPageInfo = resp.data
        this.doGetDetail(resp.data!.id!)
      } else {
        this.$message.info('没有上一单了！')
        return
      }
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  /**
   * 下一单
   */
  next() {
    // todo
    InventoryTransferApi.getNext(this.contextPageInfo).then((resp) => {
      if (resp.data.id !== this.bill.id) {
        this.contextPageInfo = resp.data
        this.doGetDetail(resp.data!.id!)
      } else {
        this.$message.info('没有下一单了！')
        return
      }
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  /**
   * 跳转到出库界面
   */
  doAudit() {
    this.$router.push({
      name: 'inventoryOutEdit',
      query: {id: this.$route.query.id}
    })
  }

  /**
   * 打印
   */
  doPrint() {
    window.print()
  }
}
/**
 * 表格过滤器： 分类
 */
InventoryTransferView.filter('categoryFormatter', (value: string) => {
  if (value) {
    switch (value) {
      case 'CAR_PICKUP':
        return '提货申请'
      case 'CAR_BACK':
        return '回库申请'
      case 'MASTER_TO_SHOP':
        return '门店配货'
      case 'SHOP_TO_SHOP':
        return '门店调拨'
      case 'SHOP_TO_MASTER':
        return '门店退货'
      default:
        break
    }
  }
  return '一般调拨'
})

InventoryTransferView.filter('dateFormatter', (val: string) => {
  if (val) {
    let date = val.split(' ')[0]
    return date
  } else {
    return '--'
  }
})
