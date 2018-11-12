import { Component, Prop, Vue } from 'vue-property-decorator'
import SaleReturn from 'model/salereturn/SaleReturn.ts'
import MerchantConfig from 'model/framework/merchant/MerchantConfig'
import { FormValidator, NumberUtil } from 'fant'
import { add, sub } from 'util/CalcUtil.js'
import { State } from 'vuex-class'

@Component({
  name: 'SaleReturnSummary',
  components: {}
})
export default class SaleReturnSummary extends Vue {
  saleReturnRoute = ''
  @State('merchantConfig') merchantConfig: MerchantConfig
  @Prop()
  bill: SaleReturn
  @Prop()
  presentation: string
  @Prop()
  validator: FormValidator
  @Prop()
  isReturnFromSale: boolean = false

  mounted() {
    this.saleReturnRoute = this.$route.name!.toString()
  }

  totalAmount() {
    let amount = this.bill!.amount
    return this.fmtThumb(amount.toString())
  }

  realAmount() {
    let amount = sub(add(this.bill!.amount, this.bill!.chargeAmount), this.bill!.discountAmount)
    // return Number(this.bill!.amount) + Number(this.bill!.taxAmount) + Number(this.bill!.chargeAmount) - Number(this.bill!.discountAmount)
    return this.fmtThumb(amount.toString())
  }

  formatAmount(value: number) {
    return NumberUtil.format(value, '0.00')
  }

  /**
   * 千分位
   * @param value
   * @returns {string}
   */
  private fmtThumb(value: string) {
    if (!value) return '0.00'
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
  }
}
SaleReturnSummary.filter('fmtThumbFor', (value: string) => {
  if (!value) return '0.00'

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

