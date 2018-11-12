import { Component, Prop, Vue } from 'vue-property-decorator'
import Purchase from 'model/purchase/Purchase.ts'
import PermissionMgr from 'mgr/PermissionMgr'
import MerchantConfig from 'model/framework/merchant/MerchantConfig'
import { State } from 'vuex-class'

@Component({
  components: {}
})
export default class PurchaseViewSummary extends Vue {
  @State('merchantConfig') merchantConfig: MerchantConfig

  @Prop()
  bill: Purchase
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  get totalAmount() {
    return this.fmtThumb((Number(this.bill!.amount)).toString())
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

PurchaseViewSummary.filter('fmtThumbFor', (value: string) => {
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
