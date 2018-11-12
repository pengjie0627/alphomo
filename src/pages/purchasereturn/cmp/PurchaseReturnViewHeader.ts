import { Component, Prop, Vue } from 'vue-property-decorator'
import PurchaseReturn from 'model/purchasereturn/PurchaseReturn'

@Component({
  components: {}
})
export default class PurchaseReturnViewHeader extends Vue {
  operates: Array<string>
  @Prop()
  bill: PurchaseReturn

  mounted() {
    // console.log(this.bill)
  }
}
