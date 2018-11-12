import { Component, Vue } from 'vue-property-decorator'
import Sku from 'model/basicdata/sku/Sku'
import SkuApi from 'http/basicdata/sku/SkuApi'

@Component({
  components: {}

})
export default class DetailInfo extends Vue {
  id: string
  sku: Sku = new Sku()

  beforeMount() {
    SkuApi.get(this.id).then((resp) => {
      this.sku = resp.data
      console.log(this.sku)
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

