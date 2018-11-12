import { Component, Vue, Watch } from 'vue-property-decorator'
import { FormValidator } from 'fant'
import ReceiptLine from 'model/statement/receipt/ReceiptLine'

@Component({
  components: {}
})
export default class VerificationOther extends Vue {
  onConfirm: Function
  otherVerification: ReceiptLine
  data: Array<string> = []
  validator: FormValidator = new FormValidator()
  businessDate: Nullable<Date> = new Date()
  amount: number = 0

  @Watch('otherVerification')
  watchOtherVerification(value: ReceiptLine) {
    if (value) {
      this.businessDate = value.billBusinessDate
      this.amount = value.rcvdAmount
    }
  }

  mounted() {
    this.watchOtherVerification(this.otherVerification)
    this.validator.push({
      businessDate: [{
        required: true, message: '业务日期不允许为空'
      }],
      amount: [{
        required: true, message: '应付金额不能为空'
      }, {
        validate: (value: number) => {
          if (value < 0 || value === 0) {
            return false
          }
          return true
        }, message: '请输入大于0的金额'
      }]
    })
  }

  doCancel() {
    this.$emit('hide')
  }

  doConfirm() {
    this.onConfirm(this.amount, this.businessDate)
    this.$emit('hide')
  }
}

