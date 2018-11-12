import { Vue, Component, Watch } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import QueryCondition from 'cmp/QueryCondition.vue'
import QueryParam from 'model/request/QueryParam'
import FilterParam from 'model/request/FilterParam'
import PayAbleMenuTable from 'pages/payablemenu/cmp/PayAbleMenuTable.vue'
import PaymentApi from 'http/statement/payment/PaymentApi'
import SupplierApi from 'http/basicdata/supplier/SupplierApi'
import UserApi from 'http/framework/user/UserApi'
import { Dialog } from 'fant'
import JobQueryApi from 'http/excel/JobQueryApi'
import ExportDialog from '../../cmp/ExportDialog'
import PrintView from 'cmp/print/PrintView.vue'
import PermissionMgr from 'mgr/PermissionMgr'
@Component({
  name: 'PayAbleMenu',
  components: {
    PayAbleMenuTable,
    PageBody,
    ListContainer,
    QueryCondition,
    PrintView
  }
})
export default class PayAbleMenu extends Vue {
  // 排序数组
  sort: any[] = []
  // 临时数组（使用临时数组的原因是需要记录点击搜索后的参数，而不是用户改变的搜索条件没有点击搜索的参数值）
  queryArr: any[] = []
  // 展开或者收起标识（产品要求，展开后要清除收起时的搜索条件，反之亦然）
  isOpenFlag = false
  // 打印标识
  printFlag = false
  hasPermissions: Function = PermissionMgr.hasOptionPermission
  getSumAmount = 0
  // 面包屑导航
  menu = [
    {
      name: '',
      url: ''
    }
  ]
  // 定义查询条件(这里定义查询条件而不是用ts文件中的model,一是因为大多数后端还没有生成model,前端无法使用。当然还有其它考虑)
  query = {
    closed: [''],// 收起状态 todo 第一步要修改的，这里需要修改成对应的参数个数
    closedProperty: ['keyword:%=%'], // todo 第一步要修改的，这里需要修改成对应的参数名称
    expand: ['', '', '', '', '', ''], // 展开状态 todo 第一步要修改的，这里需要修改成对应的参数个数
    expandProperty: ['billNum:%=%',
      'businessDate:[,]',
      'managerName:%=%',
      'supplierName:%=%',
      'currency:=',
      'status:=',
      'businessBillNum:%=%'] // todo 第一步要修改的，这里需要修改成对应的参数名称
  }
  // 分页
  pagination = {
    total: 0,
    limit: 10,
    start: 1
  }
  // 要传递给子组件table的数据
  tableData: any[] = []
  // refs定义
  $refs: {
    fuzzy: any,
    search: any
  }
  providerList: any[] = []
  manageList: any[] = []
  id: any[] = []
  selectId: any[] = []
  @Watch('$route')
  onRouteChange(to: any, from: any) {
    if (from.name !== 'payAbleMenuDtl' && from.name !== 'payAbleMenu' && to.name === 'payAbleMenu') {
      this.reset()
      this.$refs.search.doToggle()
    } else {
      if (from.name === 'payAbleMenuDtl') {
        this.getDataList(this.setParams())
      }
    }
  }
  /**
   * 获取参数
   */
  get getQueryParams() {
    return this.setParams()
  }
  /**
   * 挂载之后
   */
  mounted() {
    // 自动识别name和url
    this.menu[0].name = '付款单'
    this.menu[0].url = this.$route.path
    // 自动获取焦点
    this.$refs.fuzzy.focus()
    // 获取列表数据
    this.getDataList(this.setParams())
    this.getProviderList()
    this.getManageList()
    this.getSummary()
  }

  /**
   * 点击搜素触发
   */
  search(isOpen: boolean) {
    this.queryArr = []
    this.isOpenFlag = isOpen
    this.pagination.start = 1
    this.recordParams(isOpen)
    this.getDataList(this.setParams())
  }

  /**
   * 点击重置触发
   */
  reset() {
    this.resetSearchParams()
    this.queryArr = []
    this.pagination.start = 1
    this.getDataList(this.setParams())
  }

