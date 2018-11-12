import { Component, Vue } from 'vue-property-decorator'
import QueryParam from 'model/request/QueryParam'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import InventoryListSearch from 'pages/begininginventory/cmp/ListSearch.vue'
import InventoryListTable from 'pages/begininginventory/cmp/ListTable.vue'
import { Dialog, Loading } from 'fant'
import FilterParam from 'model/request/FilterParam'
import ExportDialog from 'cmp/ExportDialog.vue'
import CommonUtil from 'util/CommonUtil'
import JobQueryApi from 'http/excel/JobQueryApi'
import Warehouse from 'model/basicdata/warehouses/Warehouse'
import BeginingInventory from 'model/inventory/begining/BeginingInventory'
import InventoryBeginingApi from 'http/inventory/begining/InventoryBeginingApi'
import Add from 'pages/begininginventory/cmp/Add.vue'
import ExcelImport from 'cmp/ExcelImport.vue'
import ExcelApi from 'http/excel/ExcelApi'
import User from 'model/framework/user/User'
import { State } from 'vuex-class'
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
    InventoryListTable,
    Add
  }
})
export default class InventoryList extends Vue {
  @State('user') user: User
  // 面包屑菜单
  menu = [{
    name: '期初库存',
    url: '/openingInventoryList'
  }]
  query: QueryParam = new QueryParam()
  // 分页插件数据对象
  pagination = new InventoryPagination()
  // 表单数据
  tableData: BeginingInventory[] = []
  warehouse: Warehouse = new Warehouse()
  // 已选择数据
  selectedData: BeginingInventory[] = []
  successNumber: number = 0
  faultNumber: number = 0
  importTemplate: string
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  beforeMount() {
    ExcelApi.listTemplate('inventoryBegining').then((res) => {
      if (res && res.success) {
        this.importTemplate = res.data![0]!
      }
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  /**
   * 挂载
   */
  mounted() {
    // this.doSearch()
    console.log('期初库存')
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
    InventoryBeginingApi.query(this.query).then((res) => {
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

  doGoCreate() {
    new Dialog(Add, {
      warehouse: this.warehouse,
      user: this.user,
      data: [],
      onConfirm: () => {
        this.pagination.start = 1
        let filters: FilterParam[] = []
        if (this.warehouse) {
          filters.push(new FilterParam('warehouse:=', this.warehouse.id))
        }
        this.doSearch()
      }
    }).show()
  }

  doSelectData(val: BeginingInventory[]) {
    this.selectedData = val
  }

  /**
   *  导入期初库存
   */
  doImport() {
    new Dialog(ExcelImport, {
      title: '导入期初库存',
      doUpload: (files: any) => {
        return ExcelApi.upload(files)
      },
      doImport: (uuid: string) => {
        return ExcelApi.importInventoryBegining(uuid)
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
      title: '导出期初库存列表',
      onConfirm: this.doSearch,
      onExport: () => {
        return InventoryBeginingApi.export(query)
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

  /**
   * 批量删除
   */
  batchRemove() {
    this.successNumber = this.faultNumber = 0
    let data: string[] = []
    this.selectedData.forEach((item) => {
      data.push(item.id!)
    })
    this.$msgBox.confirm('批量删除', '请确认选择的单据是否要进行删除操作？', () => {
      this.doRemove(data)
    })
  }


  doRemove(data: string[]) {
    InventoryBeginingApi.batchDelete(data).then((resp) => {
      console.log(resp.data)
      this.$msgBox.confirm('删除结果', `只有能编辑的期初库存才能进行删除操作<br/>成功${resp.data.successCount}条<br/>失败${resp.data.failCount}条`, () => {
        this.doSearch()
      })
    })
  }


}
