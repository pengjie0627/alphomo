import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import InInventory from 'model/inventory/in/InInventory'
import PrintView from 'cmp/print/PrintView.vue'
import PrintMaintenanceView from 'cmp/print/PrintMaintenanceView.vue'
import PrintPreView from 'cmp/print/PrintPreView.vue'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  name: 'InventoryInDetailButton',
  components: {
    PrintView,
    PrintMaintenanceView,
    PrintPreView
  }
})
export default class InventoryInDetailButton extends Vue {
  @Prop()
  bill: InInventory
  @Prop()
  type: string
  id: string
  version: number
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  @Watch('bill', {deep: true})
  watchBill(value: InInventory) {
    if (value) {
      this.id = value.id!
      this.version = value.version
    }
  }

  created() {
    this.watchBill(this.bill)
  }

  mounted() {
    this.id = this.bill.id!
    this.version = this.bill.version
  }

  /**
   * 跳转到入库界面
   */
  doAudit() {
    this.$router.push({
      name: 'inventoryInEdit',
      query: {id: this.id}
    })
  }
}