  /**
   * 点击收起或者展开触发
   */
  toggle(isOpen: boolean) {
    this.isOpenFlag = isOpen
    if (isOpen) {
      this.$set(this.query.closed, 0, '')
    } else {
      this.resetSearchParams()
    }
  }

  onRefreshList() {
    this.pagination.start = 1
    this.getDataList(this.setParams())
  }

  /**
   * 点击排序后父级接受的事件
   */
  onRefreshListBySort(sort: any[]) {
    this.pagination.start = 1
    this.sort = sort
    this.getDataList(this.setParams())
  }

  onPageChange(val: number) {
    this.pagination.start = val / (this.pagination.limit - 1)
    this.getDataList(this.setParams())
  }

  /**
   * 导出全部
   */
  onExport() {
    // todo 第二步调用导出全部的接口
    new Dialog(ExportDialog, {
      title: '导出付款单',
      onExport: () => {
        return PaymentApi.export(this.setParams())
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }
  doEnterSearch() {
    this.search(this.isOpenFlag)
  }

  /**
   * 打印
   */
  onPrint() {
    this.printFlag = true
  }

  /**
   * 打印
   */
  onPrintEvent(list: any[]) {
    // todo 第三步：调用自己的打印接口  注意：成功后把this.printFlag=false,否则无法二次触发
    this.selectId = []
    list.forEach(item => {
      this.selectId.push(item.id)
    })
  }

  /**
   * 新建付款单
   */
  onAddPay() {
    let ids: any[] = []
    if (this.tableData && this.tableData.length > 0) {
      this.tableData.forEach(item => {
        ids.push(item.id)
      })
    }
    this.$router.push({ name: 'payAbleMenuAdd',
      query: { type: 'add', uuid: '', ids: JSON.stringify(ids),
        queryParams: JSON.stringify(this.setParams()) } })
  }

  /**
   * 设置参数
   * @returns {QueryParam}
   */
  private setParams() {
    let query = new QueryParam()
    query.limit = 10
    query.start = (this.pagination.start - 1) * 10
    query.sorters = this.sort
    this.equalParams(query)
    return query
  }

  /**
   * 重置每个搜索条件的值
   */
  private resetSearchParams() {
    this.query.expand.forEach((item, index) => {
      this.$set(this.query.expand, index, '')
    })
    this.$set(this.query.closed, 0, '')
  }

  /**
   * 点击搜索时记录参数
   */
  private recordParams(isOpen: boolean) {
    if (isOpen) {
      this.queryArr = this.query.expand
    } else {
      this.queryArr = this.query.closed
    }
  }

  /**
   * 匹配参数
   */
  private equalParams(query: QueryParam) {
    if (this.isOpenFlag) {
      this.query.expand.forEach((item, index) => {
        let filterParams = new FilterParam(this.query.expandProperty[index], item ? item : '')
        query.filters.push(filterParams)
      })
    } else {
      if (this.query.closed[0]) {
        let filterParams = new FilterParam(this.query.closedProperty[0], this.query.closed[0] ? this.query.closed[0] : '')
        query.filters.push(filterParams)
      } else {
        query.filters = []
      }
    }
    return query
  }

  /**
   * 获取页面列表数据
   */
  private getDataList(query: QueryParam) {
    // todo 调用自己的接口 把结果赋值给tableData total赋值给pagenation.total
    console.log(query)
    PaymentApi.query(query).then(resp => {
      if (resp && resp.success) {
        PaymentApi.query(this.setParams()).then(resp => {
          this.tableData = resp.data
          this.pagination.total = resp.total
          this.getSummary()
        })
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }
  /**
   * 获取供应商列表
   */
  private getProviderList() {
    let query = new QueryParam()
    query.start = 0
    query.limit = 0
    SupplierApi.query(query).then(resp => {
      this.providerList = resp.data
    }).catch(error => {
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
  /**
   * 获取汇总
   */
  private getSummary() {
    PaymentApi.summary(this.setParams()).then(resp => {
      if (resp.success) {
        this.getSumAmount = resp.data.paidAmount
      }
    })
  }
}


