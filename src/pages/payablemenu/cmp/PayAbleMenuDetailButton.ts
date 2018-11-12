import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import PrintView from 'cmp/print/PrintView.vue'
import PrintMaintenanceView from 'cmp/print/PrintMaintenanceView.vue'
import PrintPreView from 'cmp/print/PrintPreView.vue'
import PermissionMgr from 'mgr/PermissionMgr'
import Payment from 'model/statement/payment/Payment'
import JobQueryApi from 'http/excel/JobQueryApi'
import ExportDialog from 'cmp/ExportDialog.vue'
import PaymentApi from 'http/statement/payment/PaymentApi'
import {Dialog} from 'fant'

@Component({
  name: 'PayAbleMenuDetailButton',
  components: {
    PrintView,
    PrintMaintenanceView,
    PrintPreView
  }
})
export default class PayAbleMenuDetailButton extends Vue {
  @Prop()
  bill: Payment
  @Prop()
  type: string
  id: string
  version: number
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  @Watch('bill', {deep: true})
  watchBill(value: Payment) {
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
    PaymentApi.audit(this.id).then(resp => {
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
      name: 'payAbleMenuAdd', query: {
        type: 'edit',
        uuid: this.id,
        ids: this.$route.query.ids,
        queryParams: this.$route.query.queryParams
      }
    })
  }

  onBtnAbolished() {
    PaymentApi.abolish(this.id).then(resp => {
      if (resp.success) {
        this.$message.success('作废成功')
        this.$emit('getDetail',this.id)
      }
    })
  }

  onBtnExpot() {
    new Dialog(ExportDialog, {
      title: '导出付款单详情',
      onExport: () => {
        return PaymentApi.exportPaymentDetail(this.id)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }

  onBtnDel() {
    this.$msgBox.confirm('删除提示', '确定要删除该付款单吗?', () => {
      PaymentApi.remove(this.id, this.version).then(resp => {
        if (resp.success) {
          this.$message.success('删除成功')
          this.$router.push('payAbleMenu')
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    })
  }
}
