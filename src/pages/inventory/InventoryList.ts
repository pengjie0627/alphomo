import { Component, Vue } from 'vue-property-decorator'
import QueryParam from 'model/request/QueryParam'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import InventoryListSearch from 'pages/inventory/cmp/InventoryListSearch.vue'
import InventoryListTable from 'pages/inventory/cmp/InventoryListTable.vue'
import InventoryApi from 'http/inventory/InventoryApi'
import Inventory from 'model/inventory/Inventory'
import { Dialog, Loading } from 'fant'
import FilterParam from 'model/request/FilterParam'
import ExportDialog from 'cmp/ExportDialog.vue'
import CommonUtil from 'util/CommonUtil'
import JobQueryApi from 'http/excel/JobQueryApi'
import Warehouse from 'model/basicdata/warehouses/Warehouse'
import PermissionMgr from 'mgr/PermissionMgr'

class InventoryPagination {
  start: number = 1
  total: number = 0
  limit: number = 10
}

@Component({
  components: {
    PageBody,
    ListContainer,
    InventoryListSearch,
    InventoryListTable
  }
})
export default class InventoryList extends Vue {
  // 面包屑菜单
  menu = [{
    name: '库存查询',
    url: 'inventoryList'
  }]
  query: QueryParam = new QueryParam()
  // 分页插件数据对象
  pagination = new InventoryPagination()
  // 表单数据
  tableData: Inventory[] = []
  warehouse: Warehouse = new Warehouse()
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  /**
   * 挂载
   */
  mounted() {
    this.doSearch()
  }

  /**
   * 查询条件变化
   * @param val
   */
  doGetFilter(val: FilterParam[]) {
    this.pagination.start = 1
    this.query.filters = val
    this.doSearch()
  }

  /**
   * 查询列表
   */
  doSearch() {
    let loading = Loading.show()
    this.query.start = (this.pagination.start - 1) * 10
    this.query.limit = 10
    if (this.query.filters && this.query.filters.length === 0) {
      delete(this.query.filters)
    }
    if (this.query.sorters && this.query.sorters.length === 0) {
      // this.query.sorters = [{ 'property': 'lastModified', 'direction': 'DESC' }]
      delete(this.query.sorters)
    }
    InventoryApi.query(this.query).then((res) => {
      if (res && res.success) {
        this.tableData = res.data
        this.pagination.total = res.total
        loading.hide()
      }
    }).catch(err => {
      this.$message.error(err.message)
      loading.hide()
    })
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
   * 导出操作
   */
  doExport() {
    let query = CommonUtil.copy(this.query)
    if (query.sorters) {
      delete (query.sorters)
    }
    let dialog = new Dialog(ExportDialog, {
      title: '导出库存列表',
      onConfirm: this.doSearch,
      onExport: () => {
        return InventoryApi.export(query)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    })
    dialog.show()
  }

  /**
   * 表格排序条件
   */
  onSortChange(val: any) {
    this.pagination.start = 1
    this.query.sorters = val
    this.doSearch()
  }

  /**
   * 仓库变化
   */
  onChangeWarehouse(val: Warehouse) {
    this.warehouse = val
  }
}
