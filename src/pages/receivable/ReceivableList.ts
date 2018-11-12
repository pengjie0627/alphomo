import { Component, Vue } from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'pages/receivable/cmp/ReceivableTableContainer.vue'
import receivableListSearch from 'pages/receivable/cmp/ReceivableListSearch.vue'
import ReceivableListTable from 'pages/receivable/cmp/ReceivableListTable.vue'
import ReceivableSummary from 'pages/receivable/cmp/ReceivableSummary.vue'
import QueryParam from 'model/request/QueryParam'
import { Dialog, Loading } from 'fant'
import ConstantMgr from 'mgr/ConstantMgr'
import PayableReportApi from 'http/statement/payable/PayableReportApi'
import JobQueryApi from 'http/excel/JobQueryApi'
import ExportDialog from 'cmp/ExportDialog.vue'
import ReceivableReport from 'model/statement/receivable/ReceivableReport'
import ReceivableReportApi from 'http/statement/receivable/ReceivableReportApi'
import FilterParam from 'model/request/FilterParam'
import PermissionMgr from 'mgr/PermissionMgr'

// 分页插件数据对象
class SalePagination {
  start: number = 1
  total: number = 0
  limit: number = 10
}

@Component({
  components: {
    QueryCondition,
    PageBody,
    ListContainer,
    receivableListSearch,
    ReceivableListTable,
    ReceivableSummary,
    ExportDialog
  }
})
export default class ReceivableList extends Vue {
  // 面包屑菜单
  menu = [{
    name: '应收对账',
    url: '/receivableList'
  }]
  // 表格数据
  tableData: ReceivableReport[] = []
  // 已选对象
  selectedData: ReceivableReport[] = []
  // 分页插件数据对象
  pagination = new SalePagination()
  // 表单查询数据对象
  query: QueryParam = new QueryParam()
  // 界面长度限制
  limits = ConstantMgr.limits.receivable
  beginingAmount: number = 0
  receivedAmount: number = 0
  amount: number = 0
  inAmount: number = 0
  discountAmount: number = 0
  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限

  mounted() {
    let filters: FilterParam[] = []
    filters.push(new FilterParam('amount:!=', 0))
    this.query.filters = filters
    this.doSearch()
  }

  /**
   * 获取界面数据
   */
  doGetList(query: QueryParam) {
    this.getSummary(query)
    this.getRecordList(query)
  }

  getSummary(query: QueryParam) {
    let loading = Loading.show()
    ReceivableReportApi.summary(query).then((resp) => {
      this.beginingAmount = resp.data.beginingAmount
      this.receivedAmount = resp.data.receivedAmount
      this.discountAmount = resp.data.discountAmount
      this.inAmount = resp.data.inAmount
      this.amount = resp.data.amount
      loading.hide()
    }).catch((err) => {
      this.$message.error(err.message)
      loading.hide()
    })
  }

  getRecordList(query: QueryParam) {
    let loading = Loading.show()
    ReceivableReportApi.query(query).then((res) => {
      if (res && res.success) {
        this.pagination.total = res.total
        this.tableData = res.data
        loading.hide()
      }
    }).catch((err) => {
      this.$message.error(err.message)
      loading.hide()
    })
  }


  /**
   * 设置查询条件
   */
  doSearch() {
    this.query.start = (this.pagination.start - 1) * 10
    this.query.limit = 10
    this.doGetList(this.query)
  }


  /**
   * 按条件搜索
   * @param val
   */
  onSetFilter(val: any) {
    this.pagination.start = 1
    this.query.filters = val
    this.doSearch()
  }

  /**
   * 页码改变
   * @param {number} val
   */

  onPageChange(val: number) {
    this.pagination.start = val / (this.pagination.limit - 1)
    this.doSearch()
  }

  /**
   * 跳转编辑界面
   */
  doGoCreate() {
    this.$router.push('/receiptBillEdit')
  }

  doGetDetail() {
    this.$router.push('/receiptBillView')
  }

  /**
   *  导出全部
   */
  doExport() {
    let query = new QueryParam()
    PayableReportApi.export(query).then((resp) => {
      if (resp && resp.success) {
        console.log(resp)
      }
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  /**
   * 表格选择
   * @param arr
   */
  onSelectionChange(arr: ReceivableReport[]) {
    this.selectedData = arr
  }


  /**
   * 表格排序条件
   */
  onSortChange(val: any) {
    this.query.start = 1
    this.pagination.start = 1
    this.query.sorters = val
    this.doSearch()
  }

  doGetDetailList() {
    this.$router.replace('/payableView')
  }

  doImport() {
    new Dialog(ExportDialog, {
      title: '导出应收对账',
      msg: '您确定导出全部数据？',
      onExport: () => {
        return ReceivableReportApi.export(this.query)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }

}
ReceivableList.filter('priceFormatter', (value: string) => {
  if (value && Number(value) !== 0) {
    return Number(value).toFixed(2)
  } else {
    return '0.00'
  }
})
ReceivableList.filter('fmtThumb', (value: string) => {
  if (!value) return '0.00'
  value = value.toString()
  let intPart = value.split('.')[0] // 之前的处理方式会四舍五入
  let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三let
  let floatPart = '.00' // 预定义小数部分
  let value2Array = value.split('.')

  // =2表示数据有小数位
  if (value2Array.length === 2) {
    let floatStr = '0.' + value2Array[1]
    floatPart = Number(floatStr).toFixed(2).toString() // 拿到小数部分

    if (floatPart.length === 1) { // 补0,实际上用不着
      return intPartFormat + '.' + floatPart.substring(2, floatPart.length) + '0'
    } else {
      return intPartFormat + '.' + floatPart.substring(2, floatPart.length)
    }

  } else {
    return intPartFormat + floatPart
  }
})
