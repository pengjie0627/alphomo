import { Component, Vue } from 'vue-property-decorator'
import QfPageBody from 'cmp/PageBody.vue'
import QfBillBody from 'cmp/BillBody.vue'
import QfBillViewTitle from 'cmp/BillViewTitle.vue'
import InventoryViewTable from 'pages/inventory/cmp/InventoryInViewTable.vue'
import InInventoryApi from 'http/inventory/in/InInventoryApi'
import InInventory from 'model/inventory/in/InInventory'
import { Loading } from 'fant'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import PermissionMgr from 'mgr/PermissionMgr'
import PrintView from 'cmp/print/PrintView.vue'
import PrintMaintenanceView from 'cmp/print/PrintMaintenanceView.vue'
import PrintPreView from 'cmp/print/PrintPreView.vue'
import InventoryButton from 'pages/inventory/cmp/InventoryInDetailButton.vue'

@Component({
  components: {
    QfPageBody,
    QfBillBody,
    QfBillViewTitle,
    InventoryViewTable,
    PrintView,
    PrintMaintenanceView,
    PrintPreView,
    InventoryButton
  }
})
export default class InventoryInView extends Vue {
  // 面包屑
  menu = [{
    name: '入库管理',
    url: '/inventoryInList'
  }, {
    name: '入库单详情',
    url: ''
  }]


  // 入库单详情
  bill: InInventory = new InInventory()
  // 详情页面上下文
  contextPageInfo: ContextPageInfo = new ContextPageInfo()
  cacheId: Nullable<string> = ''
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  /**
   * 入库单状态
   * @returns {{type: string; text: string}}
   */
  get status() {
    if (this.bill && this.bill.status) {
      switch (this.bill.status) {
        case 'UNAUDITED':
          return { type: 'warning', text: '未入库' }
        case 'AUDITED':
          return { type: 'success', text: '已入库' }
        case 'ABOLISHED':
          return { type: 'danger', text: '已作废' }
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
    InInventoryApi.detail(id).then((resp) => {
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
    InInventoryApi.prev(this.contextPageInfo).then((resp) => {
      if (resp.data.id !== this.bill.id) {
        this.contextPageInfo = resp.data
        this.doGetDetail(resp.data.id!)
      } else {
        this.$message.info('没有上一单了！')
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
    InInventoryApi.next(this.contextPageInfo).then((resp) => {
      if (resp.data.id !== this.bill.id) {
        this.contextPageInfo = resp.data
        this.doGetDetail(resp.data.id!)
      } else {
        this.$message.info('没有下一单了！')
      }
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }
}

InventoryInView.filter('businessType', function (value: string) {
  if (value) {
    switch (value) {
      case 'Purchase':
        return '进货'
      case 'Sale':
        return '销售'
      case 'CheckInventory':
        return '盘点'
      case 'InventoryTransfer':
        return '调拨'
      case 'PurchaseReturn':
        return '进货退货'
      case 'SaleReturn':
        return '销售退货'
      case 'OtherPaymentLine':
        return '其他支出'
      case 'OtherReceiptLine':
        return '其他收入'
    }
  }
})

InventoryInView.filter('dateFormatter', (val: string) => {
  if (val) {
    let date = val.split(' ')[0]
    return date
  } else {
    return '--'
  }
})
