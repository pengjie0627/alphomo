import { Vue, Component } from 'vue-property-decorator'
import PrintView from 'cmp/print/PrintView.vue'
import PrintMaintenanceView from 'cmp/print/PrintMaintenanceView.vue'
@Component({
  name: 'Test',
  components: { PrintView, PrintMaintenanceView }
})
export default class Test extends Vue {

}


