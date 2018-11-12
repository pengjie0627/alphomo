import { Vue, Component, Watch } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import QueryCondition from 'cmp/QueryCondition.vue'
import QueryParam from 'model/request/QueryParam'
import FilterParam from 'model/request/FilterParam'
import AccountBillListTable from 'pages/account/cmp/AccountBillListTable.vue'
import SupplierStatementApi from 'http/supplierstatement/SupplierStatementApi'
import ExcelImport from 'cmp/ExcelImport.vue'
import ExcelApi from 'http/excel/ExcelApi'
import JobQueryApi from 'http/excel/JobQueryApi'
import { Dialog } from 'fant'
import ExportDialog from 'cmp/ExportDialog.vue'
import PrintView from 'cmp/print/PrintView.vue'
import SupplierApi from 'http/basicdata/supplier/SupplierApi'
import UserApi from 'http/framework/user/UserApi'
import PermissionMgr from 'mgr/PermissionMgr'
@Component({
  name: 'AccountBillList',
  components: {
    AccountBillListTable,
    PageBody,
    ListContainer,
    QueryCondition,
    PrintView
  }
})
export default class AccountBillList extends Vue {
  // 打印的id
  id: any[] = []
  // 排序数组
  sort: any[] = []
  // 临时数组（使用临时数组的原因是需要记录点击搜索后的参数，而不是用户改变的搜索条件没有点击搜索的参数值）
  queryArr: any[] = []
  // 展开或者收起标识（产品要求，展开后要清除收起时的搜索条件，反之亦然）
  isOpenFlag = false
  // 打印标识
  printFlag = false
  // 面包屑导航
  menu = [
    {
      name: '',
      url: ''
    }
  ]
  providerList: any[] = []
  getSumAmount = 0
  manageList: any[] = []
  // 定义查询条件(这里定义查询条件而不是用ts文件中的model,一是因为大多数后端还没有生成model,前端无法使用。当然还有其它考虑)
  query = {
    closed: [''],// 收起状态 todo 第一步要修改的，这里需要修改成对应的参数个数
    closedProperty: ['keyword:%=%'], // todo 第一步要修改的，这里需要修改成对应的参数名称
    expand: ['', '', '', '', '', '','',''], // 展开状态 todo 第一步要修改的，这里需要修改成对应的参数个数
    expandProperty: [
      'billNum:%=%',
      'businessDate:[,]',
      'managerName:%=%',
      'supplierName:%=%',
      'status:=',
      'isInvoice:= ',
      'payStatus:=',
      'businessBillNum:%=%'
    ] // todo 第一步要修改的，这里需要修改成对应的参数名称
  }
  // 分页
  pagination = {
    total: 0,
    limit: 10,
    start: 1
  }
  // 要传递给子组件table的数据
  tableData: any[] = []
  selectId: any[] = []
  open = false
  // refs定义
  $refs: {
    fuzzy: any,
    search: any
  }
  hasPermissions: Function = PermissionMgr.hasOptionPermission
  downloadUrl: string = ''
  @Watch('$route')
  onRouteChange(to: any, from: any) {
    if (from.name !== 'accountBillDtl' && from.name !== 'accountBillList' && to.name === 'accountBillList') {
      this.reset()
      this.$refs.search.doToggle()
    } else {
      if (from.name === 'accountBillDtl') {
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
    this.menu[0].name = '结算单'
    this.menu[0].url = this.$route.path
    // 自动获取焦点
    this.$refs.fuzzy.focus()
    // 获取列表数据
    this.getDataList(this.setParams())
    this.getManageList()
    this.getProviderList()
    this.getExcelTpl()
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
      title: '导出结算单',
      onExport: () => {
        return SupplierStatementApi.exportSupplierStatementList(this.setParams())
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
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
    this.printFlag = false
  }

  /**
   * 新建付款单
   */
  onAddPay() {
    let ids: any[] = []
    if (this.tableData && this.tableData.length > 0) {
      this.tableData.forEach((item: any) => {
        ids.push(item.id)
      })
    }
    this.$router.push({ name: 'accountBillAdd', query: {
      type: 'add',
      uuid : '',
      ids: JSON.stringify(ids),
      queryParams: JSON.stringify(this.setParams())
    } })
  }

  /**
   * 导入付款单
   */
  onImportPay() {
    new Dialog(ExcelImport, {
      title: '结算单导入',
      doUpload: (files: any) => {
        return ExcelApi.upload(files)
      },
      doImport: (uuid: string) => {
        return ExcelApi.importSupplierStatement(uuid)
      },
      doProgress: (uuid: string) => {
        return JobQueryApi.query(uuid)
      },
      doStop: (uuid: string) => {
        // todo
      },
      onConfirm: () => {
        this.getDataList(this.setParams())
      },
      downloadUrl: this.downloadUrl
    }).show()
  }
  doEnterSearch() {
    this.search(this.isOpenFlag)
  }
  private getExcelTpl() {
    ExcelApi.listTemplate('supplierStatement').then((res) => {
      if (res && res.success) {
        this.downloadUrl = res.data![0]!
      }
    }).catch((err) => {
      this.$message.error(err.message)
    })
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
    this.$set(this.query.closed, 0 , '')
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
    SupplierStatementApi.query(query).then(resp => {
      if (resp.data && resp.success) {
        // todo
        this.getSummary()
        this.tableData = resp.data
        this.pagination.total = resp.total
        resp.data.forEach(item => {
          this.id.push(item.id)
        })
      } else {
        this.tableData = []
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
    SupplierStatementApi.summary(this.setParams()).then(resp => {
      if (resp.success) {
        this.getSumAmount = resp.data.settleAmount
      }
    })
  }
}


