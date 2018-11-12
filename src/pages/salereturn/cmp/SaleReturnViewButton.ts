import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import PermissionMgr from 'mgr/PermissionMgr'
import SaleReturn from 'model/salereturn/SaleReturn'
import SaleReturnApi from 'http/salereturn/SaleReturnApi'
import { Dialog, Loading } from 'fant'
import CommonUtil from 'util/CommonUtil'
import JobQueryApi from 'http/excel/JobQueryApi'
import ExportDialog from 'cmp/ExportDialog.vue'
import PrintView from 'cmp/print/PrintView.vue'
import PrintMaintenanceView from 'cmp/print/PrintMaintenanceView.vue'
import PrintPreView from 'cmp/print/PrintPreView.vue'

@Component({
  name: 'SaleReturnViewButton',
  components: {
    PrintView,
    PrintMaintenanceView,
    PrintPreView
  }
})
export default class SaleReturnViewButton extends Vue {
  @Prop()
  type: string
  @Prop({
    type: String,
    default: 'detail'
  })
  target: string
  @Prop()
  bill: SaleReturn

  btnStatus: any[] = []
  btnPerm: any[] = []
  btnShow: any[] = []
  btnMore: any[] = []
  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限
  id: string
  version: number

  @Watch('bill', { deep: true })
  watchBill(value: SaleReturn) {
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
        show: this.btnPerm[1] && (this.bill.status === 'PART_RECEIVED' || this.bill.status === 'RECEIVED' || this.bill.status === 'AUDITED') && this.bill.externalBill && (this.bill.externalBill.source === null || this.bill.externalBill.source === 'alphamo')
      },
      {
        index: 3,
        show: this.btnPerm[2] && this.bill.status === 'UNAUDITED' && this.bill.externalBill && (this.bill.externalBill.source === null || this.bill.externalBill.source === 'alphamo')
      },
      {
        index: 4,
        show: this.btnPerm[3] && this.bill.status === 'UNAUDITED' && this.bill.externalBill && (this.bill.externalBill.source === null || this.bill.externalBill.source === 'alphamo')
      },
      {
        index: 5,
        show: this.btnPerm[4] && this.bill.externalBill && (this.bill.externalBill.source === null || this.bill.externalBill.source === 'alphamo')
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
      title: '删除销售退货单',
      rule: [],
      showCancel: true,
      showConfirm: true,
      msg: '确认删除此销售退货单',
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
    SaleReturnApi.remove(this.id, this.version).then(resp => {
      loading.hide()
      this.$router.push({ name: 'saleReturnList' })
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
    SaleReturnApi.audit(this.id, this.version).then(resp => {
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
    SaleReturnApi.abolish(this.id, this.version).then(resp => {
      loading.hide()
      this.$emit('getDetail', this.id)
      this.$emit('getList')
    }).catch((error) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }


  onEdit() {
    this.$router.push({ name: 'saleReturnEdit', query: { id: this.id } })
  }

  onCopy() {
    this.$router.push({
      name: 'saleReturnEdit',
      query: { id: this.id, isCopy: 'true', from: this.$route.query.from }
    })
  }

  onPrint() {
    window.print()
  }

  onExport() {
    new Dialog(ExportDialog, {
      title: '导出销售退货单详情',
      msg: '您确定导出全部数据？',
      onExport: () => {
        return SaleReturnApi.exportSaleReturnDetail(this.id)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }
}
