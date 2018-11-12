import { Component, Prop, Vue } from 'vue-property-decorator'
import DetailButton from 'pages/salereturn/cmp/SaleReturnViewButton.vue'
import OperateLogView from 'cmp/OperateLogView.vue'
import SaleReturn from 'model/salereturn/SaleReturn'

@Component({
  name: 'SaleReturnViewProcess',
  components: {
    DetailButton,
    OperateLogView
  }
})
export default class SaleReturnViewProcess extends Vue {
  operates: Array<string>
  @Prop()
  bill: SaleReturn

  mounted() {
    console.log(this.bill)
  }
}

