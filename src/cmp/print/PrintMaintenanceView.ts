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
  name: 'PrintMaintenanceView',
  components: {}
})
export default class PrintMaintenanceView extends Vue {
  LODOP: any = ''
  tpl: any = ''
  @State('merchant') merchant: Merchant
  @Prop()
  btnType: string
  @Prop()
  type: string // 打印类型
  onPrintMaintenanceEvent() {
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
      this.getPrintTpl()
    } else {
      setTimeout(this.getPrintTpl, 500)
    }
    // this.getPrintTpl()
  }

  private getPrintTpl() {
    ApiClient.server().get(`/${this.merchant.id}/print/${this.type}/template`, {}).then(resp => {
      if (resp && resp.data && resp.data.success) {
        this.tpl = resp.data.data[0]
        let that = this
        EvalFormat.getEval(resp.data.data[0].template)
        this.LODOP.SET_SHOW_MODE('SETUP_ENABLESS', '11111111111111')
        this.LODOP.SET_PRINT_MODE('PRINT_SETUP_PROGRAM', true)
        this.LODOP.SET_SHOW_MODE('HIDE_ABUTTIN_SETUP', true)
        if (this.LODOP.CVERSION) {
          LodopFuncs.onReturn(that.saveModify)
        }
        this.LODOP.PRINT_SETUP()
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  private saveModify(template: string) {
    template = template.replace(/LODOP\.SET_PRINT_MODE\(\"PRINT_SETUP_PROGRAM\"\,true\)\;[\s+]*/g, '')
    let templateT: string = template.replace(/\s/g, '') // 去掉所有的换行空格
    let templateS: string = this.tpl.template.replace(/\s/g, '') // 去掉所有的换行空格
    console.log(templateT)
    console.log(templateS)
    if (templateT === templateS) {
      return
    }
    template = template.replace(/^\s+|\s+$/g, '') // 去掉开头结尾的换行空格
    this.$msgBox.confirm('修改模板', '模板已修改，是否保存？', () => {
      this.tpl.template = template
      ApiClient.server().post(`/${this.merchant.id}/print/${this.type}/update`, this.tpl).then(resp => {
        if (resp && resp.data && resp.data.success) {
          // todo
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    })
  }
}


