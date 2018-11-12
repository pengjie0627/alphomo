import { Component, Vue } from 'vue-property-decorator'
import QfPageBody from 'cmp/PageBody.vue'
import PermissionMgr from 'mgr/PermissionMgr'
import SaleReturnTitle from 'pages/salereturn/cmp/SaleReturnTitle.vue'
import SaleReturnViewButton from 'pages/salereturn/cmp/SaleReturnViewButton.vue'
import SaleReturnViewTable from 'pages/salereturn/cmp/SaleReturnViewTable.vue'
import { Loading } from 'fant'
import SaleReturnApi from 'http/salereturn/SaleReturnApi'
import SaleReturn from 'model/salereturn/SaleReturn'
import BillBody from 'cmp/BillBody.vue'
import SaleReturnViewSummary from 'pages/salereturn/cmp/SaleReturnViewSummary.vue'
import OperateLogView from 'cmp/OperateLogView.vue'
import ContextPageInfo from 'model/commons/ContextPageInfo'

@Component({
  name: 'SaleReturnView',
  components: {
    QfPageBody,
    SaleReturnTitle,
    SaleReturnViewTable,
    SaleReturnViewButton,
    BillBody,
    SaleReturnViewSummary,
    OperateLogView
  }
})

export default class SaleReturnView extends Vue {
  id: string = '0294e8e6-a1fb-461e-ad97-4ee3c744fe3c'
  hasPermissions: Function = PermissionMgr.hasPermissions // 判断是否有权限
  bill: SaleReturn = new SaleReturn()
  presentation = 'view'
  query: string = ''
  ids: string = ''

  // 标题头
  get menu() {
    return [{
      name: '销售退货单',
      icon: '',
      url: '/saleReturnList'
    }, {
      name: '详情',
      icon: '',
      url: ''
    }]
  }

  data() {
    return {
      bill: {
        customer: {},
        warehouse: {},
        manager: {}
      }
    }
  }

  mounted() {
    this.id = this.$route.query.id
    this.query = this.$route.params.query || ''
    this.ids = this.$route.params.ids || ''
    this.getSaleReturn(this.id)
  }

  onGetSaleReturn(obj: ContextPageInfo) {
    this.id = obj.id!
    this.query = JSON.stringify(obj.query)
    this.ids = JSON.stringify(obj.ids)
    this.getSaleReturn(this.id)
  }

  getSaleReturn(uuid: string) {
    let loading = Loading.show({
      msg: '查询中'
    })
    SaleReturnApi.get(uuid, false).then((resp) => {
      loading.hide()
      if (resp.data) {
        this.bill = resp.data
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
    })
  }

}
SaleReturnView.filter('dateFormatter', (val: string) => {
  if (val) {
    let date = val.split(' ')[0]
    return date
  } else {
    return '--'
  }
})


