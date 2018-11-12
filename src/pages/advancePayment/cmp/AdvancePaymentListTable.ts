import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
// import PaymentApi from 'http/statement/payment/PaymentApi'
import PermissionMgr from 'mgr/PermissionMgr'
import AdvancePaymentApi from 'http/advancepayment/AdvancePaymentApi'

@Component({
  name: 'PayAbleMenuTable',
  components: {}
})
export default class AdvancePaymentListTable extends Vue {
  // 定义选择的数组
  selectArray: any = []
  hasPermissions: Function = PermissionMgr.hasOptionPermission
  // 接收表格数据
  @Prop()
  tableData: any
  @Prop()
  printFlag: boolean
  @Prop()
  queryParams: any

  @Watch('printFlag')
  onPrintFlagChange(value: boolean) {
    value && this.$emit('printEvent', this.selectArray)
  }

  // 表格内批量勾选
  selectionChange(list: any) {
    this.selectArray = list
    this.$emit('printEvent', this.selectArray)
  }

  // 排序
  sortChange({ column, prop, order }: any) {
    order === 'ascending' ? (order = 'ASC') : (order = 'DESC')
    let sort: any = []
    column && prop && order && sort.push({ 'property': prop, 'direction': order })
    this.$emit('refreshListBySort', sort)
  }

  // 表格列格式化（有些不需要）
  onFormatter(row: any, column: any, value: any) {
    // todo
  }

  /**
   * 审核
   * @param row
   */
  onBtnAudit(row: any) {
    // todo
    AdvancePaymentApi.audit(row.id, row.version).then(resp => {
      if (resp.success) {
        this.$message.success('审核成功')
        this.$emit('refreshListBySort', [])
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  /**
   * 编辑
   * @param row
   */
  onBtnEdit(row: any) {
    // todo
    let ids: any[] = []
    this.tableData.forEach((item: any) => {
      ids.push(item.id)
    })
    this.$router.push({ name: 'advancePaymentAdd', query: { type: 'edit', uuid: row.id, ids: JSON.stringify(ids), queryParams: JSON.stringify(this.queryParams) } })
  }

  /**
   * 跳转到详情
   * @param row
   */
  onBtnDtl(row: any) {
    let ids: any[] = []
    this.tableData.forEach((item: any) => {
      ids.push(item.id)
    })
    this.$router.push({ name: 'advancePaymentDetail',
      query: { uuid: row.id, ids: JSON.stringify(ids),
        queryParams: JSON.stringify(this.queryParams) } })
  }

  /**
   * 作废
   * @param row
   */
  onBtnAbolish(row: any) {
    AdvancePaymentApi.abolish(row.id, row.version).then(resp => {
      if (resp.success) {
        this.$message.success('作废成功')
        this.$emit('refreshListBySort', [])
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }
}


