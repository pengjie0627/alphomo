import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Receipt from 'model/statement/receipt/Receipt'

class AmountObj {
  'remainAmount': number = 0
  'rcvdAmount': number = 0
  'totalRcvdAmount': number = 0
  'discountAmount': number = 0
  'amount': number = 0

}

@Component({
  components: {}
})
export default class BillViewMoneyTable extends Vue {
  @Prop()
  receipt: Receipt
  data: Array<AmountObj> = []
  obj: AmountObj = new AmountObj()

  @Watch('receipt')
  watchReceipt(value: Receipt) {
    this.receipt = value
    if (value.billNum) {
      this.data = []
      this.obj.rcvdAmount = this.receipt.rcvdAmount
      this.obj.discountAmount = this.receipt.discountAmount
      this.obj.amount = this.receipt.amount
      this.obj.remainAmount = this.receipt.remainAmount
      this.obj.totalRcvdAmount = this.receipt.totalRcvdAmount
      this.data.push(this.obj)
    }
  }

  mounted() {
    this.watchReceipt(this.receipt)
  }

  priceFormatter(row: any, column: any, value: string) {
    if (value) {
      return Number(value).toFixed(2)
    } else {
      return '0.00'
    }
  }

}
