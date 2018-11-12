import { Component, Vue, Prop } from 'vue-property-decorator'
import { DateUtil } from 'fant'
import verificationOther from 'pages/payable/cmp/VerificationOther.vue'
import VerificationSheet from 'pages/payable/cmp/VerificationSheet.vue'
import Receipt from 'model/statement/receipt/Receipt'

@Component({
  components: {
    verificationOther,
    VerificationSheet
  }
})
export default class BillViewActionTable extends Vue {
  @Prop({
    type: Array,
    default: []
  })
  data: Array<Receipt>

  mounted() {
    console.log(1)
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
