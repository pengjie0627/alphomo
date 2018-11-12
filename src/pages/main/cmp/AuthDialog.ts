import { Vue, Component } from 'vue-property-decorator'
import QrcodeVue from 'qrcode.vue'
import ShopApi from 'http/basicdata/shop/ShopApi'
import CustomerApi from 'http/basicdata/customer/CustomerApi'

@Component({
  name: 'shop-auth-dialog',
  components: {
    QrcodeVue
  }
})
export default class AuthDialog extends Vue {
  type: string  //门店页面授权码（type='shop'），客户页面处授权码（type='customer'）
  payUrl: string
  authCode: string

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

  onDownload() {
    let canvas = document.getElementsByTagName("canvas")[0]
    let downloadUrl = canvas.toDataURL('image/jpeg')
    let save_link = document.createElement('a')
    save_link.download = '授权二维码' + new Date().getTime() + '.jpg'
    save_link.href = downloadUrl
    let event = document.createEvent('MouseEvents')
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    save_link.dispatchEvent(event)
  }

  onRefresh() {
    if (this.type == 'shop') {
      ShopApi.dmmResetAuthCode().then((resp) => {
        if (resp.data) {
          let jsonObject = (Object)(resp.data)
          this.payUrl = JSON.stringify(resp.data)
          this.authCode = jsonObject.value
        }
      }).catch((err) => {
        this.$message.error(err.message)
      })
    }
    if (this.type == 'customer') {
      CustomerApi.dmmResetAuthCode().then((resp) => {
        if (resp.data) {
          let jsonObject = (Object)(resp.data)
          this.payUrl = JSON.stringify(resp.data)
          this.authCode = jsonObject.value
        }
      }).catch((err) => {
        this.$message.error(err.message)
      })
    }
  }
}
