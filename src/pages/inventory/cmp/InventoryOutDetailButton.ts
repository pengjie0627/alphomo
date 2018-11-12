import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import PrintView from 'cmp/print/PrintView.vue'
import PrintMaintenanceView from 'cmp/print/PrintMaintenanceView.vue'
import PrintPreView from 'cmp/print/PrintPreView.vue'
import PermissionMgr from 'mgr/PermissionMgr'
import OutInventory from 'model/inventory/out/OutInventory'

@Component({
  name: 'InventoryOutDetailButton',
  components: {
    PrintView,
    PrintMaintenanceView,
    PrintPreView
  }
})
export default class InventoryOutDetailButton extends Vue {
  @Prop()
  bill: OutInventory
  @Prop()
  type: string
  id: string
  version: number
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  @Watch('bill', {deep: true})
  watchBill(value: OutInventory) {
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
   * 跳转到出库界面
   */
  doAudit() {
    this.$router.push({
      name: 'inventoryOutEdit',
      query: {id: this.id}
    })
  }
}
