import { Component, Prop, Vue } from 'vue-property-decorator'
import DetailButton from 'pages/purchase/cmp/PurchaseViewButton.vue'
import OperateLogView from 'cmp/OperateLogView.vue'
import Purchase from 'model/purchase/Purchase'

@Component({
  name: 'PurchaseViewProcess',
  components: {
    DetailButton,
    OperateLogView
  }
})
export default class PurchaseViewProcess extends Vue {
  operates: Array<string>
  @Prop()
  bill: Purchase

  mounted() {
    console.log(this.bill)
  }
}

