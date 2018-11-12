import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import PermissionMgr from 'mgr/PermissionMgr'
import Purchase from 'model/purchase/Purchase'
import PurchaseApi from 'http/purchase/PurchaseApi'
import { Dialog, Loading } from 'fant'
import CommonUtil from 'util/CommonUtil'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import PrintView from 'cmp/print/PrintView.vue'
import PrintMaintenanceView from 'cmp/print/PrintMaintenanceView.vue'
import PrintPreView from 'cmp/print/PrintPreView.vue'

@Component({
  components: {
    ExportDialog,
    PrintView,
    PrintMaintenanceView,
    PrintPreView
  }
})
export default class PurchaseViewButton extends Vue {
  @Prop()
  type: string
  @Prop({
    type: String,
    default: 'detail'
  })
  target: string
  @Prop()
  bill: Purchase

  btnStatus: any[] = []
  btnPerm: any[] = []
  btnShow: any[] = []
  btnMore: any[] = []
  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限
  id: string
  version: number

  @Watch('bill', { deep: true })
  watchBill(value: Purchase) {
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
      { index: 2, show: this.btnPerm[1] && this.bill.status === 'PART_RECEIVED' || this.bill.status === 'RECEIVED' },
      {
        index: 3,
        show: this.btnPerm[2] && this.bill.status === 'PART_RECEIVED' || this.bill.status === 'RECEIVED' || this.bill.status === 'AUDITED'
      },
      { index: 4, show: this.btnPerm[3] && this.bill.status === 'UNAUDITED' },
      { index: 5, show: this.btnPerm[4] && this.bill.status === 'UNAUDITED' },
      { index: 6, show: this.btnPerm[5] && true }
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
      title: '删除进货单',
      rule: [],
      showCancel: true,
      showConfirm: true,
      msg: '确认删除此进货单',
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
    PurchaseApi.remove(this.id, this.version).then(resp => {
      loading.hide()
      this.$router.push({ name: 'purchaseList' })
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
    PurchaseApi.audit(this.id, this.version).then(resp => {
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
    PurchaseApi.abolish(this.id, this.version).then(resp => {
      loading.hide()
      this.$emit('getDetail', this.id)
      this.$emit('getList')
    }).catch((error) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }


  onEdit() {
    this.$router.push({ name: 'purchaseEdit', query: { id: this.id } })
  }

  onCopy() {
    this.$router.push({ name: 'purchaseEdit', query: { id: this.id, isCopy: 'true' } })
  }

  onPrint() {
    window.print()
  }

  onReturn() {
    this.$router.push({ name: 'purchaseReturnEdit', query: { purchase: this.id } })
  }


  /**
   *  导出详情
   */
  onExport() {

    new Dialog(ExportDialog, {
      title: '导出进货单详情',
      onExport: () => {
        return PurchaseApi.exportPurchaseDetail(this.id)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }
}
