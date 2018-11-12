import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonUtil from 'util/CommonUtil.js'
import ApiClient from 'http/ApiClient'
import Merchant from 'model/framework/merchant/Merchant'
import { State } from 'vuex-class'
import LodopFuncs from 'util/LodopFuncs.js'
import EvalFormat from 'util/EvalFormat.js'
import InstallPrinterDialog from 'cmp/print/InstallPrinterDialog.vue'
import { Dialog } from 'fant'

@Component({
  name: 'PrintPreView',
  components: { InstallPrinterDialog }
})
export default class PrintView extends Vue {
  LODOP: any = ''
  @State('merchant') merchant: Merchant
  @Prop()
  btnType: string
  @Prop()
  id: any // 单据id
  @Prop()
  type: string // 打印类型
  @Prop()
  disabled: boolean // 是否禁用
  /**
   * 预览方法
   */
  onPrintPreViewEvent() {
    // 第1步 动态加载js
    let protocol = window.location.protocol
    if (protocol === 'http') {
      CommonUtil.loadScript(('http://localhost:8000') + '/CLodopfuncs.js?priority=' + Date.now(), () => {
        this.init()
      }, () => {
        CommonUtil.loadScript(('http://localhost:18000') + '/CLodopfuncs.js?priority=' + Date.now(), () => {
          this.init()
        }, () => {
          new Dialog(InstallPrinterDialog).show()
        })
      })
    } else {
      CommonUtil.loadScript(('https://localhost:8443') + '/CLodopfuncs.js?priority=' + Date.now(), () => {
        this.init()
      }, () => {
        new Dialog(InstallPrinterDialog).show()
      })
    }
  }

  private init() {
    this.LODOP = LodopFuncs.getLodop()
    this.LODOP.SET_LICENSES('上海海鼎信息工程股份有限公司', '1AD0E7BD2B73EE56138F455C32A0E863', '', '')
    if (this.LODOP.webskt && this.LODOP.webskt.readyState === 1) {
      this.printPreViewApi()
    } else {
      setTimeout(this.printPreViewApi, 500)
    }
  }

  private printPreViewApi() {
    if (typeof this.id === 'string') {// 字符串
      ApiClient.server().post(`/${this.merchant.id}/print/${this.type}?id=${this.id}`, {}).then(resp => {
        if (resp && resp.data && resp.data.success) {
          EvalFormat.getEval(resp.data.data)
          this.LODOP.PREVIEW()
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    }
  }
}


