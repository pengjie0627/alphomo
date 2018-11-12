import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import PrintView from 'cmp/print/PrintView.vue'
import PrintMaintenanceView from 'cmp/print/PrintMaintenanceView.vue'
import PrintPreView from 'cmp/print/PrintPreView.vue'
import PermissionMgr from 'mgr/PermissionMgr'
import Charge from 'model/charge/Charge'
import ChargeApi from 'http/charge/ChargeApi'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import {Dialog, Loading} from 'fant'

@Component({
  name: 'ChargeDetailButton',
  components: {
    PrintView,
    PrintMaintenanceView,
    PrintPreView
  }
})
export default class ChargeDetailButton extends Vue {
  @Prop()
  bill: Charge
  @Prop()
  type: string
  id: string
  version: number
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  @Watch('bill', {deep: true})
  watchBill(value: Charge) {
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
    console.log('删除')
    this.$msgBox.confirm('删除提示', '确定要删除该付款单吗?', () => {
      let loading = Loading.show()
      ChargeApi.remove(this.id, this.bill.version).then(resp => {
        if (resp.success) {
          loading.hide()
          this.$message.error('删除成功')
          this.$router.push({ name: 'chargeList' })
        }
      }).catch(error => {
        loading.hide()
        this.$message.error(error.message)
      })
    })
  }

  onBtnEdit() {
    console.log('编辑')
    this.$router.push({
      name: 'chargeAdd',
      query: { type: 'edit', id: this.id },
      params: {
        type: 'edit',
        id: this.id,
        ids: JSON.stringify(this.$route.query.ids),
        query: JSON.stringify(this.$route.query.queryParams)
      }
    })
  }

  onBtnAudit() {
    console.log('审核')
    let loading = Loading.show()
    ChargeApi.audit(this.id, this.bill.version).then(resp => {
      if (resp.success) {
        loading.hide()
        this.$message.success('审核成功')
        this.$emit('getDetail',this.id)
      }
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  onBtnAbolish() {
    console.log('作废')
    let loading = Loading.show()
    ChargeApi.abolish(this.id, this.bill.version).then(resp => {
      if (resp.success) {
        loading.hide()
        this.$message.success('作废成功')
        this.$emit('getDetail',this.id)
      }
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  onBtnExport() {
    console.log('导出')
    new Dialog(ExportDialog, {
      title: '导出费用单详情',
      onExport: () => {
        return ChargeApi.exportChargeDetail(this.$route.query.id)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }
}
