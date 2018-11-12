import { Component, Vue } from 'vue-property-decorator'
import QfPageBody from 'cmp/PageBody.vue'
import PermissionMgr from 'mgr/PermissionMgr'
import PurchaseTitle from 'pages/purchase/cmp/PurchaseTitle.vue'
import DetailButton from 'pages/purchase/cmp/PurchaseViewButton.vue'
import DetailTable from 'pages/purchase/cmp/PurchaseViewTable.vue'
import { Loading } from 'fant'
import PurchaseApi from 'http/purchase/PurchaseApi'
import Purchase from 'model/purchase/Purchase'
import BillBody from 'cmp/BillBody.vue'
import PurchaseViewHeader from 'pages/purchase/cmp/PurchaseViewHeader.vue'
import PurchaseViewSummary from 'pages/purchase/cmp/PurchaseViewSummary.vue'
import OperateLogView from 'cmp/OperateLogView.vue'
import ContextPageInfo from 'model/commons/ContextPageInfo'

@Component({
  name: 'PurchaseView',
  components: {
    QfPageBody,
    PurchaseTitle,
    DetailTable,
    DetailButton,
    BillBody,
    PurchaseViewHeader,
    PurchaseViewSummary,
    OperateLogView
  }
})

export default class PurchaseView extends Vue {
  id: string = '0294e8e6-a1fb-461e-ad97-4ee3c744fe3c'
  hasPermissions: Function = PermissionMgr.hasPermissions // 判断是否有权限
  bill: Purchase = new Purchase()
  presentation = 'view'
  query: string = ''
  ids: string = ''
  hasPermission = PermissionMgr.hasOptionPermission

  // 标题头
  get menu() {
    return [{
      name: '进货单',
      icon: '',
      url: '/purchaseList'
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
    this.getPurchase(this.id)
  }

  onGetPurchase(obj: ContextPageInfo) {
    this.id = obj.id!
    this.query = JSON.stringify(obj.query)
    this.ids = JSON.stringify(obj.ids)
    this.getPurchase(this.id)
  }

  getPurchase(uuid: string) {
    let loading = Loading.show({
      msg: '查询中'
    })
    PurchaseApi.get(uuid).then((resp) => {
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
PurchaseView.filter('dateFormatter', (val: string) => {
  if (val) {
    let date = val.split(' ')[0]
    return date
  } else {
    return '--'
  }
})

