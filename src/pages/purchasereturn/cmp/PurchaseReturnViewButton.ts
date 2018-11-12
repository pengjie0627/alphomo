import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import PermissionMgr from 'mgr/PermissionMgr'
import { Dialog, Loading } from 'fant'
import CommonUtil from 'util/CommonUtil'
import PurchaseReturn from 'model/purchasereturn/PurchaseReturn'
import PurchaseReturnApi from 'http/purchasereturn/PurchaseReturnApi'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import PrintView from 'cmp/print/PrintView.vue'
import PrintMaintenanceView from 'cmp/print/PrintMaintenanceView.vue'
import PrintPreView from 'cmp/print/PrintPreView.vue'

@Component({
  components: {
    PrintView,
    PrintMaintenanceView,
    PrintPreView
  }
})
export default class PurchaseReturnViewButton extends Vue {
  @Prop()
  type: string
  @Prop({
    type: String,
    default: 'detail'
  })
  target: string
  @Prop()
  bill: PurchaseReturn

  btnStatus: any[] = []
  btnPerm: any[] = []
  btnShow: any[] = []
  btnMore: any[] = []
  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限
  id: string
  version: number

  @Watch('bill', { deep: true })
  watchBill(value: PurchaseReturn) {
    if (value) {
      this.id = value.id!
      this.version = value.version
      this.btnStatusChange()
    }
  }

  /**
   * 按钮状态
   */
  btnStatusChange() {
    this.btnStatus = [
      { index: 1, show: this.btnPerm[0] && this.bill.status === 'UNAUDITED' },
      {
        index: 2,
        show: this.btnPerm[1] && this.bill.status === 'PART_RETURNED' || this.bill.status === 'RETURNED' || this.bill.status === 'AUDITED'
      },
      { index: 3, show: this.btnPerm[2] && this.bill.status === 'UNAUDITED' },
      { index: 4, show: this.btnPerm[3] && this.bill.status === 'UNAUDITED' },
      { index: 5, show: this.btnPerm[4] && true }
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

  created() {
    this.watchBill(this.bill)
  }

  mounted() {
    this.id = this.bill.id!
    this.version = this.bill.version
    this.btnStatusChange()
  }

  onDel() {
    this.$msgBox({
      type: 'confirm',
      title: '删除退货单',
      rule: [],
      showCancel: true,
      showConfirm: true,
      msg: '确认删除此退货单',
      doCancel: () => {
        this.$emit('hide')
      },
      doConfirm: (value: string) => {
        this.doDelete()
      }
    })
  }

  doDelete() {
    let loading = Loading.show({
      msg: '删除中'
    })
    PurchaseReturnApi.remove(this.id, this.version).then(resp => {
      loading.hide()
      this.$router.push({ name: 'purchaseReturnList' })
      this.$emit('getList')
    }).catch((error) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  onAudit() {
    let loading = Loading.show({
      msg: '审核中'
    })
    PurchaseReturnApi.audit(this.id, this.version).then(resp => {
      loading.hide()
      this.$emit('getDetail', this.id)
      this.$emit('getList')
    }).catch((error) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  onAbolish() {
    let loading = Loading.show({
      msg: '作废中'
    })
    PurchaseReturnApi.abolish(this.id, this.version).then(resp => {
      loading.hide()
      this.$emit('getDetail', this.id)
      this.$emit('getList')
    }).catch((error) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }


  onEdit() {
    this.$router.push({ name: 'purchaseReturnEdit', query: { id: this.id } })
  }

  onCopy() {
    this.$router.push({ name: 'purchaseReturnEdit', query: { id: this.id, isCopy: 'true' } })
  }

  onPrint() {
    window.print()
  }

  onExport() {
    new Dialog(ExportDialog, {
      title: '导出退货单详情',
      onExport: () => {
        return PurchaseReturnApi.exportPurchaseReturnDetail(this.id)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }
}
