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
  name: 'PrintView',
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
   * 打印方法
   */
  onPrintEvent() {
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
      this.printApi()
    } else {
      setTimeout(this.printApi, 500)
    }
    // setTimeout(this.printApi, 200)
    // this.printApi()
  }

  private printApi() {
    if (typeof this.id === 'string') {// 字符串
      ApiClient.server().post(`/${this.merchant.id}/print/${this.type}?id=${this.id}`, {}).then(resp => {
        if (resp && resp.data && resp.data.success) {
          EvalFormat.getEval(resp.data.data)
          // this.LODOP.PRINT_SETUP()// 打印维护
          this.LODOP.PRINTA()
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    } else if (Object.prototype.toString.call(this.id) === '[object Array]') { // 数组
      for (let i = 0; i < this.id.length; i++) {
        ApiClient.server().post(`/${this.merchant.id}/print/${this.type}?id=${this.id[i]}`, {}).then(resp => {
          if (resp && resp.data && resp.data.success) {
            EvalFormat.getEval(resp.data.data)
            // this.LODOP.PRINT_SETUP()// 打印维护
            this.LODOP.PRINTB()
          }
        }).catch(error => {
          this.$message.error(error.message)
        })
      }
    }
  }
}


