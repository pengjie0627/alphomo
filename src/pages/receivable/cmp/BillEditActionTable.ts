import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { DateUtil, Dialog, FormValidator } from 'fant'
import verificationOther from 'pages/receivable/cmp/VerificationOther.vue'
import VerificationSheet from 'pages/receivable/cmp/VerificationSheet.vue'
import PayBill from 'model/entity/PayBill'
import ReceiptLine from 'model/statement/receipt/ReceiptLine'
import Receipt from 'model/statement/receipt/Receipt'

@Component({
  components: {
    verificationOther,
    VerificationSheet
  }
})
export default class BillEditActionTable extends Vue {
  data: Array<string> = []
  @Prop({
    type: Number,
    default: 0
  })
  pageReceivedAmount: number = 0
  @Prop()
  billValidator: FormValidator
  lines: Array<ReceiptLine> = []
  selectedData: Array<PayBill> = []
  @Prop()
  receipt: Receipt
  otherVerification: ReceiptLine
  uuid: Array<string> = []

  @Watch('receipt', { deep: true })
  watchReceipt(value: Receipt) {
    if (value) {
      this.pageReceivedAmount = 0
      this.receipt = value
      this.receipt.customer!.id = value.customer!.id
      this.lines = value.lines
      let $this = this
      $this.selectedData = []
      $this.uuid = []
      $this.pageReceivedAmount = 0
      if (value.lines) {
        value.lines.forEach(function (item: ReceiptLine) {
          let payBill: PayBill = new PayBill()
          if (item.billType === 'OtherReceiptLine') {
            $this.otherVerification = item
          } else {
            $this.uuid.push(item.billUuid!)
            payBill.businessType = item.billType
            payBill.realAmount = item.rcvdAmount
            payBill.manager = item.billManager
            payBill.businessDate = item.billBusinessDate
            payBill.billNum = item.billNum
            $this.selectedData.push(payBill)
          }
          $this.pageReceivedAmount = $this.pageReceivedAmount + parseFloat(item.rcvdAmount.toString())
        })
        if (this.receipt.totalRcvdAmount < this.pageReceivedAmount) {
          this.$message.error('核销单据总金额不得大于收款单收款总额')
        }
      } else {
        this.lines = []
      }


    }


  }

  mounted() {
    this.watchReceipt(this.receipt)
  }

  doNewBill() {
    this.billValidator.validate(true).then(() => {
      new Dialog(VerificationSheet, {
        customerId: this.receipt.customer!.id,
        selectedData: this.selectedData,
        uuid: this.uuid,
        onConfirm: (selectData: Array<PayBill>) => {
          let $this = this
          if (selectData) {
            selectData.forEach(function (item: PayBill) {
              $this.selectedData.push(item)
              let objLine: ReceiptLine = new ReceiptLine()
              objLine.billType = item.businessType
              objLine.rcvdAmount = item.realAmount
              objLine.amount = item.realAmount
              objLine.remainAmount = item.remainedAmount
              objLine.rcvdAmount = 0
              objLine.billManager = item.manager
              objLine.billBusinessDate = item.businessDate
              objLine.billNum = item.billNum
              objLine.billUuid = item.id
              $this.lines.push(objLine)
            })
          }
          $this.$emit('getLines', this.lines)
        }
      }).show()
    })

  }

  doNewOther() {
    let $this = this
    new Dialog(verificationOther, {
      otherVerification: this.otherVerification,
      onConfirm: (amount: string, bussiness: Date) => {
        let objLine: ReceiptLine = new ReceiptLine()
        objLine.billType = 'OtherReceiptLine'
        objLine.billBusinessDate = bussiness
        objLine.amount = parseFloat(amount)
        objLine.rcvdAmount = objLine.amount
        objLine.remainAmount = objLine.amount
        // this.pageReceivedAmount = this.pageReceivedAmount + parseFloat(amount)
        this.otherVerification = objLine
        this.lines.forEach(function (item: ReceiptLine, i) {
          if (item.billType === 'OtherReceiptLine') {
            $this.lines.splice(i, 1)
            $this.pageReceivedAmount = $this.pageReceivedAmount - parseFloat(item.rcvdAmount.toString())
          }
        })
        this.lines.push(this.otherVerification)
        if (this.receipt.totalRcvdAmount < this.pageReceivedAmount) {
          this.$message.error('核销单据总金额不得大于收款单付款总额')
        }
        this.$emit('getLines', this.lines)
      }
    }).show()
  }

  @Watch('lines', { deep: true })
  watchLines(value: Array<ReceiptLine>) {
    if (value) {
      this.lines = value
    }
  }


  remove(i: number, rcvdAmount: number) {
    this.lines.splice(i, 1)
    this.selectedData.splice(i, 1)
    this.uuid.splice(i, 1)
    // this.pageReceivedAmount = parseFloat(this.pageReceivedAmount.toString()) - parseFloat(rcvdAmount.toString())
    this.$emit('getLines', this.lines)
  }

  onAmountChange(obj: ReceiptLine) {
    if (obj.rcvdAmount.toString() === '') {
      obj.rcvdAmount = 0
    }
    if (Math.abs(obj.rcvdAmount) > Math.abs(obj.remainAmount)) {
      obj.rcvdAmount = obj.remainAmount
    }
  }

  /**
   * 表格过滤器： 业务时间
   * @param row
   * @param column
   * @param {string} value
   * @returns {string}
   */
  dateFormatter(row: any, column: any, value: string) {
    if (value) {
      let date = DateUtil.format(new Date(value), 'yyyy-MM-dd')
      return date
    } else {
      return '--'
    }
  }

  priceFormatter(row: any, column: any, value: string) {
    if (value && Number(value) !== 0) {
      return Number(value).toFixed(2)
    } else {
      return '0.00'
    }
  }

  billTypeFormatter(row: any, column: any, value: string) {
    if (value) {
      let statusText: string = ''
      switch (value) {
        case 'OtherPaymentLine':
          statusText = '其他支出'
          break
        case 'OtherReceiptLine':
          statusText = '其他收入'
          break
        case 'Purchase':
          statusText = '进货'
          break
        case 'PurchaseReturn':
          statusText = '进货退货'
          break
        case 'Sale':
          statusText = '销售'
          break
        case 'SaleReturn':
          statusText = '销售退货'
          break
        default:
          statusText = '--'
      }
      return statusText
    } else {
      return '--'
    }
  }


}
BillEditActionTable.filter('price', (value: string) => {
  if (value) {
    return Number(value).toFixed(2)
  } else {
    return '0.00'
  }
})
