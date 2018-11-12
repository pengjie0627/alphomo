import { Component, Vue } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import ListSearch from 'pages/warehouse/cmp/WarehouseSearch.vue'
import ListTable from 'pages/warehouse/cmp/WarehouseListTable.vue'
import ExcelImport from 'cmp/ExcelImport.vue'
import SaleApi from 'http/sale/SaleApi'
import QueryParam from 'model/request/QueryParam'
import { Dialog, Loading } from 'fant'
import ConstantMgr from 'mgr/ConstantMgr'
import PermissionMgr from 'mgr/PermissionMgr'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import ExcelApi from 'http/excel/ExcelApi'
import WarehouseEdit from 'pages/warehouse/cmp/WarehouseEdit.vue'
import WarehouseApi from 'http/basicdata/warehouses/WarehouseApi'
import Warehouse from 'model/basicdata/warehouses/Warehouse'

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
    WarehouseEdit
  }
})
export default class WarehouseList extends Vue {
  // 面包屑菜单
  menu = [{
    name: '仓库',
    url: '/warehouseList'
  }]
  // 表格数据
  tableData: Warehouse[] = []
  // 已选对象
  selectedData: Warehouse[] = []
  // 分页插件数据对象
  pagination = new Pagination()
  // 表单查询数据对象
  query: QueryParam = new QueryParam()
  // 界面长度限制
  limits = ConstantMgr.limits.warehouse

  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限
  successNumber: number = 0
  faultNumber: number = 0
  // 导入销售单模板
  importTemplate: string

  beforeMount() {
    ExcelApi.listTemplate('warehouse').then((res) => {
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
    WarehouseApi.queryAll(query).then((res) => {
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
    new Dialog(WarehouseEdit, {
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
      title: '导入仓库资料',
      doUpload: (files: any) => {
        return ExcelApi.upload(files)
      },
      doImport: (uuid: string) => {
        return ExcelApi.importWarehouse(uuid)
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
      title: '导出仓库资料',
      onExport: () => {
        return WarehouseApi.exportList(this.query)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }

  /**
   * 批量删除
   */
  // doDelete() {
  //   let ids: any[] = []
  //   this.selectedData.forEach((item) => {
  //     ids.push({ id: item.id!, version: item.version })
  //   })
  //   this.successNumber = this.faultNumber = 0
  //   this.$msgBox.confirm('批量删除', '您是否确认删除选中供应商？', () => {
  //     this.doDel(ids.length, ids, ids.length)
  //   })
  // }


  /**
   * 递归删除
   * @param {number} count
   * @param {any[]} arr
   * @param {number} total
   */
  doDel(count: number, arr: any[], total: number) {
    if (count === 0) {
      return
    }
    SaleApi.remove(arr[count - 1].id, arr[count - 1].version).then((resp) => {
      if (resp && resp.success) {
        this.successNumber++
        if (this.faultNumber + this.successNumber === total) {
          if (this.faultNumber > 0) {
            this.$msgBox.confirm('删除结果', `只有草稿状态的销售单才允许删除<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
              this.doGetList(this.query)
            })
          } else {
            this.$msgBox.confirm('删除结果', `成功${this.successNumber}条,失败${this.faultNumber}条`, () => {
              this.doGetList(this.query)
            })
          }
        }
        this.doDel(count - 1, arr, total)
      }
    }).catch((err) => {
      this.faultNumber++
      if (this.faultNumber + this.successNumber === total) {
        this.$msgBox.confirm('删除结果', `${err.message}<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
          this.doGetList(this.query)
        })
      }
      this.doDel(count - 1, arr, total)
    })
  }

  /**
   * 表格选择
   * @param arr
   */
  onSelectionChange(arr: Warehouse[]) {
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
