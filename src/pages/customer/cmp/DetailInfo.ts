import { Component, Prop, Vue } from 'vue-property-decorator'
import Customer from 'model/basicdata/customer/Customer'
import CustomerApi from 'http/basicdata/customer/CustomerApi'
import ContactInfo from 'model/basicdata/ContactInfo'

@Component({
  components: {}

})
export default class DetailInfo extends Vue {
  @Prop()
  id: string
  customer: Customer = new Customer()

  data() {
    return {
      customer: {
        contactInfo: {}
      }
    }
  }

  doInitData() {
    this.customer.contactInfo = new ContactInfo()
  }

  beforeMount() {
    CustomerApi.get(this.id).then((resp) => {
      this.customer = resp.data
      console.log(this.customer)
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

