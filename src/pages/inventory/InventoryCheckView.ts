import { Component, Vue } from 'vue-property-decorator'
import QfPageBody from 'cmp/PageBody.vue'
import QfBillBody from 'cmp/BillBody.vue'
import QfBillViewTitle from 'cmp/BillViewTitle.vue'
import InventoryCheckViewTable from 'pages/inventory/cmp/InventoryCheckViewTable.vue'
import { Loading } from 'fant'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import InventoryDetailButton from 'pages/inventory/cmp/InventoryCheckButton.vue'
import CheckInventoryApi from 'http/inventory/check/CheckInventoryApi'
import CheckInventory from 'model/inventory/check/CheckInventory'
import InventoryCheckSummary from 'pages/inventory/cmp/InventoryCheckSummary.vue'
import OperateLogView from 'cmp/OperateLogView.vue'
import CheckInventoryLine from 'model/inventory/check/CheckInventoryLine'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  components: {
    QfPageBody,
    QfBillBody,
    QfBillViewTitle,
    InventoryCheckViewTable,
    InventoryDetailButton,
    InventoryCheckSummary,
    OperateLogView
  }
})
export default class InventoryCheckView extends Vue {
  // 面包屑
  menu = [{
    name: '库存盘点',
    url: '/inventoryCheckList'
  }, {
    name: '盘点单详情',
    url: ''
  }]


  // 出库单详情
  bill: CheckInventory = new CheckInventory()
  // 详情页面上下文
  contextPageInfo: ContextPageInfo = new ContextPageInfo()
  cacheId: Nullable<string> = ''
  // 商品种类
  skuType: string = '全部商品'
  lines: CheckInventoryLine[] = []
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  /**
   * 出库单状态
   * @returns {{type: string; text: string}}
   */
  get status() {
    if (this.bill && this.bill.status) {
      switch (this.bill.status) {
        case 'unaudited':
          return { type: 'warning', text: '草稿' }
        case 'audited':
          return { type: 'info', text: '已审核' }
        case 'abolish':
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
    CheckInventoryApi.get(id).then((resp) => {
      this.bill = resp.data
      loading.hide()
    }).catch((err) => {
      loading.hide()
      this.$message.error(err.message)
    })
  }

  doSearchSkuLine() {
    console.log('1')
  }

  /**
   * 上一单
   */
  prev() {
    // this.contextPageInfo
    CheckInventoryApi.getPrev(this.contextPageInfo).then((resp) => {
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
    CheckInventoryApi.getNext(this.contextPageInfo).then((resp) => {
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
      query: { id: this.$route.query.id }
    })
  }

  /**
   * 打印
   */
  doPrint() {
    window.print()
  }
}
InventoryCheckView.filter('dateFormatter', (val: string) => {
  if (val) {
    let date = val.split(' ')[0]
    return date
  } else {
    return '--'
  }
})
