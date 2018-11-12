import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import PrintView from 'cmp/print/PrintView.vue'
import PrintMaintenanceView from 'cmp/print/PrintMaintenanceView.vue'
import PrintPreView from 'cmp/print/PrintPreView.vue'
import PermissionMgr from 'mgr/PermissionMgr'
import SupplierStatementApi from 'http/supplierstatement/SupplierStatementApi'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import { Dialog } from 'fant'

@Component({
  name: 'AccountBillDetailButton',
  components: {
    PrintView,
    PrintMaintenanceView,
    PrintPreView
  }
})
export default class AccountBillDetailButton extends Vue {
  @Prop()
  bill: any
  @Prop()
  type: string
  id: string
  version: number
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  @Watch('bill', { deep: true })
  watchBill(value: any) {
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

  onBtnDel() {
    this.$msgBox.confirm('删除提示', '确定要删除该结算单吗？', () => {
      SupplierStatementApi.remove(this.$route.query.uuid, this.bill.version).then(resp => {
        if (resp.success) {
          this.$message.success('删除成功')
          this.$router.push('/accountBillList')
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    })
  }

  onBtnEdit() {
    this.$router.push({
      name: 'accountBillAdd', query: {
        type: 'edit',
        uuid: this.$route.query.uuid,
        ids: this.$route.query.ids,
        queryParams: this.$route.query.queryParams
      }
    })
  }

  onBtnAudit() {
    SupplierStatementApi.audit(this.$route.query.uuid).then(resp => {
      if (resp.success) {
        this.$message.success('审核成功')
        this.$router.push('/accountBillList')
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  onBtnExport() {
    new Dialog(ExportDialog, {
      title: '导出结算单详情',
      onExport: () => {
        return SupplierStatementApi.exportSupplierStatementDetail(this.id)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }

  onBtnAbolish() {
    SupplierStatementApi.abolish(this.$route.query.uuid).then(resp => {
      if (resp.success) {
        this.$message.success('作废成功')
        this.$emit('getDetail',this.$route.query.uuid)
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }
}
