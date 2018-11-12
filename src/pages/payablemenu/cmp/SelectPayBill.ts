import { Vue, Component } from 'vue-property-decorator'
import Sku from 'model/basicdata/sku/Sku'
import PaymentApi from 'http/statement/payment/PaymentApi'
import QueryParam from 'model/request/QueryParam'
import UserApi from 'http/framework/user/UserApi'
@Component({
  name: 'SelectPayBill',
  components: {}
})
export default class SelectPayBill extends Vue {
  tableData: any[] = []
  selectData: any[] = []
  onConfirm: Function
  uuids: Function
  currency: string = 'CNY'
  supplierId = ''
  pagination = {
    total: 0,
    limit: 10,
    start: 1
  }
  query = ['', '', '', '']
  manageList: any[] = []
  mounted() {
    // this.query[3] = 'AdvancePayment'
    this.getManageList()
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
    this.onConfirm(this.selectData)
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
    this.selectData = arr
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
  getStatusName(type: string) {
    if (type === 'SupplierStatement') {
      return '结算单'
    }
    if (type === 'ChargeDeduction') {
      return '费用单(账款结算)'
    }
    if (type === 'ChargeCash') {
      return '费用单（现金）'
    }
    if (type === 'AdvancePayment') {
      return '预付款单'
    }
  }
  /**
   * 获取结算单据
   */
  private getBills() {
    let query = new QueryParam()
    query.filters.push({ 'property': 'billNum:%=%', 'value': this.query[0] })
    query.filters.push({ 'property': 'businessDate:[,]', 'value': this.query[1] })
    query.filters.push({ 'property': 'manager:=', 'value': this.query[2] })
    query.filters.push({ 'property': 'billType:=', 'value': this.query[3] })
    query.filters.push({ 'property': 'uuid:notIn', 'value': this.uuids() })
    query.start = (this.pagination.start - 1) * 10
    query.limit = 10
    PaymentApi.queryBills(this.supplierId, this.currency, query).then((resp) => {
      if (resp.data && resp.success) {
        this.tableData = resp.data
        this.pagination.total = resp.total
      }
    }).catch((error) => {
      this.$message.error(error.message)
    })
  }
  /**
   * 获取经办人列表
   */
  private getManageList() {
    let query = new QueryParam()
    query.start = 0
    query.limit = 0
    UserApi.query(query).then(resp => {
      this.manageList = resp.data
    }).catch(error => {
      this.$message.error(error.message)
    })
  }
}


