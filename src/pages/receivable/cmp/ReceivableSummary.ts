import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import ReceivableReportApi from 'http/statement/receivable/ReceivableReportApi'
import ReceivableReportTotal from 'model/statement/receivable/ReceivableReportTotal'

@Component({
  name: 'PayableSummary',
  components: {}
})
export default class ReceivableSummary extends Vue {
  @Prop({
    type: String,
    default: 'default'
  })
  customer: string
  @Prop()
  customerName: string
  obj: ReceivableReportTotal = new ReceivableReportTotal()

  @Watch('customer')
  watchCustomer(value: string) {
    this.customer = value
    this.getTotal()
  }

  @Watch('customerName')
  watchCustomerName(value: string) {
    this.customerName = value
  }

  mounted() {
    this.watchCustomer(this.customer)
    this.watchCustomerName(this.customerName)
  }

  getTotal() {
    if (this.customer === 'default') {
      ReceivableReportApi.total().then((resp) => {
        this.obj = resp.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    } else {
      if (this.customer) {
        ReceivableReportApi.totalByCustomer(this.customer).then((resp) => {
          this.obj = resp.data
        }).catch((err) => {
          this.$message.error(err.message)
        })
      }
    }
  }

}
ReceivableSummary.filter('priceFormatter', (value: string) => {
  if (value && Number(value) !== 0) {
    return Number(value).toFixed(2)
  } else {
    return '0.00'
  }
})
ReceivableSummary.filter('fmtThumb', (value: string) => {
  if (!value) return '0.00'
  value = value.toString()
  let intPart = value.split('.')[0] // 之前的处理方式会四舍五入
  let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三let
  let floatPart = '.00' // 预定义小数部分
  let value2Array = value.split('.')

  // =2表示数据有小数位
  if (value2Array.length === 2) {
    let floatStr = '0.' + value2Array[1]
    floatPart = Number(floatStr).toFixed(2).toString() // 拿到小数部分

    if (floatPart.length === 1) { // 补0,实际上用不着
      return intPartFormat + '.' + floatPart.substring(2, floatPart.length) + '0'
    } else {
      return intPartFormat + '.' + floatPart.substring(2, floatPart.length)
    }

  } else {
    return intPartFormat + floatPart
  }
})
