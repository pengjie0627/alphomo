import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import PermissionMgr from 'mgr/PermissionMgr'
import {Loading} from 'fant'
import Receipt from 'model/statement/receipt/Receipt'
import ReceiptApi from 'http/statement/receipt/ReceiptApi'
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
export default class ViewBtn extends Vue {
  @Prop()
  receipt: Receipt
  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限
  id: string

  @Watch('receipt', {deep: true})
  watchBill(value: Receipt) {
    if (value) {
      this.id = value.id!
    }
  }

  mounted() {
    this.id = this.receipt.id!
    this.watchBill(this.receipt)
  }


  onAudit() {
    let loading = Loading.show({
      msg: '审核中'
    })
    ReceiptApi.audit(this.id).then(resp => {
      loading.hide()
      this.$emit('getDetail', this.id)
    }).catch((error) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  onAbolish() {
    let loading = Loading.show({
      msg: '作废中'
    })
    ReceiptApi.abolish(this.id).then(resp => {
      loading.hide()
      this.$emit('getDetail', this.id)
    }).catch((error) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }


  onEdit() {
    this.$router.push({name: 'receiptBillEdit', query: {id: this.id}})
  }

  onPrint() {
    window.print()
  }
}
