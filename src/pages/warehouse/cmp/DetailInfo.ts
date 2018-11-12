import { Component, Prop, Vue } from 'vue-property-decorator'
import ContactInfo from 'model/basicdata/ContactInfo'
import Warehouse from 'model/basicdata/warehouses/Warehouse'
import WarehouseApi from 'http/basicdata/warehouses/WarehouseApi'

@Component({
  components: {}

})
export default class DetailInfo extends Vue {
  @Prop()
  id: string
  warehouse: Warehouse = new Warehouse()

  data() {
    return {
      warehouse: {
        contactInfo: {}
      }
    }
  }

  doInitData() {
    this.warehouse.contactInfo = new ContactInfo()
  }

  beforeMount() {
    WarehouseApi.get(this.id).then((resp) => {
      this.warehouse = resp.data
      console.log(this.warehouse)
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

