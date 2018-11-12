import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Purchase from 'model/purchase/Purchase.ts'
import { Loading } from 'fant'
import PurchaseApi from 'http/purchase/PurchaseApi'
import ContextPageInfo from 'model/commons/ContextPageInfo'

@Component({
  name: 'PurchaseTitle',
  components: {}
})
export default class PurchaseTitle extends Vue {
  contextPageInfo: ContextPageInfo = new ContextPageInfo()
  @Prop()
  bill: Purchase
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
    PurchaseApi.prev(this.contextPageInfo).then(resp => {
      loading.hide()
      if (this.bill.id !== resp.data.id) {
        this.$router.replace({
          name: 'purchaseView',
          query: {
            id: resp.data.id!,
            ids: JSON.stringify(resp.data.ids),
            query: JSON.stringify(resp.data.query)
          }
        })
        this.contextPageInfo.id = resp.data.id
        this.contextPageInfo.ids = resp.data.ids
        this.contextPageInfo.query = resp.data.query
        this.$emit('getPurchase', this.contextPageInfo)
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
    PurchaseApi.next(this.contextPageInfo).then(resp => {
      loading.hide()
      if (this.bill.id !== resp.data.id) {
        this.$router.replace({
          name: 'purchaseView',
          query: {
            id: resp.data.id!,
            ids: JSON.stringify(resp.data.ids),
            query: JSON.stringify(resp.data.query)
          }
        })
        this.contextPageInfo.id = resp.data.id
        this.contextPageInfo.ids = resp.data.ids
        this.contextPageInfo.query = resp.data.query
        this.$emit('getPurchase', this.contextPageInfo)
      } else {
        this.$message.info('没有下一单了！')
      }

    }).catch((error) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  toPurchaseRtnDtl(id: string) {
    this.$router.push({ name: 'purchaseReturnView', query: { id: id } })
  }


}
PurchaseTitle.filter('status', function (val: string) {
  if (val === 'UNAUDITED') {
    return '草稿'
  } else if (val === 'AUDITED') {
    return '已审核'
  } else if (val === 'PART_RECEIVED') {
    return '部分收货'
  } else if (val === 'RECEIVED') {
    return '已收货'
  } else if (val === 'ABOLISHED') {
    return '已作废'
  } else {
    return '--'
  }
})

PurchaseTitle.filter('settleStatus', (val: string) => {
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

PurchaseTitle.filter('payStatus', (val: string) => {
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
