import { Component, Vue } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import PurchaseListSearch from 'pages/purchase/cmp/PurchaseListSearch.vue'
import PurchaseListTable from 'pages/purchase/cmp/PurchaseListTable.vue'
import ExcelImport from 'cmp/ExcelImport.vue'
import PurchaseApi from 'http/purchase/PurchaseApi'
import QueryParam from 'model/request/QueryParam'
import Purchase from 'model/purchase/Purchase'
import { Dialog, Loading } from 'fant'
import ConstantMgr from 'mgr/ConstantMgr'
import SortParam from 'model/request/SortParam'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import ExcelApi from 'http/excel/ExcelApi'
import PermissionMgr from 'mgr/PermissionMgr'


// 分页插件数据对象
class PurchasePagination {
  start: number = 1
  total: number = 0
  limit: number = 10
}

@Component({
  components: {
    PageBody,
    ListContainer,
    PurchaseListSearch,
    PurchaseListTable,
    ExportDialog
  }
})
export default class PurchaseList extends Vue {
  // 面包屑菜单
  menu = [{
    name: '进货单',
    url: '/purchaseList'
  }]
  // 表格数据
  tableData: Purchase[] = []
  // 已选对象
  selectedData: Purchase[] = []
  // 分页插件数据对象
  pagination = new PurchasePagination()
  // 表单查询数据对象
  query: QueryParam = new QueryParam()
  // 界面长度限制
  limits = ConstantMgr.limits.purchase
  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限
  // 商品ID列表
  ids: string[] = []
  successNumber: number = 0
  faultNumber: number = 0
  //
  defaultSort: any = new Array()
  // 导入模板
  importTemplate: string

  beforeMount() {
    ExcelApi.listTemplate('purchase').then((res) => {
      if (res && res.success) {
        this.importTemplate = res.data![0]!
      }
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  mounted() {
    let sortParam = new SortParam()
    sortParam.property = 'lastModified'
    sortParam.direction = 'desc'
    this.defaultSort.push(sortParam)
    this.query.sorters = this.defaultSort
    this.doSearch()
  }

  /**
   * 获取商品列表数据
   */
  doGetPurchaseList(query: QueryParam) {
    let loading = Loading.show()
    PurchaseApi.query(query).then((res) => {
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
    this.doGetPurchaseList(this.query)
  }

  /**
   * 批量删除
   */
  doDelete() {
    let ids: any[] = []
    this.selectedData.forEach((item) => {
      ids.push({ id: item.id!, version: item.version })
    })
    this.successNumber = this.faultNumber = 0
    this.$msgBox.confirm('批量删除', '您是否确认删除选中进货单？', () => {
      this.doDel(ids.length, ids, ids.length)
    })
  }

  doAudit() {
    let ids: any[] = []
    this.selectedData.forEach((item) => {
      ids.push({ id: item.id!, version: item.version })
    })
    this.successNumber = this.faultNumber = 0
    this.$msgBox.confirm('批量审核', '您是否对选中的进货单进行审核？', () => {
      this.doAud(ids.length, ids, ids.length)
    })
  }

  doAbolish() {
    let ids: any[] = []
    this.selectedData.forEach((item) => {
      ids.push({ id: item.id!, version: item.version })
    })
    this.successNumber = this.faultNumber = 0
    this.$msgBox.confirm('批量作废', '您是否对选中的进货单进行作废？', () => {
      this.doAbo(ids.length, ids, ids.length)
    })
  }

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
    PurchaseApi.remove(arr[count - 1].id, arr[count - 1].version).then((resp) => {
      if (resp && resp.success) {
        this.successNumber++
        if (this.faultNumber + this.successNumber === total) {
          if (this.faultNumber > 0) {
            this.$msgBox.confirm('删除结果', `只有草稿状态的进货单才允许删除<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
              this.doGetPurchaseList(this.query)
            })
          } else {
            this.$msgBox.confirm('删除结果', `成功${this.successNumber}条,失败${this.faultNumber}条`, () => {
              this.doGetPurchaseList(this.query)
            })
          }
        }
        this.doDel(count - 1, arr, total)
      }
    }).catch((err) => {
      this.faultNumber++
      if (this.faultNumber + this.successNumber === total) {
        this.$msgBox.confirm('删除结果', `${err.message}<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
          this.doGetPurchaseList(this.query)
        })
      }
      this.doDel(count - 1, arr, total)
    })
  }

  doAud(count: number, arr: any[], total: number) {
    if (count === 0) {
      return
    }
    PurchaseApi.audit(arr[count - 1].id, arr[count - 1].version).then((resp) => {
      if (resp && resp.success) {
        this.successNumber++
        if (this.faultNumber + this.successNumber === total) {
          if (this.faultNumber > 0) {
            this.$msgBox.confirm('审核结果', `只有草稿状态的进货单才允许审核<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
              this.doGetPurchaseList(this.query)
            })
          } else {
            this.$msgBox.confirm('审核结果', `成功${this.successNumber}条,失败${this.faultNumber}条`, () => {
              this.doGetPurchaseList(this.query)
            })
          }
        }
        this.doAud(count - 1, arr, total)
      }
    }).catch((err) => {
      this.faultNumber++
      if (this.faultNumber + this.successNumber === total) {
        this.$msgBox.confirm('审核结果', `${err.message}<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
          this.doGetPurchaseList(this.query)
        })
      }
      this.doAud(count - 1, arr, total)
    })
  }

  doAbo(count: number, arr: any[], total: number) {
    if (count === 0) {
      return
    }
    PurchaseApi.abolish(arr[count - 1].id, arr[count - 1].version).then((resp) => {
      if (resp && resp.success) {
        this.successNumber++
        if (this.faultNumber + this.successNumber === total) {
          if (this.faultNumber > 0) {
            this.$msgBox.confirm('作废结果', `成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
              this.doGetPurchaseList(this.query)
            })
          } else {
            this.$msgBox.confirm('作废结果', `成功${this.successNumber}条,失败${this.faultNumber}条`, () => {
              this.doGetPurchaseList(this.query)
            })
          }
        }
        this.doAbo(count - 1, arr, total)
      }
    }).catch((err) => {
      this.faultNumber++
      if (this.faultNumber + this.successNumber === total) {
        this.$msgBox.confirm('作废结果', `${err.message}<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
          this.doGetPurchaseList(this.query)
        })
      }
      this.doAbo(count - 1, arr, total)
    })
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
    this.$router.push('/purchaseEdit')
  }

  /**
   *  导入进货单
   */
  doImport() {
    new Dialog(ExcelImport, {
      title: '进货单导入',
      doUpload: (files: any) => {
        return ExcelApi.upload(files)
      },
      doImport: (uuid: string) => {
        return ExcelApi.purchaseBeginImport(uuid)
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
      title: '导出进货单',
      onExport: () => {
        return PurchaseApi.exportPurchaseList(this.query)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }

  /**
   * 表格选择
   * @param arr
   */
  onSelectionChange(arr: Purchase[]) {
    this.selectedData = arr
  }


  /**
   * 表格排序条件
   */
  onSortChange(val: any) {
    this.query.start = 1
    if (val && val.length > 0) {
      this.query.sorters = val
    } else {
      this.query.sorters = this.defaultSort
    }
    this.pagination.start = 1
    this.doSearch()
  }

}
