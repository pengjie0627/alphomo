import { Component, Vue } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import ListSearch from 'pages/customer/cmp/CustomerSearch.vue'
import ListTable from 'pages/customer/cmp/CustomerListTable.vue'
import ExcelImport from 'cmp/ExcelImport.vue'
import QueryParam from 'model/request/QueryParam'
import { Dialog, Loading } from 'fant'
import ConstantMgr from 'mgr/ConstantMgr'
import PermissionMgr from 'mgr/PermissionMgr'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import ExcelApi from 'http/excel/ExcelApi'
import Customer from 'model/basicdata/customer/Customer'
import CustomerApi from 'http/basicdata/customer/CustomerApi'
import CustomerEdit from 'pages/customer/cmp/CustomerEdit.vue'
import AuthDialog from 'pages/main/cmp/AuthDialog'

// 分页插件数据对象
class Pagination {
  start: number = 1
  total: number = 0
  limit: number = 10
}

@Component({
  components: {
    PageBody,
    ListContainer,
    ListSearch,
    ListTable,
    ExportDialog,
    CustomerEdit
  }
})
export default class CustomerList extends Vue {
  // 面包屑菜单
  menu = [{
    name: '客户',
    url: '/customerList'
  }]
  // 表格数据
  tableData: Customer[] = []
  // 已选对象
  selectedData: Customer[] = []
  // 分页插件数据对象
  pagination = new Pagination()
  // 表单查询数据对象
  query: QueryParam = new QueryParam()
  // 界面长度限制
  limits = ConstantMgr.limits.customer

  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限
  successNumber: number = 0
  faultNumber: number = 0
  // 导入销售单模板
  importTemplate: string
  type: string = 'customer'

  beforeMount() {
    ExcelApi.listTemplate('customer').then((res) => {
      if (res && res.success) {
        this.importTemplate = res.data![0]!
      }
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  mounted() {
    this.doSearch()
  }

  /**
   * 获取列表数据
   */
  doGetList(query: QueryParam) {
    let loading = Loading.show()
    CustomerApi.queryAll(query).then((res) => {
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

  doReload() {
    this.query.start = 1
    this.pagination.start = 1
    this.doSearch()
  }

  /**
   * 设置查询条件
   */
  doSearch() {
    this.query.start = (this.pagination.start - 1) * 10
    this.query.limit = 10
    if (this.query.filters && this.query.filters.length === 0) {
      delete(this.query.filters)
    }
    if (this.query.sorters && this.query.sorters.length === 0) {
      this.query.sorters = [{ 'property': 'lastModified', 'direction': 'DESC' }]
    }
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
    new Dialog(CustomerEdit, {
      onConfirm: () => {
        this.pagination.start = 1
        this.doGetList(this.query)
      }
    }).show()
  }

  /**
   *  导入客户资料
   */
  doImport() {
    new Dialog(ExcelImport, {
      title: '导入客户资料',
      doUpload: (files: any) => {
        return ExcelApi.upload(files)
      },
      doImport: (uuid: string) => {
        return ExcelApi.importCustomer(uuid)
      },
      doProgress: (uuid: string) => {
        return JobQueryApi.query(uuid)
      },
      onConfirm: () => {
        this.doSearch()
      },
      doStop: (uuid: string) => {
        // todo
      },
      downloadUrl: this.importTemplate
    }).show()
  }

  /**
   *  导出全部
   */
  doExport() {
    new Dialog(ExportDialog, {
      title: '导出客户资料',
      onExport: () => {
        return CustomerApi.exportList(this.query)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }

  /**
   * 批量删除
   */
  doDelete() {
    let ids: any[] = []
    this.selectedData.forEach((item) => {
      ids.push(item.id)
    })
    this.successNumber = this.faultNumber = 0
    this.$msgBox.confirm('批量删除', '您是否确认删除选中客户？', () => {
      this.doDel(ids)
    })
  }

  doDel(arr: any[]) {
    CustomerApi.batchDelete(arr).then((resp) => {
      if (resp && resp.success) {
        if (arr.length !== resp.total) {
          this.successNumber = resp.total
          this.faultNumber = arr.length - resp.total
          this.$msgBox.confirm('删除结果', `只有非直营门店的客户才允许删除<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
            this.doSearch()
          })
        } else {
          this.successNumber = resp.total
          this.faultNumber = arr.length - resp.total
          this.$msgBox.confirm('删除结果', `成功${this.successNumber}条,失败${this.faultNumber}条`, () => {
            this.doSearch()
          })
        }
      }
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  /**
   * 表格选择
   * @param arr
   */
  onSelectionChange(arr: Customer[]) {
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

  onAuth() {
    let payUrl = ''
    let authCode = ''
    CustomerApi.getAuthCode().then((resp) => {
      if (resp.data) {
        let jsonObject = (Object)(resp.data)
        payUrl = JSON.stringify(resp.data)
        authCode = jsonObject.value
        new Dialog(AuthDialog, {
          type: this.type,
          payUrl: payUrl,
          authCode: authCode
        }).show()
      }
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }
}
