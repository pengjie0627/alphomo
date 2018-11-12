import { Component, Prop, Vue } from 'vue-property-decorator'
import LogisticsCompany from 'model/basicdata/logisticscompany/LogisticsCompany'
import LogisticsCompanyApi from 'http/basicdata/logisticscompany/LogisticsCompanyApi'
import ContactInfo from 'model/basicdata/ContactInfo'

@Component({
  components: {}

})
export default class DetailInfo extends Vue {
  @Prop()
  id: string
  logisticscompany: LogisticsCompany = new LogisticsCompany()

  data() {
    return {
      logisticscompany: {
        contactInfo: {}
      }
    }
  }

  doInitData() {
    this.logisticscompany.contactInfo = new ContactInfo()
  }

  beforeMount() {
    LogisticsCompanyApi.get(this.id).then((resp) => {
      this.logisticscompany = resp.data
      console.log(this.logisticscompany)
    })
  }
}
DetailInfo.filter('priceFormatter', (value: string) => {
  if (value && Number(value) !== 0) {
    return Number(value).toFixed(2)
  } else {
    return '0.00'
  }
})

