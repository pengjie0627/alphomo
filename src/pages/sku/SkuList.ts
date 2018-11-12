import { Component, Vue, Watch } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'pages/sku/cmp/SkuContainer.vue'
import ListSearch from 'pages/sku/cmp/SkuSearch.vue'
import ListTable from 'pages/sku/cmp/SkuListTable.vue'
import ExcelImport from 'cmp/ExcelImport.vue'
import QueryParam from 'model/request/QueryParam'
import { Dialog, Loading } from 'fant'
import ConstantMgr from 'mgr/ConstantMgr'
import PermissionMgr from 'mgr/PermissionMgr'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import ExcelApi from 'http/excel/ExcelApi'
import SkuEdit from 'pages/sku/cmp/SkuEdit.vue'
import SkuApi from 'http/basicdata/sku/SkuApi'
import Sku from 'model/basicdata/sku/Sku'
import SkuCategoryTree from 'pages/sku/cmp/SkuCategoryTree.vue'
import SkuCategory from 'model/basicdata/sku/SkuCategory'
import SkuCategoryApi from 'http/basicdata/sku/SkuCategoryApi'

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
    SkuEdit,
    SkuCategoryTree
  }
})
export default class SkuList extends Vue {
  // 面包屑菜单
  menu = [{
    name: '商品',
    url: '/skuList'
  }]
  // 表格数据
  tableData: Sku[] = []
  // 已选对象
  selectedData: Sku[] = []
  // 分页插件数据对象
  pagination = new Pagination()
  // 表单查询数据对象
  query: QueryParam = new QueryParam()
  // 界面长度限制
  limits = ConstantMgr.limits.sku
  skuCategory: SkuCategory = new SkuCategory()

  // 权限
  hasPermissions: Function = PermissionMgr.hasOptionPermission
  // 导入模板
  importTemplate: string

  $refs: {
    categoryTree: any
  }

  @Watch('$route')
  onRouteChange(to: any, from: any) {
    if (from.name !== 'skuDetail' && from.name !== 'skuList' && to.name === 'skuList') {
      this.doReset()
      this.$refs.categoryTree.getList()
    }
  }

  beforeMount() {
    ExcelApi.listTemplate('sku').then((res) => {
      if (res && res.success) {
        this.importTemplate = res.data![0]!
      }
    }).catch((err) => {
      this.$message.error(err.message)
    })
    SkuCategoryApi.getByMerchant().then((resp) => {
      if (resp.data) {
        this.skuCategory = resp.data[0]
      }
    })
  }

  mounted() {
    this.doSearch()
  }

  doGetCategory(data: SkuCategory) {
    this.skuCategory = data
  }

  doReset() {
    this.query = new QueryParam()
    SkuCategoryApi.getByMerchant().then((resp) => {
      if (resp.data) {
        this.skuCategory = resp.data[0]
      }
    })
  }

  /**
   * 获取列表数据
   */
  doGetList(query: QueryParam) {
    let loading = Loading.show()
    SkuApi.queryAll(query).then((res) => {
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
    this.$router.push('/skuEdit')
    // new Dialog(SkuEdit, {
    //   onConfirm: () => {
    //     this.pagination.start = 1
    //     this.doGetList(this.query)
    //   }
    // }).show()
  }

  /**
   *  导入客户资料
   */
  doImport() {
    new Dialog(ExcelImport, {
      title: '导入商品资料',
      doUpload: (files: any) => {
        return ExcelApi.upload(files)
      },
      doImport: (uuid: string) => {
        return ExcelApi.importSku(uuid)
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
      title: '导出商品资料',
      onExport: () => {
        return SkuApi.exportList(this.query)
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
      ids.push(item.id!)
    })
    // let loading = Loading.show()
    this.$msgBox.confirm('批量删除', '您是否确认删除选中商品？', () => {
      SkuApi.batchDelete(ids).then((resp) => {
        // loading.hide()
        // this.$message.success('删除成功')
        if (resp.data.failCount > 0) {
          this.$msgBox.confirm('删除结果', `只有库存为0且不存在单据的商品才可以删除<br/>成功${resp.data.successCount}条<br/>失败${resp.data.failCount}条`, () => {
            this.doSearch()
          })
        } else {
          this.$msgBox.confirm('删除结果', `成功${resp.data.successCount}条,失败${resp.data.failCount}条`, () => {
            this.doSearch()
          })
        }
      }).catch(error => {
        // loading.hide()
        this.$message.error(error.message)
      })
    })
  }

  /**
   * 表格选择
   * @param arr
   */
  onSelectionChange(arr: Sku[]) {
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

}
