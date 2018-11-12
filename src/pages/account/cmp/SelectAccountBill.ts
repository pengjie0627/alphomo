import { Vue, Component } from 'vue-property-decorator'
import Sku from 'model/basicdata/sku/Sku'
import SupplierStatementApi from 'http/supplierstatement/SupplierStatementApi'
import QueryParam from 'model/request/QueryParam'

@Component({
  name: 'SelectAccountBill',
  components: {}
})
export default class SelectAccountBill extends Vue {
  tableData: any[] = []
  uuids: Function
  selectArray: any[] = []
  query = ['','','','','']
  manageList: any[]
  supplierId = ''
  onConfirm: Function
  pagination = {
    total: 0,
    limit: 10,
    start: 1
  }
  mounted() {
    this.getBills()
  }
  /**
   * dialog 取消
   */
  doCancel() {
    this.$emit('hide')
  }

  /**
   * dialog 确认
   */
  doConfirm() {
    this.onConfirm(this.selectArray)
    this.$emit('hide')
  }
  onSearch() {
    // TODO
    this.pagination.start = 1
    this.getBills()
  }
  onReset() {
    // TODO
    this.query.forEach((item, index) => {
      this.$set(this.query, index, '')
    })
    this.getBills()
  }
  /**
   * 表格选择
   * @param arr
   */
  onSelectionChange(arr: Sku[]) {
    this.selectArray = arr
  }
  /**
   * 页码改变
   * @param {number} val
   */
  onPageChange(val: number) {
    this.pagination.start = val / (this.pagination.limit - 1)
    // TODO
    this.getBills()
  }
  /**
   * 金额格式化
   * @param row
   * @param column
   * @param value
   */
  formatter(row: any, column: any, value: string) {
    if (value) {
      return parseFloat(value).toFixed(2)
    } else {
      return '0.00'
    }
  }
  /**
   * 获取结算单据
   */
  private getBills() {
    let query = new QueryParam()
    query.filters.push(
      { 'property': 'billNum:%=%', 'value': this.query[0] }
    )
    query.filters.push(
      { 'property': 'businessDate:[,]', 'value': this.query[1] }
    )
    query.filters.push(
      { 'property': 'manager:=', 'value': this.query[2] },
    )
    query.filters.push(
      { 'property': 'billType:=', 'value': this.query[3] }
    )
    query.filters.push(
      { 'property': 'settleStatus:=', 'value': this.query[4] }
    )
    query.filters.push(
      { 'property': 'uuid:notIn', 'value': this.uuids() }
    )
    query.start = (this.pagination.start - 1) * 10
    query.limit = 10
    SupplierStatementApi.queryBills(this.supplierId ,query).then((resp) => {
      if (resp.data && resp.success) {
        this.tableData = resp.data
        this.pagination.total = resp.total
      }
    }).catch((error) => {
      this.$message.error(error.message)
    })
  }
}


