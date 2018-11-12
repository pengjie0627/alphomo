import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import PrintView from 'cmp/print/PrintView.vue'
import PrintMaintenanceView from 'cmp/print/PrintMaintenanceView.vue'
import PrintPreView from 'cmp/print/PrintPreView.vue'
import PermissionMgr from 'mgr/PermissionMgr'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import {Dialog} from 'fant'
import AdvancePaymentApi from 'http/advancepayment/AdvancePaymentApi'
import AdvancePayment from 'model/advancepayment/AdvancePayment'

@Component({
  name: 'AdvancePaymentDetailButton',
  components: {
    PrintView,
    PrintMaintenanceView,
    PrintPreView
  }
})
export default class AdvancePaymentDetailButton extends Vue {
  @Prop()
  bill: AdvancePayment
  @Prop()
  type: string
  id: string
  version: number
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  @Watch('bill', {deep: true})
  watchBill(value: AdvancePayment) {
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

  onBtnAudit() {
    AdvancePaymentApi.audit(this.id, this.version).then(resp => {
      if (resp.success) {
        this.$message.success('审核成功')
        this.$emit('getDetail',this.id)
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  onBtnEdit() {
    this.$router.push({
      name: 'advancePaymentAdd', query: {
        type: 'edit',
        uuid: this.id,
        ids: this.$route.query.ids,
        queryParams: this.$route.query.queryParams
      }
    })
  }

  onBtnDel() {
    this.$msgBox.confirm('删除提示', '确定要删除该预付款单吗?', () => {
      AdvancePaymentApi.remove(this.id, this.version).then(resp => {
        if (resp.success) {
          this.$message.success('删除成功')
          this.$router.push('advancePayment')
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    })
  }

  onBtnAbolished() {
    AdvancePaymentApi.abolish(this.id, this.version).then(resp => {
      if (resp.success) {
        this.$message.success('作废成功')
        this.$emit('getDetail',this.id)
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  onBtnExpot() {
    new Dialog(ExportDialog, {
      title: '导出预付款单详情',
      onExport: () => {
        return AdvancePaymentApi.exportAdvancePaymentDetail(this.id)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }
}
