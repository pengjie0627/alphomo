import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import PermissionMgr from 'mgr/PermissionMgr'
import InventoryTransferApi from 'http/inventory/transfer/InventoryTransferApi'
import InventoryTransfer from 'model/inventory/transfer/InventoryTransfer'
import CommonUtil from 'util/CommonUtil'
import PrintView from 'cmp/print/PrintView.vue'
import PrintMaintenanceView from 'cmp/print/PrintMaintenanceView.vue'
import PrintPreView from 'cmp/print/PrintPreView.vue'

@Component({
  name: 'inventory-detail-button',
  components: {
    PrintView,
    PrintMaintenanceView,
    PrintPreView
  }
})
export default class InventoryDetailButton extends Vue {
  @Prop()
  type: string
  @Prop({
    type: String,
    default: 'detail'
  })
  target: string
  @Prop()
  bill: InventoryTransfer

  btnStatus: any[] = []
  btnPerm: any[] = []
  btnShow: any[] = []
  btnMore: any[] = []
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  mounted() {
    this.btnStatusChange()
  }

  created() {
    this.btnStatusChange()
  }

  @Watch('bill', {deep: true})
  watchBill(value: any) {
    this.bill = value
    this.btnStatusChange()
  }

  /**
   * 按钮状态
   */
  btnStatusChange() {
    this.btnStatus = [
      {
        index: 1,
        show: this.btnPerm[0] && this.bill.status && (this.bill.status === 'unaudited' || this.bill.status === 'applying')
      },
      {
        index: 2, show: this.btnPerm[1] && this.bill.status && this.bill.status === 'unaudited'
      },
      {
        index: 3, show: this.btnPerm[2] && this.bill.status && this.bill.status === 'unaudited'
      },
      {
        index: 4,
        show: this.btnPerm[3] && this.bill.status && ((this.bill.status !== 'unaudited' && this.bill.status !== 'abolished' && this.bill.category && this.bill.category === 'NORMAL') || this.bill.status === 'applying' && this.bill.category && this.bill.category !== 'NORMAL')
      },
      {
        index: 5,
        show: this.btnPerm[4] && this.bill.status && this.bill.category && this.bill.category === 'NORMAL'
      }
    ]
    this.btnMore = CommonUtil.copy(this.btnStatus)
    this.btnShow = CommonUtil.copy(this.btnStatus).filter((item: any) => {
      return item.show
    })
    if (this.btnShow.length > 3 && this.target === 'list') {
      this.btnShow.forEach((item, index) => {
        if (index < 2) {
          this.btnStatus[item.index - 1].show = true
          this.btnMore[item.index - 1].show = false
        } else {
          this.btnStatus[item.index - 1].show = false
          this.btnMore[item.index - 1].show = true
        }
      })
    }
  }

  /**
   * 审核
   */
  doAudited() {
    InventoryTransferApi.audit(this.bill.id!, this.bill.version).then((res) => {
      this.$message.success('审核成功!')
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
    this.$msgBox.confirm('删除调拨单', '是否确认删除该单据?', () => {
      InventoryTransferApi.remove(this.bill.id!, this.bill.version).then(() => {
        this.$message.success('删除成功!')
        this.$router.replace('/inventoryTransferList')
        if (this.target === 'list') {
          this.$emit('getList')
        }
      }).catch((err) => {
        this.$message.error(err.message)
      })
    })
  }

  /**
   * 编辑
   */
  doEdit() {
    this.$router.push({name: 'inventoryTransferEdit', query: {id: this.bill.id!}})
  }

  /**
   * 作废
   */
  doRemove() {
    this.$msgBox.confirm('作废调拨单', '是否作废该单据?', () => {
      InventoryTransferApi.abolish(this.bill.id!, this.bill.version).then((reps) => {
        this.$message.success('作废成功!')
        if (this.target === 'list') {
          this.$emit('getList')
        } else {
          this.$emit('getDetail', this.bill.id)
        }
      }).catch((err) => {
        this.$message.error(err.message)
      })
    })
  }

  /**
   * 复制
   */
  doCopy() {
    this.$router.push({name: 'inventoryTransferEdit', query: {id: this.bill.id!, isCopy: 'isCopy'}})
  }

  /**
   * 打印
   */
  doPrint() {
    window.print()
  }
}





