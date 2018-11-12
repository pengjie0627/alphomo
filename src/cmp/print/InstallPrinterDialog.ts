import { Vue, Component } from 'vue-property-decorator'
import MerchantApi from 'http/framework/merchant/MerchantApi'

@Component({
  name: 'InstallPrinterDialog',
  components: {}
})
export default class InstallPrinterDialog extends Vue {
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
    MerchantApi.getResource('lodop').then(resp => {
      if (resp && resp.success) {
        window.location.href = resp.data[0]
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }
}


