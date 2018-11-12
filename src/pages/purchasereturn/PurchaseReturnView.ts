import { Component, Vue } from 'vue-property-decorator'
import QfPageBody from 'cmp/PageBody.vue'
import PermissionMgr from 'mgr/PermissionMgr'
import PurchaseReturnTitle from 'pages/purchasereturn/cmp/PurchaseReturnTitle.vue'
import DetailButton from 'pages/purchasereturn/cmp/PurchaseReturnViewButton.vue'
import PurchaseReturnViewTable from 'pages/purchasereturn/cmp/PurchaseReturnViewTable.vue'
import { Loading } from 'fant'
import BillBody from 'cmp/BillBody.vue'
import PurchaseReturnViewHeader from 'pages/purchasereturn/cmp/PurchaseReturnViewHeader.vue'
import PurchaseReturnViewSummary from 'pages/purchasereturn/cmp/PurchaseReturnViewSummary.vue'
import OperateLogView from 'cmp/OperateLogView.vue'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import PurchaseReturn from 'model/purchasereturn/PurchaseReturn'
import PurchaseReturnApi from 'http/purchasereturn/PurchaseReturnApi'

@Component({
  name: 'PurchaseReturnView',
  components: {
    QfPageBody,
    PurchaseReturnTitle,
    PurchaseReturnViewTable,
    DetailButton,
    BillBody,
    PurchaseReturnViewHeader,
    PurchaseReturnViewSummary,
    OperateLogView
  }
})

export default class PurchaseReturnView extends Vue {
  id: string = '0294e8e6-a1fb-461e-ad97-4ee3c744fe3c'
  hasPermissions = PermissionMgr.hasOptionPermission// 判断是否有权限
  bill: PurchaseReturn = new PurchaseReturn()
  presentation = 'view'
  query: string = ''
  ids: string = ''

  // 标题头
  get menu() {
    return [{
      name: '进货退货单',
      icon: '',
      url: '/purchaseReturnList'
    }, {
      name: '详情',
      icon: '',
      url: ''
    }]
  }

  data() {
    return {
      bill: {
        supplier: {},
        warehouse: {},
        manager: {}
      }
    }
  }

  mounted() {
    this.id = this.$route.query.id
    this.query = this.$route.query.query
    this.ids = this.$route.query.ids
    this.getPurchaseReturn(this.id)
  }

  onGetPurchaseReturn(obj: ContextPageInfo) {
    this.id = obj.id!
    this.query = JSON.stringify(obj.query)
    this.ids = JSON.stringify(obj.ids)
    this.getPurchaseReturn(this.id)
  }

  getPurchaseReturn(uuid: string) {
    let loading = Loading.show({
      msg: '查询中'
    })
    PurchaseReturnApi.get(uuid).then((resp) => {
      loading.hide()
      if (resp.data) {
        this.bill = resp.data
        console.log(this.bill)
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
    })
  }

}
PurchaseReturnView.filter('dateFormatter', (val: string) => {
  if (val) {
    let date = val.split(' ')[0]
    return date
  } else {
    return '--'
  }
})
