import { Component, Vue } from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import PageBody from 'cmp/PageBody.vue'
import { Dialog, Loading } from 'fant'
import QueryParam from 'model/request/QueryParam'
import StatementReportApi from 'http/statement/StatementReportApi'
import StatementReport from 'model/statement/StatementReport'
import StatementSummary from 'model/statement/StatementSummary'
import BalanceRptSearch from 'pages/report/cmp/BalanceRptSearch'
import BalanceRptSummary from 'pages/report/cmp/BalanceRptSummary'
import BalanceRptTable from 'pages/report/cmp/BalanceRptTable'
import ListContainer from 'cmp/ListContainer.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import ExportDialog from 'cmp/ExportDialog.vue'
import PermissionMgr from 'mgr/PermissionMgr'

// 分页插件数据对象
class BalancePagination {
  start: number = 1
  total: number = 0
  limit: number = 10
}

@Component({
  name: 'BalanceRptList',
  components: {
    QueryCondition,
    PageBody,
    BalanceRptSearch,
    BalanceRptSummary,
    BalanceRptTable,
    ListContainer
  }
})
export default class BalanceRptList extends Vue {
  // 面包屑菜单
  menu = [{
    name: '收支流水',
    url: '/balanceRptList'
  }]
  // 表格数据
  tableData: StatementReport[] = []
  // 分页插件数据对象
  pagination = new BalancePagination()

  summary = new StatementSummary()

  // 表单查询数据对象
  query: QueryParam = new QueryParam()
  hasPermission = PermissionMgr.hasOptionPermission


  mounted() {
    this.query.limit = 10
    this.doSearch()
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
   *  导出全部
   */
  doExport() {

    new Dialog(ExportDialog, {
      title: '导出收支流水',
      msg: '您确定导出全部数据？',
      onExport: () => {
        return StatementReportApi.export(this.query)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }

  /**
   * 表格排序条件
   */
  onSortChange(val: any) {
    this.pagination.start = 1
    this.query.sorters = val
    this.doSearch()
  }

  doSearch() {
    this.query.start = (this.pagination.start - 1) * this.pagination.limit
    this.doGetList(this.query)
    this.getSummary(this.query)
  }

  /**
   * 获取商品列表数据
   */
  doGetList(query: QueryParam) {
    let loading = Loading.show()
    StatementReportApi.query(query).then((res) => {
      if (res && res.success) {
        this.pagination.total = res.total
        this.tableData = res.data
        console.log(res.data)
        loading.hide()
      }
    }).catch((err) => {
      this.$message.error(err.message)
      loading.hide()
    })
  }

  getSummary(query: QueryParam) {
    let loading = Loading.show()
    StatementReportApi.summary(query).then((resp) => {
      this.summary = resp.data
      loading.hide()
    }).catch((err) => {
      this.$message.error(err.message)
      loading.hide()
    })
  }

  /**
   * 跳转详情页面
   */
  doGoDetail(id: any, value: string) {
    if (value) {
      switch (value) {
        case 'payment':
          this.$router.push({ name: 'payAbleMenuDtl', query: { uuid: id } })
          break
        case 'receipt':
          this.$router.push({ name: 'receiptBillView', query: { id: id } })
          break
        default:
          break
      }
    }
  }
}
