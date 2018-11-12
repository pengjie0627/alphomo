import { Component, Prop, Vue } from 'vue-property-decorator'
import StatementSummary from 'model/statement/StatementSummary'

@Component({
  name: 'BalanceRptSummary',
  components: {}
})

export default class BalanceRptSummary extends Vue {
  @Prop()
  summary: StatementSummary
}
BalanceRptSummary.filter('fmtThumb', (value: string) => {
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
})
