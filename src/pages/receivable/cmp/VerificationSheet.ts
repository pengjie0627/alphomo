import { Component, Vue } from 'vue-property-decorator'
import search from 'cmp/Search.vue'
import FilterParam from 'model/request/FilterParam'
import ConstantMgr from 'mgr/ConstantMgr'
import User from 'model/framework/user/User'
import { DateUtil, Loading } from 'fant'
import PayBill from 'model/entity/PayBill'
import QueryParam from 'model/request/QueryParam'
import SaleReportApi from 'http/sale/report/SaleReportApi.ts'

// 列表查询数据对象
class PageQueryCondition {
  businessDateFrom: Date
  businessDateTo: Date
  billNum: string
  manager: string
}

// 分页插件数据对象
class SalePagination {
  start: number = 1
  total: number = 0
  limit: number = 10
}

@Component({
  components: {
    search
  }
})
export default class VerificationSheet extends Vue {
  onConfirm: Function
  seletData: Array<PayBill>
  manager: User = new User()
  // 查询数据对象
  queryCondition: PageQueryCondition = new PageQueryCondition()
  supplier: string = ''
  // 界面长度限制
  limits = ConstantMgr.limits.payable
  filters: FilterParam[] = []
  query: QueryParam = new QueryParam()
  data: Array<PayBill> = []
  customerId: string
  uuid: Array<string> = []

  // 已选对象
  selectedData: PayBill[] = []
  // 分页插件数据对象
  pagination = new SalePagination()


  /**
   * 构建查询条件
   */
  getQueryParam() {
    let filters: FilterParam[] = []
    if (this.queryCondition.billNum) {
      filters.push(new FilterParam('billNum:%=%', this.queryCondition.billNum))
    }
    if (this.customerId) {
      filters.push(new FilterParam('customer:=', this.customerId))
    }
    if (this.queryCondition.businessDateFrom || this.queryCondition.businessDateTo) {
      filters.push(new FilterParam('businessDate:[,]', [this.queryCondition.businessDateFrom, this.queryCondition.businessDateTo]))
    }
    if (this.queryCondition.manager) {
      filters.push(new FilterParam('manager:=', this.queryCondition.manager))
    }
    if (this.uuid.length > 0) {
      filters.push(new FilterParam('uuid:notIn', this.uuid))
    }
    this.query.filters = filters
  }

  doSearch() {
    this.query.start = (this.pagination.start - 1) * 10
    this.query.limit = 10
    this.getList()
  }


  /**
   * 按条件搜索
   * @param val
   */
  onSetFilter(val: any) {
    this.pagination.start = 1
    this.getQueryParam()
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

  getList() {
    let loading = Loading.show()
    let $this = this
    $this.data = []
    SaleReportApi.receivableBills(this.query).then((res) => {
      if (res && res.success) {
        this.pagination.total = res.total
        // if (this.selectedData) {
        //   res.data.forEach(function (item: PayBill) {
        //     let i: boolean = true
        //     $this.selectedData.forEach(function (data) {
        //       if (data.billNum === item.billNum) {
        //         i = false
        //       }
        //     })
        //     if (i) {
        //       $this.data.push(item)
        //     }
        //   })
        // } else {
        //   this.data = res.data
        // }
        this.data = res.data
        this.selectedData = []
        loading.hide()
      }
    }).catch((err) => {
      this.$message.error(err.message)
      loading.hide()
    })
  }

  onManagerChange(manager: User) {
    this.queryCondition.manager = manager.id!
  }


  /**
   * 重置搜索条件
   */
  doReset() {
    this.manager = new User()
    let filters: FilterParam[] = []
    this.queryCondition = new PageQueryCondition()
    if (this.customerId) {
      filters.push(new FilterParam('customer:=', this.customerId))
    }
    if (this.uuid.length > 0) {
      filters.push(new FilterParam('uuid:notIn', this.uuid))
    }
    this.query.filters = filters
    this.pagination.start = 1
    this.doSearch()

  }

  mounted() {
    this.doReset()
  }

  doCancel() {
    this.$emit('hide')
  }

  doConfirm() {
    this.onConfirm(this.selectedData)
    this.$emit('hide')
  }

  /**
   * 表格选择
   * @param val
   */
  doSelectionChange(val: PayBill[]) {
    this.selectedData = val
  }


  doSearchReset() {
    this.manager = new User()
    let filters: FilterParam[] = []
    this.queryCondition = new PageQueryCondition()
    this.pagination.start = 1
    this.query.filters = filters
    this.doSearch()
  }

  /**
   * 表格过滤器： 业务时间
   * @param row
   * @param column
   * @param {string} value
   * @returns {string}
   */
  dateFormatter(row: any, column: any, value: string) {
    if (value) {
      let date = DateUtil.format(new Date(value), 'yyyy-MM-dd')
      return date
    } else {
      return '--'
    }
  }

  /**
   * 表格过滤器： 销售额
   * @param row
   * @param column
   * @param {string} value
   * @returns {string}
   */
  priceFormatter(row: any, column: any, value: string) {
    if (value && Number(value) !== 0) {
      return Number(value).toFixed(2)
    } else {
      return '0.00'
    }
  }

  billTypeFormatter(row: any, column: any, value: string) {
    if (value) {
      let statusText: string = ''
      switch (value) {
        case 'OtherPaymentLine':
          statusText = '其他支出'
          break
        case 'Purchase':
          statusText = '进货'
          break
        case 'PurchaseReturn':
          statusText = '进货退货'
          break
        case 'Sale':
          statusText = '销售'
          break
        case 'SaleReturn':
          statusText = '销售退货'
          break
        case 'OtherReceiptLine':
          statusText = '其他收入'
          break
        default:
          statusText = '--'
      }
      return statusText
    } else {
      return '--'
    }
  }
}
