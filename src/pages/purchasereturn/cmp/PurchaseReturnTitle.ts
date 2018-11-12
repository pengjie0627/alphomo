import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Loading } from 'fant'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import PurchaseReturnApi from 'http/purchasereturn/PurchaseReturnApi'
import PurchaseReturn from 'model/purchasereturn/PurchaseReturn'

@Component({
  name: 'PurchaseReturnTitle',
  components: {}
})
export default class PurchaseReturnTitle extends Vue {
  contextPageInfo: ContextPageInfo = new ContextPageInfo()
  @Prop()
  bill: PurchaseReturn
  @Prop()
  presentation: string
  @Prop()
  ids: string
  @Prop()
  query: string

  @Watch('ids')
  watchIds(value: string) {
    if (value) {
      this.contextPageInfo.ids = JSON.parse(value)
    }
  }

  @Watch('query')
  watchQuery(value: string) {
    if (value) {
      this.contextPageInfo.query = JSON.parse(value)
    }
  }

  @Watch('bill.id', { deep: true })
  watchId(value: string) {
    if (value) {
      this.contextPageInfo.id = value
    }
  }

  mounted() {
    this.contextPageInfo.id = this.bill.id
    this.watchIds(this.ids)
    this.watchQuery(this.query)

  }

  prev() {
    let loading = Loading.show({
      msg: '获取上一单中'
    })
    PurchaseReturnApi.prev(this.contextPageInfo).then(resp => {
      loading.hide()
      if (this.bill.id !== resp.data.id) {
        this.$router.replace({
          name: 'purchaseReturnView',
          query: { id: resp.data.id!, ids: JSON.stringify(resp.data.ids), query: JSON.stringify(resp.data.query) }
        })
        this.contextPageInfo.id = resp.data.id
        this.contextPageInfo.ids = resp.data.ids
        this.contextPageInfo.query = resp.data.query
        this.$emit('getPurchaseReturn', this.contextPageInfo)
      } else {
        this.$message.info('没有上一单了！')
      }
    }).catch((error) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  next() {
    let loading = Loading.show({
      msg: '获取下一单中'
    })
    PurchaseReturnApi.next(this.contextPageInfo).then(resp => {
      loading.hide()
      if (this.bill.id !== resp.data.id) {
        this.$router.replace({
          name: 'purchaseReturnView',
          query: { id: resp.data.id!, ids: JSON.stringify(resp.data.ids), query: JSON.stringify(resp.data.query) }
        })
        this.contextPageInfo.id = resp.data.id
        this.contextPageInfo.ids = resp.data.ids
        this.contextPageInfo.query = resp.data.query
        this.$emit('getPurchaseReturn', this.contextPageInfo)
      } else {
        this.$message.info('没有下一单了！')
      }

    }).catch((error) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  toPurchaseDtl() {
    if (this.$route.query.purchase) {
      this.$router.replace(`/purchaseView?id=${this.$route.query.purchase}`)
    } else {
      this.$router.replace(`/purchaseView?id=${this.bill.purchase}`)
    }
  }


}
PurchaseReturnTitle.filter('status', function (val: string) {
  if (val === 'UNAUDITED') {
    return '草稿'
  } else if (val === 'AUDITED') {
    return '已审核'
  } else if (val === 'PART_RETURNED') {
    return '部分出库'
  } else if (val === 'RETURNED') {
    return '已出库'
  } else if (val === 'ABOLISHED') {
    return '已作废'
  } else {
    return '--'
  }
})

PurchaseReturnTitle.filter('settleStatus', (val: string) => {
  if (val === 'UNSETTLED') {
    return '未结算'
  } else if (val === 'PART_SETTLED') {
    return '部分结算'
  } else if (val === 'SETTLED') {
    return '已结算'
  } else {
    return '--'
  }
})

PurchaseReturnTitle.filter('payStatus', (val: string) => {
  if (val === 'UNPAID') {
    return '未付款'
  } else if (val === 'PART_PAID') {
    return '部分付款'
  } else if (val === 'PAID') {
    return '已付款'
  } else {
    return '--'
  }
})
