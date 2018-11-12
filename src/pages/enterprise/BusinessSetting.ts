import { Component, Vue } from 'vue-property-decorator'
import { Loading } from 'fant'
import PageBody from 'cmp/PageBody.vue'
import MerchantConfig from 'model/framework/merchant/MerchantConfig'
import MerchantConfigApi from 'http/framework/merchant/MerchantConfigApi'
import { Action } from 'vuex-class'


@Component({
  name: 'MerchantConfig',
  components: {
    PageBody
  }
})
export default class BusinessSetting extends Vue {
  @Action('merchantConfig') actionMerchantConfig: Function

  merchantConfig: MerchantConfig = new MerchantConfig()
  costPriceBit: string = ''
  purchasePriceBit: string = ''
  $refs: {
    enterprise: any
  }
  menu = [{
    name: '业务设置',
    url: 'businessSetting'
  }]


  mounted() {
    this.getMerchantConfig()
  }

  getMerchantConfig() {
    let loading = Loading.show()
    MerchantConfigApi.get().then((resp) => {
      this.merchantConfig = resp.data
      this.costPriceBit = resp.data.costPriceBit.toString()
      this.purchasePriceBit = resp.data.purchasePriceBit.toString()
      this.actionMerchantConfig(this.merchantConfig)
      loading.hide()
    }).catch((err) => {
      loading.hide()
      this.$message.error(err)
    })
  }

  saveModify(key: string, value: any) {
    switch (key) {
      case 'inputTaxRate':
        if (0 <= value && value <= 100) {
          this.update(key, value)
        } else {
          this.$message.warning('进项税率支持0~100之间')
          let mechantConfigObj: MerchantConfig = new MerchantConfig()
          MerchantConfigApi.get().then((resp) => {
            mechantConfigObj = resp.data
            this.merchantConfig.inputTaxRate = mechantConfigObj.inputTaxRate
          }).catch((err) => {
            this.$message.error(err)
          })
        }
        break
      case 'outputTaxTate':
        if (0 <= value && value <= 100) {
          this.update(key, value)
        } else {
          this.$message.warning('销项税率支持0~100之间')
          let mechantConfigObj: MerchantConfig = new MerchantConfig()
          MerchantConfigApi.get().then((resp) => {
            mechantConfigObj = resp.data
            this.merchantConfig.outputTaxRate = mechantConfigObj.outputTaxRate
          }).catch((err) => {
            this.$message.error(err)
          })
        }
        break
      default:
        this.update(key,value)
    }
  }

  update(key: string, value: any) {
    MerchantConfigApi.update(key, value).then(resp => {
      if (resp && resp.success) {
        this.$message.success('设置成功！')
        this.getMerchantConfig()
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }
}
