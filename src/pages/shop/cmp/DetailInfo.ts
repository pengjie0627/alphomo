import { Component, Prop, Vue } from 'vue-property-decorator'
import Shop from 'model/basicdata/shop/Shop'
import ShopApi from 'http/basicdata/shop/ShopApi'
import ContactInfo from 'model/basicdata/ContactInfo'

@Component({
  components: {}
})
export default class DetailInfo extends Vue {
  @Prop()
  id: string
  shop: Shop = new Shop()
  address: any

  data() {
    return {
      shop: {
        contactInfo: {}
      }
    }
  }

  doInitData() {
    this.shop.contactInfo = new ContactInfo()
  }

  beforeMount() {
    ShopApi.get(this.id).then((resp) => {
      this.shop = resp.data
      if (this.shop.shopAddress !== null) {
        if (this.shop.shopAddress.province !== null) {
          this.address = this.shop.shopAddress.province.text
        }
        if (this.shop.shopAddress.city !== null) {
          this.address += this.shop.shopAddress.city.text
        }
        if (this.shop.shopAddress.street !== null) {
          this.address += this.shop.shopAddress.street.text
        }
        this.address += this.shop.shopAddress.address
      }
    })
  }
}


