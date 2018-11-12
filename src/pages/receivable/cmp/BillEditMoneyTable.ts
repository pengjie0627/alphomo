import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Receipt from 'model/statement/receipt/Receipt'
import ConstantMgr from 'mgr/ConstantMgr'

@Component({
  components: {}
})
export default class BillEditMoneyTable extends Vue {
  @Prop()
  receipt: Receipt
  data: Array<string> = ['1']
  limits = ConstantMgr.limits.payable

  @Watch('receipt', { deep: true })
  watchReceipt(value: Receipt) {
    this.receipt.discountAmount = value.discountAmount
    this.receipt.amount = value.amount
    this.receipt.rcvdAmount = value.rcvdAmount
    this.receipt.totalRcvdAmount = value.totalRcvdAmount
  }

  onAmountChange() {
    if (this.receipt.rcvdAmount.toString() !== '' && this.receipt.discountAmount.toString() !== '') {
      this.receipt.totalRcvdAmount = parseFloat(this.receipt.rcvdAmount.toString()) + parseFloat(this.receipt.discountAmount.toString())
      this.receipt.remainAmount = parseFloat(this.receipt.amount.toString()) - parseFloat(this.receipt.totalRcvdAmount.toString())
    } else {
      if (this.receipt.rcvdAmount.toString() === '') {
        this.receipt.rcvdAmount = 0
      }
      if (this.receipt.discountAmount.toString() === '') {
        this.receipt.discountAmount = 0
      }
    }

    this.$emit('getSumAmount', this.receipt)
  }

  mounted() {
    this.watchReceipt(this.receipt)
  }
}
BillEditMoneyTable.filter('priceFormatter', (value: string) => {
  if (value) {
    return Number(value).toFixed(2)
  } else {
    return '0.00'
  }
})
