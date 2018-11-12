import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import PermissionMgr from 'mgr/PermissionMgr'
import CheckInventoryApi from 'http/inventory/check/CheckInventoryApi'
import CheckInventory from 'model/inventory/check/CheckInventory'
import PrintView from 'cmp/print/PrintView.vue'
import PrintMaintenanceView from 'cmp/print/PrintMaintenanceView.vue'
import PrintPreView from 'cmp/print/PrintPreView.vue'

@Component({
  name: 'InventoryCheckButton',
  components: {
    PrintView,
    PrintMaintenanceView,
    PrintPreView
  }
})
export default class InventoryCheckButton extends Vue {
  @Prop()
  type: string
  @Prop({
    type: String,
    default: 'detail'
  })
  target: string
  @Prop()
  bill: CheckInventory

  btnStatus: any[] = []
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  @Watch('bill', { deep: true })
  watchBill(value: CheckInventory) {
    this.bill = value
    this.btnStatusChange()
  }

  created() {
    this.btnStatusChange()
  }

  /**
   * 按钮状态
   */
  btnStatusChange() {
    this.btnStatus = [
      { index: 1, show: this.bill.status && this.bill.status === 'unaudited' },
      { index: 2, show: this.bill.status && this.bill.status === 'unaudited' },
      {
        index: 3,
        show: this.bill.status && this.bill.status === 'unaudited'
      },
      {
        index: 4,
        show: this.bill.status && this.bill.externalBill && (this.bill.externalBill.source === null || this.bill.externalBill.source === 'alphamo')
      }
    ]
  }

  /**
   * 审核
   */
  doAudited() {
    CheckInventoryApi.audit(this.bill.id!, this.bill.version).then((res) => {
      this.$message.success('审核成功!')
      this.$emit('getDetail', this.bill.id)
      if (this.target === 'list') {
        this.$emit('getList')
      } else {
        this.$emit('getDetail', this.bill.id)
      }
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  /**
   * 删除
   */
  doDeleted() {
    this.$msgBox.confirm('删除盘点单', '是否确认删除该单据?', () => {
      CheckInventoryApi.remove(this.bill.id!, this.bill.version).then(() => {
        this.$message.success('删除成功!')
        this.$router.replace('/inventoryCheckList')
      }).catch((err) => {
        this.$message.error(err.message)
      })
    })
  }

  /**
   * 编辑
   */
  doEdit() {
    this.$router.push({ name: 'inventoryCheckEdit', query: { id: this.bill.id! } })
  }

  /**
   * 复制
   */
  doCopy() {
    this.$router.push({ name: 'inventoryCheckEdit', query: { id: this.bill.id!, isCopy: 'true' } })
  }

  /**
   * 打印
   */
  doPrint() {
    window.print()
  }
}





