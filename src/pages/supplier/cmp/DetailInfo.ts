import { Component, Prop, Vue } from 'vue-property-decorator'
import Supplier from 'model/basicdata/supplier/Supplier'
import SupplierApi from 'http/basicdata/supplier/SupplierApi'
import ContactInfo from 'model/basicdata/ContactInfo'

@Component({
  components: {}

})
export default class DetailInfo extends Vue {
  @Prop()
  id: string
  supplier: Supplier = new Supplier()

  data() {
    return {
      supplier: {
        contactInfo: {}
      }
    }
  }

  doInitData() {
    this.supplier.contactInfo = new ContactInfo()
  }

  beforeMount() {
    SupplierApi.get(this.id).then((resp) => {
      this.supplier = resp.data
      console.log(this.supplier)
    })
  }
}
DetailInfo.filter('price', (value: string) => {
  if (value) {
    return Number(value).toFixed(2)
  } else {
    return '0.00'
  }
})

