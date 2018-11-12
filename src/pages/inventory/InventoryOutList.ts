import { Component, Vue } from 'vue-property-decorator'
import QueryParam from 'model/request/QueryParam'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import InventoryOutSearch from 'pages/inventory/cmp/InventoryOutSearch.vue'
import InventoryOutTable from 'pages/inventory/cmp/InventoryOutTable.vue'
import { Dialog, Loading } from 'fant'
import OutInventoryApi from 'http/inventory/out/OutInventoryApi'
import OutInventory from 'model/inventory/out/OutInventory'
import CommonUtil from 'util/CommonUtil'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import PermissionMgr from 'mgr/PermissionMgr'
import PrintView from 'cmp/print/PrintView.vue'

class InventoryPagination {
  start: number = 1
  total: number = 0
  limit: number = 10
}

@Component({
  components: {
    PageBody,
    ListContainer,
    InventoryOutSearch,
    InventoryOutTable,
    PrintView
  }
})
export default class InventoryOutList extends Vue {
  // 面包屑菜单
  menu = [{
    name: '出库管理',
    url: '/InventoryOutList'
  }]
  query: QueryParam = new QueryParam()
  // 分页插件数据对象
  pagination = new InventoryPagination()
  // 列表数据
  tableData: OutInventory[] = []
  // 已选择数据
  selectedData: OutInventory[] = []
  successNumber: number = 0
  faultNumber: number = 0
  id: string[] = []
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  mounted() {
    this.doSearch()
  }

  /**
   * 查询条件变化
   * @param val
   */
  doGetFilter(val: any) {
    this.pagination.start = 1
    this.query.filters = val
    this.doSearch()
  }

  doSelectData(val: OutInventory[]) {
    this.selectedData = val
    this.id = []
    if (this.selectedData) {
      for (let i = 0; i < this.selectedData.length; i++) {
        this.id[i] = this.selectedData[i].id!
      }
    }
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
      this.query.sorters = [{ 'property': 'lastModified', 'direction': 'DESC' }]
    }
    OutInventoryApi.query(this.query).then((resp) => {
      this.tableData = resp.data
      this.pagination.total = resp.total
      loading.hide()
    }).catch((err) => {
      loading.hide()
      this.$message.error(err.message)
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
   * 表格排序条件
   */
  onSortChange(val: any) {
    this.pagination.start = 1
    this.query.sorters = val
    this.doSearch()
  }

  /**
   * 批量出库
   */
  batchAudit() {
    this.successNumber = this.faultNumber = 0
    this.$msgBox.confirm('批量出库', '请确认选择的单据是否要进行出库操作？', () => {
      this.doAudit(this.selectedData.length, this.selectedData, this.selectedData.length)
    })
  }

  /**
   * 递归删除
   * @param {number} count
   * @param {any[]} arr
   * @param {number} total
   */
  doAudit(count: number, arr: any[], total: number) {
    if (count === 0) {
      return
    }
    OutInventoryApi.audit(arr[count - 1]).then((resp) => {
      if (resp && resp.success) {
        this.successNumber++
        if (this.faultNumber + this.successNumber === total) {
          if (this.faultNumber > 0) {
            this.$msgBox.confirm('出库结果', `只有未出库的单据才能进行出库操作！<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
              this.doSearch()
            })
          } else {
            this.$msgBox.confirm('出库结果', `成功${this.successNumber}条,失败${this.faultNumber}条`, () => {
              this.doSearch()
            })
          }
        }
        this.doAudit(count - 1, arr, total)
      }
    }).catch(() => {
      this.faultNumber++
      if (this.faultNumber + this.successNumber === total) {
        this.$msgBox.confirm('删除结果', `只有未出库的单据才能进行出库操作<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
          this.doSearch()
        })
      }
      this.doAudit(count - 1, arr, total)
    })
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
      title: '导出出库单',
      onConfirm: this.doSearch,
      onExport: () => {
        return OutInventoryApi.export(query)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    })
    dialog.show()
  }
}
