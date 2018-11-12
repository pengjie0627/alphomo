import { Component, Vue } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import ListSearch from 'pages/shop/cmp/ShopSearch.vue'
import ListTable from 'pages/shop/cmp/ShopListTable.vue'
import QueryParam from 'model/request/QueryParam'
import { Dialog, Loading } from 'fant'
import ConstantMgr from 'mgr/ConstantMgr'
import PermissionMgr from 'mgr/PermissionMgr'
import ExcelApi from 'http/excel/ExcelApi'
import Shop from 'model/basicdata/shop/Shop'
import ShopApi from 'http/basicdata/shop/ShopApi'
import ShopEdit from 'pages/shop/cmp/ShopEdit.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import ExportDialog from '../../cmp/ExportDialog'
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
    ShopEdit
  }
})
export default class ShopList extends Vue {
  // 面包屑菜单
  menu = [{
    name: '门店',
    url: '/shopList'
  }]
  // 表格数据
  tableData: Shop[] = []
  // 已选对象
  selectedData: Shop[] = []
  // 分页插件数据对象
  pagination = new Pagination()
  // 表单查询数据对象
  query: QueryParam = new QueryParam()
  // 界面长度限制
  limits = ConstantMgr.limits.shop

  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限
  successNumber: number = 0
  faultNumber: number = 0
  // 导入销售单模板
  importTemplate: string

  type: string = 'shop'

  beforeMount() {
    ExcelApi.listTemplate('shop').then((res) => {
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
    ShopApi.query(query).then((res) => {
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
    new Dialog(ShopEdit, {
      onConfirm: () => {
        this.pagination.start = 1
        this.doGetList(this.query)
      }
    }).show()
  }

  /**
   *  导出全部
   */
  doExport() {
    new Dialog(ExportDialog, {
      title: '导出门店资料',
      onExport: () => {
        return ShopApi.exportList(this.query)
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
    this.$msgBox.confirm('批量删除', '您是否确认删除选中门店？', () => {
      this.doDel(ids)
    })
  }

  doDel(arr: any[]) {
    ShopApi.batchDelete(arr).then((resp) => {
      this.$message.success('批量删除成功')
      this.doSearch()
    }).catch((err) => {
      this.$message.error(err)
    })
  }

  /**
   * 表格选择
   * @param arr
   */
  onSelectionChange(arr: Shop[]) {
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
    ShopApi.getAuthCode().then((resp) => {
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
