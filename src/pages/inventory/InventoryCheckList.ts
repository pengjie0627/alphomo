import { Component, Vue } from 'vue-property-decorator'
import QueryParam from 'model/request/QueryParam'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import InventoryListSearch from 'pages/inventory/cmp/InventoryCheckSearch.vue'
import InventoryListTable from 'pages/inventory/cmp/InventoryCheckListTable.vue'
import { Dialog, Loading } from 'fant'
import CommonUtil from 'util/CommonUtil'
import ExportDialog from 'cmp/ExportDialog.vue'
import CheckInventoryApi from 'http/inventory/check/CheckInventoryApi'
import CheckInventory from 'model/inventory/check/CheckInventory'
import ExcelImport from 'cmp/ExcelImport.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import ExcelApi from 'http/excel/ExcelApi'
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
    InventoryListSearch,
    InventoryListTable,
    PrintView
  }
})
export default class InventoryCheckList extends Vue {
  // 面包屑菜单
  menu = [ {
    name: '库存盘点',
    url: '/inventoryCheckList'
  }]
  query: QueryParam = new QueryParam()
  // 分页插件数据对象
  pagination = new InventoryPagination()
  // 列表数据
  tableData: CheckInventory[] = []
  // 已选择数据
  selectedData: CheckInventory[] = []
  successNumber: number = 0
  faultNumber: number = 0
  importTemplate: string
  id: string[] = []
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  beforeMount() {
    ExcelApi.listTemplate('inventoryCheck').then((res) => {
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
   * 查询条件变化
   * @param val
   */
  doGetFilter(val: any) {
    this.pagination.start = 1
    this.query.filters = val
    this.doSearch()
  }

  doSelectData(val: CheckInventory[]) {
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
    CheckInventoryApi.query(this.query).then((resp) => {
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
   * 批量审核
   */
  batchAudit() {
    this.successNumber = this.faultNumber = 0
    this.$msgBox.confirm('批量审核', '请确认选择的单据是否要进行审核操作？', () => {
      this.doAudit(this.selectedData.length, this.selectedData, this.selectedData.length)
    })
  }

  /**
   * 递归审核
   * @param {number} count
   * @param {any[]} arr
   * @param {number} total
   */
  doAudit(count: number, arr: any[], total: number) {
    if (count === 0) {
      return
    }
    CheckInventoryApi.audit(arr[count - 1].id, arr[count - 1].version).then((resp) => {
      if (resp && resp.success) {
        this.successNumber++
        if (this.faultNumber + this.successNumber === total) {
          if (this.faultNumber > 0) {
            this.$msgBox.confirm('审核结果', `只有草稿状态的单据才能进行审核操作！<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
              this.doSearch()
            })
          } else {
            this.$msgBox.confirm('审核结果', `成功${this.successNumber}条,失败${this.faultNumber}条`, () => {
              this.doSearch()
            })
          }
        }
        this.doAudit(count - 1, arr, total)
      }
    }).catch(() => {
      this.faultNumber++
      if (this.faultNumber + this.successNumber === total) {
        this.$msgBox.confirm('审核结果', `只有草稿状态的单据才能进行审核操作<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
          this.doSearch()
        })
      }
      this.doAudit(count - 1, arr, total)
    })
  }

  /**
   * 批量删除
   */
  batchRemove() {
    this.successNumber = this.faultNumber = 0
    this.$msgBox.confirm('批量删除', '请确认选择的单据是否要进行删除操作？', () => {
      this.doRemove(this.selectedData.length, this.selectedData, this.selectedData.length)
    })
  }

  /**
   * 递归删除
   * @param {number} count
   * @param {any[]} arr
   * @param {number} total
   */
  doRemove(count: number, arr: any[], total: number) {
    if (count === 0) {
      return
    }
    CheckInventoryApi.remove(arr[count - 1].id, arr[count - 1].version).then((resp) => {
      if (resp && resp.success) {
        this.successNumber++
        if (this.faultNumber + this.successNumber === total) {
          if (this.faultNumber > 0) {
            this.$msgBox.confirm('删除结果', `只有草稿状态的单据才能进行删除操作！<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
              this.doSearch()
            })
          } else {
            this.$msgBox.confirm('删除结果', `成功${this.successNumber}条,失败${this.faultNumber}条`, () => {
              this.doSearch()
            })
          }
        }
        this.doRemove(count - 1, arr, total)
      }
    }).catch(() => {
      this.faultNumber++
      if (this.faultNumber + this.successNumber === total) {
        this.$msgBox.confirm('删除结果', `只有草稿状态的单据才能进行删除操作<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
          this.doSearch()
        })
      }
      this.doRemove(count - 1, arr, total)
    })
  }

  /**
   * 打印
   */
  doPrint() {
    window.print()
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
      title: '导出盘点单',
      onConfirm: this.doSearch,
      onExport: () => {
        return CheckInventoryApi.exportList(query)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    })
    dialog.show()
  }

  /**
   *  导入单据
   */
  doImport() {
    new Dialog(ExcelImport, {
      title: '导入盘点单',
      doUpload: (files: any) => {
        return ExcelApi.upload(files)
      },
      doImport: (uuid: string) => {
        return ExcelApi.importCheckInventory(uuid)
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
   * 新建盘点单
   */
  doCreateBill() {
    this.$router.push('/inventoryCheckEdit')
  }
}
