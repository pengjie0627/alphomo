import { Component, Vue } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import PurchaseReturnListSearch from 'pages/purchasereturn/cmp/PurchaseReturnListSearch.vue'
import ExportDialog from 'cmp/ExportDialog.vue'
import PurchaseReturn from 'model/purchasereturn/PurchaseReturn'
import QueryParam from 'model/request/QueryParam'
import ConstantMgr from 'mgr/ConstantMgr'
import SortParam from 'model/request/SortParam'
import { Dialog, Loading } from 'fant'
import PurchaseReturnApi from 'http/purchasereturn/PurchaseReturnApi'
import JobQueryApi from 'http/excel/JobQueryApi'
import ExcelApi from 'http/excel/ExcelApi'
import ExcelImport from 'cmp/ExcelImport.vue'
import PurchaseReturnListTable from 'pages/purchasereturn/cmp/PurchaseReturnListTable'
import PermissionMgr from 'mgr/PermissionMgr'

// 分页插件数据对象
class PurchaseReturnPagination {
  start: number = 1
  total: number = 0
  limit: number = 10
}


@Component({
  components: {
    PageBody,
    ListContainer,
    PurchaseReturnListSearch,
    PurchaseReturnListTable,
    ExportDialog
  }
})

export default class PurchaseReturnList extends Vue {
  // 面包屑菜单
  menu = [{
    name: '进货退货单',
    url: '/purchaseReturnList'
  }]
  // 表格数据
  tableData: PurchaseReturn[] = []
  // 已选对象
  selectedData: PurchaseReturn[] = []
  // 分页插件数据对象
  pagination = new PurchaseReturnPagination()
  // 表单查询数据对象
  query: QueryParam = new QueryParam()
  // 界面长度限制
  limits = ConstantMgr.limits.purchaseReturn
  // ID列表
  ids: string[] = []
  // 权限
  hasPermissions = PermissionMgr.hasOptionPermission
  successNumber: number = 0
  faultNumber: number = 0
  //
  defaultSort: any = new Array()
  // 导入模板
  importTemplate: string

  beforeMount() {
    ExcelApi.listTemplate('purchaseReturn').then((res) => {
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
   * 设置查询条件
   */
  doSearch() {
    this.query.start = (this.pagination.start - 1) * 10
    this.query.limit = 10
    this.doGetPurchaseReturnList(this.query)
  }


  /**
   * 获取列表数据
   */
  doGetPurchaseReturnList(query: QueryParam) {
    let loading = Loading.show()
    PurchaseReturnApi.query(query).then((res) => {
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
   * 批量删除
   */
  doDelete() {
    let ids: any[] = []
    this.selectedData.forEach((item) => {
      ids.push({ id: item.id!, version: item.version })
    })
    this.successNumber = this.faultNumber = 0
    this.$msgBox.confirm('批量删除', '您是否确认删除选中退货单？', () => {
      this.doDel(ids.length, ids, ids.length)
    })
  }

  doAudit() {
    let ids: any[] = []
    this.selectedData.forEach((item) => {
      ids.push({ id: item.id!, version: item.version })
    })
    this.successNumber = this.faultNumber = 0
    this.$msgBox.confirm('批量审核', '您是否对选中的退货单进行审核？', () => {
      this.doAud(ids.length, ids, ids.length)
    })
  }

  doAbolish() {
    let ids: any[] = []
    this.selectedData.forEach((item) => {
      ids.push({ id: item.id!, version: item.version })
    })
    this.successNumber = this.faultNumber = 0
    this.$msgBox.confirm('批量作废', '您是否对选中的退货单进行作废？', () => {
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
    PurchaseReturnApi.remove(arr[count - 1].id, arr[count - 1].version).then((resp) => {
      if (resp && resp.success) {
        this.successNumber++
        if (this.faultNumber + this.successNumber === total) {
          if (this.faultNumber > 0) {
            this.$msgBox.confirm('删除结果', `只有草稿状态的退货单才允许删除<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
              this.doGetPurchaseReturnList(this.query)
            })
          } else {
            this.$msgBox.confirm('删除结果', `成功${this.successNumber}条,失败${this.faultNumber}条`, () => {
              this.doGetPurchaseReturnList(this.query)
            })
          }
        }
        this.doDel(count - 1, arr, total)
      }
    }).catch((err) => {
      this.faultNumber++
      if (this.faultNumber + this.successNumber === total) {
        this.$msgBox.confirm('删除结果', `${err.message}<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
          this.doGetPurchaseReturnList(this.query)
        })
      }
      this.doDel(count - 1, arr, total)
    })
  }

  doAud(count: number, arr: any[], total: number) {
    if (count === 0) {
      return
    }
    PurchaseReturnApi.audit(arr[count - 1].id, arr[count - 1].version).then((resp) => {
      if (resp && resp.success) {
        this.successNumber++
        if (this.faultNumber + this.successNumber === total) {
          if (this.faultNumber > 0) {
            this.$msgBox.confirm('审核结果', `只有草稿状态的退货单才允许审核<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
              this.doGetPurchaseReturnList(this.query)
            })
          } else {
            this.$msgBox.confirm('审核结果', `成功${this.successNumber}条,失败${this.faultNumber}条`, () => {
              this.doGetPurchaseReturnList(this.query)
            })
          }
        }
        this.doAud(count - 1, arr, total)
      }
    }).catch((err) => {
      this.faultNumber++
      if (this.faultNumber + this.successNumber === total) {
        this.$msgBox.confirm('审核结果', `${err.message}<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
          this.doGetPurchaseReturnList(this.query)
        })
      }
      this.doAud(count - 1, arr, total)
    })
  }

  doAbo(count: number, arr: any[], total: number) {
    if (count === 0) {
      return
    }
    PurchaseReturnApi.abolish(arr[count - 1].id, arr[count - 1].version).then((resp) => {
      if (resp && resp.success) {
        this.successNumber++
        if (this.faultNumber + this.successNumber === total) {
          if (this.faultNumber > 0) {
            this.$msgBox.confirm('作废结果', `成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
              this.doGetPurchaseReturnList(this.query)
            })
          } else {
            this.$msgBox.confirm('作废结果', `成功${this.successNumber}条,失败${this.faultNumber}条`, () => {
              this.doGetPurchaseReturnList(this.query)
            })
          }
        }
        this.doAbo(count - 1, arr, total)
      }
    }).catch((err) => {
      this.faultNumber++
      if (this.faultNumber + this.successNumber === total) {
        this.$msgBox.confirm('作废结果', `${err.message}<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
          this.doGetPurchaseReturnList(this.query)
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
    this.$router.push('/purchaseReturnEdit')
  }

  /**
   *  导入退货单
   */
  doImport() {
    new Dialog(ExcelImport, {
      title: '退货单导入',
      doUpload: (files: any) => {
        return ExcelApi.upload(files)
      },
      doImport: (uuid: string) => {
        return ExcelApi.purchaseReturnBeginImport(uuid)
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
      title: '导出退货单',
      onExport: () => {
        return PurchaseReturnApi.exportPurchaseReturnList(this.query)
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
  onSelectionChange(arr: PurchaseReturn[]) {
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
