import { Component, Vue, Watch } from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import PageBody from 'cmp/PageBody.vue'
import ReceivableContainer from 'pages/receivable/cmp/ReceivableTableContainer.vue'
import ReceivableRecordSearch from 'pages/receivable/cmp/ReceivableRecordSearch.vue'
import ReceivableRecordTable from 'pages/receivable/cmp/ReceivableRecordTable.vue'
import BusinessRecordSearch from 'pages/receivable/cmp/BusinessRecordSearch.vue'
import ReceivableSummary from 'pages/receivable/cmp/ReceivableSummary.vue'
import QueryParam from 'model/request/QueryParam'
import { Dialog, Loading } from 'fant'
import ConstantMgr from 'mgr/ConstantMgr'
import ReceiptApi from 'http/statement/receipt/ReceiptApi'
import Receipt from 'model/statement/receipt/Receipt'
import BusinessRecordTable from 'pages/receivable/cmp/BusinessRecordTable.vue'
import Receivable from 'model/statement/receivable/Receivable'
import ReceivableReportApi from 'http/statement/receivable/ReceivableReportApi'
import JobQueryApi from 'http/excel/JobQueryApi'
import ExportDialog from 'cmp/ExportDialog.vue'
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
    ReceivableContainer,
    ReceivableRecordSearch,
    ReceivableRecordTable,
    BusinessRecordSearch,
    BusinessRecordTable,
    ReceivableSummary,
    ExportDialog
  }
})
export default class ReceivableView extends Vue {
  // 面包屑菜单
  menu = [{
    name: '应收对账',
    url: '/ReceivableList'
  }, {
    name: '应收对账明细'
  }]
  customer: string = ''
  customerName: string = ''
  customerCode: string = ''
  // 表格数据
  tableDataRecord: Receipt[] = []
  tableDataBusiness: Receivable[] = []
  selectName: string = 'first'

  // 分页插件数据对象
  pagination = new SalePagination()
  // 表单查询数据对象
  query: QueryParam = new QueryParam()
  // 界面长度限制
  limits = ConstantMgr.limits.receivable
  ids: string[] = []
  discountAmount: number = 0
  // 合计收款
  totalPaidAmount: number = 0
  receivedAmount: number = 0
  amount: number = 0
  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限


  @Watch('selectName')
  watchSelectName(value: string) {
    this.selectName = value
    // tab切换初始化每个tab的查询条件
    this.query = new QueryParam()
    this.doSearch()
  }

  mounted() {
    this.customer = this.$route.query.id
    this.customerName = this.$route.query.name
    this.customerCode = this.$route.query.code
    this.doSearch()
  }

  doImport() {
    if (this.selectName === 'first') {
      new Dialog(ExportDialog, {
        title: '导出应收对账收款记录',
        msg: '您确定导出全部数据？',
        onExport: () => {
          return ReceiptApi.export(this.customer, this.query)
        },
        onProgress: (val: string) => {
          return JobQueryApi.query(val)
        }
      }).show()
    } else {
      new Dialog(ExportDialog, {
        title: '导出应收对账明细',
        msg: '您确定导出全部数据？',
        onExport: () => {
          return ReceivableReportApi.exportBill(this.customer, this.query)
        },
        onProgress: (val: string) => {
          return JobQueryApi.query(val)
        }
      }).show()
    }
  }

  /**
   * 获取列表数据
   */
  doGetList(query: QueryParam) {

    if (this.selectName === 'first') {
      this.getRecordSummary(query)
      this.getRecordList(query)
    } else {
      this.getBusinessSummary(query)
      this.getBusinessList(query)

    }

  }

  getRecordList(query: QueryParam) {
    let loading = Loading.show()
    ReceiptApi.query(this.customer, query).then((res) => {
      if (res && res.success) {
        this.pagination.total = res.total
        this.tableDataRecord = res.data
        this.ids = []
        if (res.data) {
          this.tableDataRecord.forEach(item => {
            this.ids.push(item.id!)
          })
        } else {
          this.ids = []
        }
        loading.hide()
      }
    }).catch((err) => {
      this.$message.error(err.message)
      loading.hide()
    })
  }

  getBusinessList(query: QueryParam) {
    let loading = Loading.show()
    ReceivableReportApi.queryBill(this.customer, query).then((res) => {
      if (res && res.success) {
        this.pagination.total = res.total
        this.tableDataBusiness = res.data
        loading.hide()
      }
    }).catch((err) => {
      this.$message.error(err.message)
      loading.hide()
    })
  }

  getBusinessSummary(query: QueryParam) {
    let loading = Loading.show()
    ReceivableReportApi.summaryBill(this.customer, query).then((resp) => {
      this.receivedAmount = resp.data.receivedAmount
      this.amount = resp.data.amount
      loading.hide()
    }).catch((err) => {
      this.$message.error(err.message)
      loading.hide()
    })
  }

  getRecordSummary(query: QueryParam) {
    let loading = Loading.show()
    ReceiptApi.summary(this.customer, query).then((resp) => {
      this.discountAmount = resp.data.discountAmount
      this.totalPaidAmount = resp.data.totalRcvdAmount
      loading.hide()
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
   * 跳转新增界面
   */
  doGoCreate() {
    this.$router.push({
      name: 'receiptBillEdit',
      query: { customerId: this.customer, customerName: this.customerName, customerCode: this.customerCode }
    })
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

}
ReceivableView.filter('priceFormatter', (value: string) => {
  if (value && Number(value) !== 0) {
    return Number(value).toFixed(2)
  } else {
    return '0.00'
  }
})
ReceivableView.filter('fmtThumb', (value: string) => {
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
