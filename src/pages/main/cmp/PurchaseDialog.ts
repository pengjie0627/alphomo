import { Vue, Component } from 'vue-property-decorator'
import QrcodeVue from 'qrcode.vue'

@Component({
  name: 'purchase-dialog',
  components: {
    QrcodeVue
  }
})
export default class PurchaseDialog extends Vue {
  mbrNum = '2个'
  timeNum = '1年'
  payFlag = 'ali'
  payUrl = 'http://www.baidu.com'
  selTicket = false
  onSelPay(type: string) {
    if (type === 'ali') {
      this.payFlag = 'ali'
    } else {
      this.payFlag = 'wx'
    }
  }
  /**
   * dialog 取消
   */
  doCancel() {
    this.$emit('hide')
  }

  /**
   * dialog 确认
   */
  doConfirm() {
    this.$emit('hide')
  }
}
