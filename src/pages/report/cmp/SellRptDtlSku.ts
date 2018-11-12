import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import PermissionMgr from 'mgr/PermissionMgr'
import MerchantConfig from 'model/framework/merchant/MerchantConfig'
import { State } from 'vuex-class'

@Component({
  name: 'sell-rpt-dtl-sku'
})

export default class SaleRptDtlSku extends Vue {
  @State('merchantConfig') merchantConfig: MerchantConfig
  @Prop() data: any[]
  @Prop() summary: any
  hasPermission = PermissionMgr.hasOptionPermission

  @Watch('data')
  onDate(value: any) {
    if (value) {
      this.data = value
    }
  }

  @Watch('summary')
  onSummary(value: any) {
    if (value) {
      this.summary = value
    }
  }

  // 合计
  getSummaries(param: any) {
    const sums: any = []
    if (this.summary !== null) {
      sums[0] = '合计'
      sums[1] = ''
      sums[2] = ''
      sums[3] = ''
      sums[4] = ''
      sums[5] = this.summary ? this.summary.qty.toFixed(0) : 0
      if (this.merchantConfig.enableInputTaxRateSupport && !this.merchantConfig.inputReportOnlyTax) {
        sums[6] = this.summary ? this.fmtThumb(this.summary.taxExcAmount.toString()) : 0.00
        sums[7] = this.summary ? this.fmtThumb(this.summary.amount.toString()) : 0.00
      } else {
        sums[6] = this.summary ? this.fmtThumb(this.summary.amount.toString()) : 0.00
      }
    }
    return sums
  }

  sortChange({ column, prop, order }: any) {
    order === 'ascending' ? (order = 'ASC') : (order = 'DESC')
    let sorters = []
    column && prop && order && sorters.push({ 'property': this.sort(prop), 'direction': order })
    this.$emit('setSorters', sorters)
  }

  /**
   * 千分位
   * @param value
   * @returns {string}
   */
  private fmtThumb(value: string) {
    if (!value) return '0.00'
    let value2Array = value.split('.')
    let intPart = ''
    intPart = value2Array[0] // 获取整数部分
    let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三let
    let floatPart = '.00' // 预定义小数部分
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

  private sort(prop: string) {
    return prop === 'avgPrice' ? 'AVG(' + prop + ')' : 'SUM(' + prop + ')'
  }

}
