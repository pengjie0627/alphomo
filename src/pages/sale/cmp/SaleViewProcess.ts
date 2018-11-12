import { Component, Prop, Vue } from 'vue-property-decorator'
import DetailButton from 'pages/sale/cmp/SaleViewButton.vue'
import OperateLogView from 'cmp/OperateLogView.vue'
import Sale from 'model/sale/Sale'

@Component({
  name: 'SaleViewProcess',
  components: {
    DetailButton,
    OperateLogView
  }
})
export default class SaleViewProcess extends Vue {
  operates: Array<string>
  @Prop()
  bill: Sale

  mounted() {
    console.log(this.bill)
  }
}

