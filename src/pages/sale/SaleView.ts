import { Component, Vue } from 'vue-property-decorator'
import QfPageBody from 'cmp/PageBody.vue'
import PermissionMgr from 'mgr/PermissionMgr'
import SaleTitle from 'pages/sale/cmp/SaleTitle.vue'
import SaleViewButton from 'pages/sale/cmp/SaleViewButton.vue'
import SaleViewTable from 'pages/sale/cmp/SaleViewTable.vue'
import { Loading } from 'fant'
import SaleApi from 'http/sale/SaleApi'
import Sale from 'model/sale/Sale'
import BillBody from 'cmp/BillBody.vue'
import SaleViewSummary from 'pages/sale/cmp/SaleViewSummary.vue'
import OperateLogView from 'cmp/OperateLogView.vue'
import ContextPageInfo from 'model/commons/ContextPageInfo'

@Component({
  name: 'SaleView',
  components: {
    QfPageBody,
    SaleTitle,
    SaleViewTable,
    SaleViewButton,
    BillBody,
    SaleViewSummary,
    OperateLogView
  }
})

export default class SaleView extends Vue {
  id: string = '0294e8e6-a1fb-461e-ad97-4ee3c744fe3c'
  hasPermissions: Function = PermissionMgr.hasPermissions // 判断是否有权限
  bill: Sale = new Sale()
  presentation = 'view'
  query: string = ''
  ids: string = ''

  // 标题头
  get menu() {
    return [{
      name: '销售单',
      icon: '',
      url: '/saleList'
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
    this.getSale(this.id)
  }

  onGetSale(obj: ContextPageInfo) {
    this.id = obj.id!
    this.query = JSON.stringify(obj.query)
    this.ids = JSON.stringify(obj.ids)
    this.getSale(this.id)
  }

  getSale(uuid: string) {
    let loading = Loading.show({
      msg: '查询中'
    })
    SaleApi.get(uuid).then((resp) => {
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
SaleView.filter('dateFormatter', (val: string) => {
  if (val) {
    let date = val.split(' ')[0]
    return date
  } else {
    return '--'
  }
})


