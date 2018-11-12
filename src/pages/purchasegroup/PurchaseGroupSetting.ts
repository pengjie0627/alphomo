import { Component, Vue } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import PurchaseGroupListTable from 'pages/purchasegroup/cmp/PurchaseGroupListTable.vue'
import QueryParam from 'model/request/QueryParam'
import { Dialog, Loading } from 'fant'
import ExportDialog from 'cmp/ExportDialog.vue'
// import ExcelApi from 'http/excel/ExcelApi'
import PrintView from 'cmp/print/PrintView.vue'
import Dictionary from 'model/basicdata/dictionary/Dictionary'
import DictionaryApi from 'http/basicdata/dictionary/DictionaryApi'
import FilterParam from 'model/request/FilterParam'
import ExcelImport from '../../cmp/ExcelImport'
import ExcelApi from 'http/excel/ExcelApi'
import JobQueryApi from 'http/excel/JobQueryApi'

// 分页插件数据对象
class PurchaseGroupPagination {
  start: number = 1
  total: number = 0
  limit: number = 10
}

@Component({
  components: {
    PageBody,
    ListContainer,
    PurchaseGroupListTable,
    ExportDialog,
    PrintView
  }
})
export default class PurchaseGroupSetting extends Vue {
  // 面包屑菜单
  menu = [{
    name: '采购组设置',
    url: '/purchaseGroupSetting'
  }]
  // 表格数据
  tableData: Dictionary[] = []
  // 已选对象
  selectedData: Dictionary[] = []
  // 分页插件数据对象
  pagination = new PurchaseGroupPagination()
  // 表单查询数据对象
  query: QueryParam = new QueryParam()
  // // 界面长度限制
  // limits = ConstantMgr.limits.sale
  // ID列表
  ids: string[] = []
  successNumber: number = 0
  faultNumber: number = 0
  id: string[] = []
  // 导入模板
  importTemplate: string

  beforeMount() {
    ExcelApi.listTemplate('purchaseGroup').then((res) => {
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
   * 获取商品列表数据
   */
  doGetPurchaseGroupList(query: QueryParam) {
    let loading = Loading.show()
    DictionaryApi.query(query).then((res) => {
      if (res && res.success) {
        this.pagination.total = res.total
        this.tableData = res.data
        this.ids = []
        this.tableData.forEach(item => {
          this.ids.push(item.id!)
        })
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
    this.query.filters.push(new FilterParam('type:=','purchaseGroup'))
    this.doGetPurchaseGroupList(this.query)
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
   *  导入采购组
   */
  doImport() {
    new Dialog(ExcelImport, {
      title: '导入采购组',
      doUpload: (files: any) => {
        return ExcelApi.upload(files)
      },
      doImport: (uuid: string) => {
        return ExcelApi.importPurchaseGroup(uuid)
      },
      doProgress: (uuid: string) => {
        return JobQueryApi.query(uuid)
      },
      doStop: (uuid: string) => {
        // todo
      },
      onConfirm: this.doSearch,
      downloadUrl: this.importTemplate
    }).show()
  }

  /**
   *  导出全部
   */
  doExport() {
    new Dialog(ExportDialog, {
      title: '导出采购组',
      onExport: () => {
        return DictionaryApi.exportPurchaseGroup(this.query)
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
    this.$msgBox.confirm('批量删除', '您是否确认删除选中采购组？', () => {
      this.doDel(ids)
    })
  }

  /**
   * 批量删除
   * @param {any[]} arr
   */
  doDel(arr: any[]) {
    DictionaryApi.batchDelete(arr).then((resp) => {
      this.$message.success('批量删除成功')
      // 删除后返回第一页
      this.pagination.start = 1
      this.doSearch()
    }).catch((err) => {
      this.$message.error(err)
    })
  }


  /**
   * 表格选择
   * @param arr
   */
  onSelectionChange(arr: Dictionary[]) {
    this.selectedData = arr
  }
}
