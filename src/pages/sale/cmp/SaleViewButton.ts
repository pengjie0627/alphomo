import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import PermissionMgr from 'mgr/PermissionMgr'
import Sale from 'model/sale/Sale'
import SaleApi from 'http/sale/SaleApi'
import { Loading, Dialog } from 'fant'
import CommonUtil from 'util/CommonUtil'
import JobQueryApi from 'http/excel/JobQueryApi'
import ExportDialog from 'cmp/ExportDialog.vue'
import PrintView from 'cmp/print/PrintView.vue'
import PrintMaintenanceView from 'cmp/print/PrintMaintenanceView.vue'
import PrintPreView from 'cmp/print/PrintPreView.vue'

@Component({
  name: 'SaleViewButton',
  components: {
    ExportDialog,
    PrintView,
    PrintMaintenanceView,
    PrintPreView
  }
})
export default class SaleViewButton extends Vue {
  @Prop()
  type: string
  @Prop({
    type: String,
    default: 'detail'
  })
  target: string
  @Prop()
  bill: Sale

  btnStatus: any[] = []
  btnPerm: any[] = []
  btnShow: any[] = []
  btnMore: any[] = []
  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限
  id: string
  version: number

  @Watch('bill', { deep: true })
  watchBill(value: Sale) {
    if (value) {
      this.id = value.id!
      this.version = value.version
      this.btnStatusChange()
    }
  }

// <qf-dropdown-menu v-if="hasPermissions('sale.sale.audit') && btnMore[0].show" @click="onAudit">审核</qf-dropdown-menu>
// <qf-dropdown-menu v-if="hasPermissions('sale.saleReturn.create') && btnMore[1].show" @click="onReturn">退货
//   </qf-dropdown-menu>
// <qf-dropdown-menu v-if="hasPermissions('sale.sale.abolish') && btnMore[2].show" @click="onAbolish">作废
//   </qf-dropdown-menu>
// <qf-dropdown-menu v-if="hasPermissions('sale.sale.create') && btnMore[3].show" @click="onEdit">编辑</qf-dropdown-menu>
// <qf-dropdown-menu v-if="hasPermissions('sale.sale.delete') && btnMore[4].show" @click="onDel">删除</qf-dropdown-menu>
// <qf-dropdown-menu v-if="hasPermissions('sale.sale.create') && btnMore[5].show" @click="onCopy">复制</qf-dropdown-menu>

  /**
   * 按钮状态
   */
  btnStatusChange() {
    this.btnStatus = [
      { index: 1, show: this.btnPerm[0] && this.bill.status === 'UNAUDITED' },
      {
        index: 2,
        show: this.btnPerm[1] && (this.bill.status === 'PART_DELIVERED' || this.bill.status === 'DELIVERED') && this.bill.externalBill && (this.bill.externalBill.source === null || this.bill.externalBill.source === 'alphamo')
      },
      {
        index: 3,
        show: this.btnPerm[2] && (this.bill.status === 'PART_DELIVERED' || this.bill.status === 'DELIVERED' || this.bill.status === 'AUDITED') && this.bill.externalBill && (this.bill.externalBill.source === null || this.bill.externalBill.source === 'alphamo')
      },
      {
        index: 4,
        show: this.btnPerm[3] && this.bill.status === 'UNAUDITED' && this.bill.externalBill && (this.bill.externalBill.source === null || this.bill.externalBill.source === 'alphamo')
      },
      {
        index: 5,
        show: this.btnPerm[4] && this.bill.status === 'UNAUDITED' && this.bill.externalBill && (this.bill.externalBill.source === null || this.bill.externalBill.source === 'alphamo')
      },
      {
        index: 6,
        show: this.btnPerm[5] && this.bill.externalBill && this.bill.externalBill && (this.bill.externalBill.source === null || this.bill.externalBill.source === 'alphamo')
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
      title: '删除销售单',
      rule: [],
      showCancel: true,
      showConfirm: true,
      msg: '确认删除此销售单',
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
    SaleApi.remove(this.id, this.version).then(resp => {
      loading.hide()
      this.$router.push({ name: 'saleList' })
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
    SaleApi.audit(this.id, this.version).then(resp => {
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
    SaleApi.abolish(this.id, this.version).then(resp => {
      loading.hide()
      this.$emit('getDetail', this.id)
      this.$emit('getList')
    }).catch((error) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }


  onEdit() {
    this.$router.push({ name: 'saleEdit', query: { id: this.id } })
  }

  onReturn() {
    this.$router.push({ name: 'saleReturnEdit', query: { sale: this.id, from: 'sale' } })
  }

  onCopy() {
    this.$router.push({ name: 'saleEdit', query: { id: this.id, isCopy: 'true' } })
  }

  onPrint() {
    window.print()
  }

  onExport() {
    new Dialog(ExportDialog, {
      title: '导出销售单详情',
      msg: '您确定导出全部数据？',
      onExport: () => {
        return SaleApi.exportSaleDetail(this.id)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }

}
