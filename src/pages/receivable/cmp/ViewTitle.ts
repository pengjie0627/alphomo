import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Loading } from 'fant'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import Receipt from 'model/statement/receipt/Receipt'
import ReceiptApi from 'http/statement/receipt/ReceiptApi'

@Component({
  components: {}
})
export default class ViewTitle extends Vue {
  customer: string
  contextPageInfo: ContextPageInfo = new ContextPageInfo()
  @Prop()
  receipt: Receipt
  @Prop() // 页面
  title: string
  @Prop()
  ids: string
  @Prop()
  query: string
  @Prop()
  isView: boolean
  @Prop()
  billNum: string


  @Watch('receipt', { deep: true })
  watchReceipt(val: Receipt) {
    this.receipt = val
    this.receipt.status = val.status!
    // this.status = val.status!
    this.receipt.billNum = val.billNum!
    this.customer = val.customer!.name!
    this.contextPageInfo.id = this.receipt.id
  }

  @Watch('receipt.billNum', { deep: true })
  watchReceiptBill(val: string) {
    this.receipt.billNum = val
  }

  @Watch('ids')
  watchIds(value: string) {
    if (value) {
      this.contextPageInfo.ids = JSON.parse(value)
    }
  }

  @Watch('receipt.billNum')
  watchBillNum(value: string) {
    this.receipt.billNum = value
  }

  @Watch('query')
  watchQuery(value: string) {
    if (value) {
      this.contextPageInfo.query = JSON.parse(value)
    }
  }

  mounted() {
    this.contextPageInfo.id = this.receipt.id
    this.watchBillNum(this.billNum)
    this.watchIds(this.ids)
    this.watchQuery(this.query)
    this.watchReceipt(this.receipt)
  }

  prev() {
    let loading = Loading.show({
      msg: '获取上一单中'
    })
    ReceiptApi.prev(this.receipt.customer!.id!, this.contextPageInfo).then(resp => {
      loading.hide()
      if (this.receipt.id !== resp.data.id) {
        this.contextPageInfo.id = resp.data.id
        this.contextPageInfo.ids = resp.data.ids
        this.contextPageInfo.query = resp.data.query
        this.$emit('getDetail', this.contextPageInfo)
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
    ReceiptApi.next(this.receipt.customer!.id!, this.contextPageInfo).then(resp => {
      loading.hide()
      if (this.receipt.id !== resp.data.id) {
        this.contextPageInfo.id = resp.data.id
        this.contextPageInfo.ids = resp.data.ids
        this.contextPageInfo.query = resp.data.query
        this.$emit('getDetail', this.contextPageInfo)
      } else {
        this.$message.info('没有下一单了！')
      }

    }).catch((error) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

}
ViewTitle.filter('settleFormatter', (value: string) => {
  if (value) {
    let statusText: string = ''
    switch (value) {
      case 'UNSETTLED':
        statusText = '未核销'
        break
      case 'PART_SETTLED':
        statusText = '部分核销'
        break
      case 'SETTLED':
        statusText = '已核销'
        break
      default:
        statusText = '--'
    }
    return statusText
  } else {
    return '--'
  }
})
ViewTitle.filter('statusFormatter', (value: string) => {
  if (value) {
    let statusText: string = ''
    switch (value) {
      case 'UNAUDITED':
        statusText = '未审核'
        break
      case 'AUDITED':
        statusText = '已审核'
        break
      case 'ABOLISHED':
        statusText = '已作废'
        break
      default:
        statusText = '--'
    }
    return statusText
  } else {
    return '--'
  }
})
