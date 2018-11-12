import { Component, Prop, Vue } from 'vue-property-decorator'

import Purchase from 'model/purchase/Purchase'

@Component({
  components: {}
})
export default class PurchaseViewHeader extends Vue {
  operates: Array<string>
  @Prop()
  bill: Purchase

  mounted() {
    // console.log(this.bill)
  }
}
