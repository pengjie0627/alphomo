import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import SupplierStatementApi from 'http/supplierstatement/SupplierStatementApi'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  name: 'AccountBillListTable',
  components: {}
})
export default class AccountBillListTable extends Vue {
  // 定义选择的数组
  selectArray: any = []
  hasPermissions: Function = PermissionMgr.hasOptionPermission
  // 接收表格数据
  @Prop()
  tableData: any
  @Prop()
  queryParams: any
  @Prop()
  printFlag: boolean

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
   * 跳转到详情
   * @param row
   */
  onToDtl(row: any) {
    let ids: any[] = []
    this.tableData.forEach((item: any) => {
      ids.push(item.id)
    })
    this.$router.push({ name: 'accountBillDtl', query: {
      uuid : row.id,
      ids: JSON.stringify(ids),
      queryParams: JSON.stringify(this.queryParams)
    } })
  }

  /**
   * 跳转到编辑
   * @param row
   */
  onToEdit(row: any) {
    let ids: any[] = []
    this.tableData.forEach((item: any) => {
      ids.push(item.id)
    })
    this.$router.push({ name: 'accountBillAdd', query: {
      type: 'edit',
      ids: JSON.stringify(ids),
      queryParams: JSON.stringify(this.queryParams),
      uuid : row.id } })
  }
  onBtnAudit(row: any) {
    SupplierStatementApi.audit(row.id).then((resp) => {
      if (resp && resp.success) {
        this.$message.success('审核成功')
        this.$emit('refreshListBySort', [])
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }
  onBtnAbolish(row: any) {
    SupplierStatementApi.abolish(row.id).then((resp) => {
      if (resp && resp.success) {
        this.$message.success('作废成功')
        this.$emit('refreshListBySort', [])
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }
}


