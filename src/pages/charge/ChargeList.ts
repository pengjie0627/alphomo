import { Vue, Component, Watch } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import QueryCondition from 'cmp/QueryCondition.vue'
import QueryParam from 'model/request/QueryParam'
import FilterParam from 'model/request/FilterParam'
import ChargeListTable from 'pages/charge/cmp/ChargeListTable.vue'
import ChargeApi from 'http/charge/ChargeApi'
import Charge from 'model/charge/Charge'
import { Dialog, Loading } from 'fant'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import PrintView from 'cmp/print/PrintView.vue'
import PermissionMgr from 'mgr/PermissionMgr'
import ExcelImport from 'cmp/ExcelImport.vue'
import ExcelApi from 'http/excel/ExcelApi'
import Ucn from 'model/entity/Ucn'
import UserApi from 'http/framework/user/UserApi'
import SortParam from 'model/request/SortParam'

@Component({
  name: 'ChangeList',
  components: {
    PageBody,
    ListContainer,
    QueryCondition,
    ChargeListTable,
    PrintView
  }
})
export default class ChangeList extends Vue {
  // 权限
  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限
  // 排序数组
  sort: any[] = []
  // 临时数组（使用临时数组的原因是需要记录点击搜索后的参数，而不是用户改变的搜索条件没有点击搜索的参数值）
  queryArr: any[] = []
  // 展开或者收起标识（产品要求，展开后要清除收起时的搜索条件，反之亦然）
  isOpenFlag = false
  // 打印标识
  printFlag = false
  // 合计金额
  billAmount: number = 0
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
    expandProperty: ['billNum:%=%', 'businessDate:[,]', 'managerName:%=%', 'payStatus:=', 'status:=', 'category:=', 'remark:%=%'] // todo 第一步要修改的，这里需要修改成对应的参数名称
  }
  // 分页
  pagination = {
    total: 0,
    limit: 10,
    start: 1
  }
  // 要传递给子组件table的数据
  tableData: Charge[] = []
  managerList: Ucn[] = [] // 经办人列表
  id: any[] = []
  // 导入销售单模板
  importTemplate: string
  // refs定义
  $refs: {
    fuzzy: any,
    search: any
  }

  @Watch('$route')
  onRouteChange(to: any, from: any) {
    if (from.name !== 'chargeDetail' && from.name !== 'chargeList' && to.name === 'chargeList') {
      this.reset()
      this.$refs.search.doToggle()
    } else {
      if (from.name === 'chargeDetail') {
        this.getDataList(this.setParams())
        this.getTotalAmount(this.setParams())
      }
    }
  }

  beforeMount() {
    ExcelApi.listTemplate('charge').then((res) => {
      if (res && res.success) {
        this.importTemplate = res.data![0]!
      }
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  /**
   * 挂载之后
   */
  mounted() {
    // 自动识别name和url
    this.menu[0].name = '费用单'
    this.menu[0].url = this.$route.path
    // 自动获取焦点
    this.$refs.fuzzy.focus()
    // 获取 经办人列表
    this.getManangerList()
    // 获取列表数据
    let sortParam = new SortParam()
    sortParam.property = 'lastModified'
    sortParam.direction = 'desc'
    this.sort.push(sortParam)
    this.getDataList(this.setParams())
    this.getTotalAmount(this.setParams())
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
    this.getTotalAmount(this.setParams())
  }

  /**
   * 点击重置触发
   */
  reset() {
    this.resetSearchParams()
    this.queryArr = []
    this.pagination.start = 1
    this.getDataList(this.setParams())
    this.getTotalAmount(this.setParams())
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
    // this.pagination.start = 1
    this.getDataList(this.setParams())
    this.getTotalAmount(this.setParams())
  }
  /**
   * 点击排序后父级接受的事件
   */
  onRefreshListBySort(sort: any[]) {
    this.pagination.start = 1
    if (sort && sort.length > 0) {
      this.sort = sort
    } else {
      let sortParam = new SortParam()
      sortParam.property = 'lastModified'
      sortParam.direction = 'desc'
      this.sort = [sortParam]
    }
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
    let query = new QueryParam()
    query.limit = 0
    query.start = 0
    if (this.tableData.length === 0) {
      query = this.setParams()
    }
    // todo 第二步调用导出全部的接口
    new Dialog(ExportDialog, {
      title: '导出费用单',
      onExport: () => {
        return ChargeApi.exportChargeList(query)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }

  /**
   *  导入销售单
   */
  doImport() {
    new Dialog(ExcelImport, {
      title: '导入费用单',
      doUpload: (files: any) => {
        return ExcelApi.upload(files)
      },
      doImport: (uuid: string) => {
        return ExcelApi.importCharge(uuid)
      },
      doProgress: (uuid: string) => {
        return JobQueryApi.query(uuid)
      },
      doStop: (uuid: string) => {
        // todo
      },
      onConfirm: () => {
        this.getDataList(this.setParams())
        this.getTotalAmount(this.setParams())
      },
      downloadUrl: this.importTemplate
    }).show()
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
    this.id.length = 0
    list.forEach(item => {
      this.id.push(item.id)
    })
  }
  doEnterSearch() {
    this.search(this.isOpenFlag)
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
    this.$router.push({
      name: 'chargeAdd',
      query: { type: 'add', id: '' },
      params: { ids: JSON.stringify(ids), query: JSON.stringify(this.setParams()) }
    })
  }

  /**
   * 获取参数
   */
  get getQueryParams() {
    return this.setParams()
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
    let loading = Loading.show()
    ChargeApi.query(query).then(resp => {
      if (resp && resp.success) {
        // todo
        this.pagination.total = resp.total
        this.tableData = resp.data
        loading.hide()
      }
    }).catch(error => {
      this.$message.error(error.message)
      loading.hide()
    })
  }

  private getTotalAmount(query: QueryParam) {
    ChargeApi.summary(this.setParams()).then(resp => {
      if (resp && resp.success) {
        this.billAmount = resp.data!.totalAmount
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  getManangerList() {
    let loading = Loading.show()
    UserApi.query(new QueryParam()).then((resp) => {
      loading.hide()
      if (resp.data) {
        let ary: Ucn[] = []
        for (let user of resp.data) {
          let u = new Ucn()
          u.id = user.id
          u.name = user.name
          u.code = user.id
          ary.push(u)
        }
        this.managerList = ary
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
    })
  }
}
