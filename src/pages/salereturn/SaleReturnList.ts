import { Component, Vue } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import SaleReturnListSearch from 'pages/salereturn/cmp/SaleReturnListSearch.vue'
import SaleReturnListTable from 'pages/salereturn/cmp/SaleReturnListTable.vue'
import ExcelImport from 'cmp/ExcelImport.vue'
import SaleReturnApi from 'http/salereturn/SaleReturnApi'
import QueryParam from 'model/request/QueryParam'
import SaleReturn from 'model/salereturn/SaleReturn'
import { Dialog, Loading } from 'fant'
import ConstantMgr from 'mgr/ConstantMgr'
import PermissionMgr from 'mgr/PermissionMgr'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import ExcelApi from 'http/excel/ExcelApi'
import PrintView from 'cmp/print/PrintView.vue'

// 分页插件数据对象
class SaleReturnPagination {
  start: number = 1
  total: number = 0
  limit: number = 10
}

@Component({
  components: {
    PageBody,
    ListContainer,
    SaleReturnListSearch,
    SaleReturnListTable,
    ExportDialog,
    PrintView
  }
})
export default class SaleReturnList extends Vue {
  // 面包屑菜单
  menu = [{
    name: '销售退货单',
    url: '/saleReturnList'
  }]
  // 表格数据
  tableData: SaleReturn[] = []
  // 已选对象
  selectedData: SaleReturn[] = []
  // 分页插件数据对象
  pagination = new SaleReturnPagination()
  // 表单查询数据对象
  query: QueryParam = new QueryParam()
  // 界面长度限制
  limits = ConstantMgr.limits.saleReturn
  // 商品ID列表
  ids: string[] = []
  // 权限
  hasPermissions: Function = PermissionMgr.hasOptionPermission
  successNumber: number = 0
  faultNumber: number = 0
  id: string[] = []
  // 导入模板
  importTemplate: string

  beforeMount() {
    ExcelApi.listTemplate('saleReturn').then((res) => {
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
  doGetSaleReturnList(query: QueryParam) {
    let loading = Loading.show()
    SaleReturnApi.query(query).then((res) => {
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
    if (this.query.sorters && this.query.sorters.length === 0) {
      this.query.sorters = [{ 'property': 'lastModified', 'direction': 'DESC' }]
    }
    this.doGetSaleReturnList(this.query)
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
    this.$router.push('/saleReturnEdit')
  }

  /**
   *  导入销售单
   */
  doImport() {
    new Dialog(ExcelImport, {
      title: '导入销售单',
      doUpload: (files: any) => {
        return ExcelApi.upload(files)
      },
      doImport: (uuid: string) => {
        return ExcelApi.importSaleReturn(uuid)
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
      title: '导出销售退货单',
      onExport: () => {
        return SaleReturnApi.exportSaleReturnList(this.query)
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
      ids.push({ id: item.id!, version: item.version })
    })
    this.successNumber = this.faultNumber = 0
    this.$msgBox.confirm('批量删除', '您是否确认删除选中销售退货单？', () => {
      this.doDel(ids.length, ids, ids.length)
    })
  }

  /**
   * 批量审核
   */
  doAudit() {
    let ids: any[] = []
    this.selectedData.forEach((item) => {
      ids.push({ id: item.id!, version: item.version })
    })
    this.successNumber = this.faultNumber = 0
    this.$msgBox.confirm('批量审核', '您是否对选中的销售退货单进行审核？', () => {
      this.doAud(ids.length, ids, ids.length)
    })
  }

  /**
   * 批量作废
   */
  doAbolish() {
    let ids: any[] = []
    this.selectedData.forEach((item) => {
      ids.push({ id: item.id!, version: item.version })
    })
    this.successNumber = this.faultNumber = 0
    this.$msgBox.confirm('批量作废', '您是否对选中的销售退货单进行作废操作？', () => {
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
    SaleReturnApi.remove(arr[count - 1].id, arr[count - 1].version).then((resp) => {
      if (resp && resp.success) {
        this.successNumber++
        if (this.faultNumber + this.successNumber === total) {
          if (this.faultNumber > 0) {
            this.$msgBox.confirm('删除结果', `只有草稿状态的销售退货单才允许删除<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
              this.doGetSaleReturnList(this.query)
            })
          } else {
            this.$msgBox.confirm('删除结果', `成功${this.successNumber}条,失败${this.faultNumber}条`, () => {
              this.doGetSaleReturnList(this.query)
            })
          }
        }
        this.doDel(count - 1, arr, total)
      }
    }).catch((err) => {
      this.faultNumber++
      if (this.faultNumber + this.successNumber === total) {
        this.$msgBox.confirm('删除结果', `${err.message}<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
          this.doGetSaleReturnList(this.query)
        })
      }
      this.doDel(count - 1, arr, total)
    })
  }

  /**
   * 递归审核
   * @param {number} count
   * @param {any[]} arr
   * @param {number} total
   */
  doAud(count: number, arr: any[], total: number) {
    if (count === 0) {
      return
    }
    SaleReturnApi.audit(arr[count - 1].id, arr[count - 1].version).then((resp) => {
      if (resp && resp.success) {
        this.successNumber++
        if (this.faultNumber + this.successNumber === total) {
          if (this.faultNumber > 0) {
            this.$msgBox.confirm('审核结果', `只有草稿状态的销售退货单才允许审核<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
              this.doGetSaleReturnList(this.query)
            })
          } else {
            this.$msgBox.confirm('审核结果', `成功${this.successNumber}条,失败${this.faultNumber}条`, () => {
              this.doGetSaleReturnList(this.query)
            })
          }
        }
        this.doAud(count - 1, arr, total)
      }
    }).catch((err) => {
      this.faultNumber++
      if (this.faultNumber + this.successNumber === total) {
        this.$msgBox.confirm('审核结果', `${err.message}<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
          this.doGetSaleReturnList(this.query)
        })
      }
      this.doAud(count - 1, arr, total)
    })
  }

  /**
   * 递归作废
   * @param {number} count
   * @param {any[]} arr
   * @param {number} total
   */
  doAbo(count: number, arr: any[], total: number) {
    if (count === 0) {
      return
    }
    SaleReturnApi.abolish(arr[count - 1].id, arr[count - 1].version).then((resp) => {
      if (resp && resp.success) {
        this.successNumber++
        if (this.faultNumber + this.successNumber === total) {
          if (this.faultNumber > 0) {
            this.$msgBox.confirm('作废结果', `草稿状态和已作废状态的销售退货单不允许作废<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
              this.doGetSaleReturnList(this.query)
            })
          } else {
            this.$msgBox.confirm('作废结果', `成功${this.successNumber}条,失败${this.faultNumber}条`, () => {
              this.doGetSaleReturnList(this.query)
            })
          }
        }
        this.doAbo(count - 1, arr, total)
      }
    }).catch((err) => {
      this.faultNumber++
      if (this.faultNumber + this.successNumber === total) {
        this.$msgBox.confirm('作废结果', `草稿状态和已作废状态的销售退货单不允许作废<br/>成功${this.successNumber}条<br/>失败${this.faultNumber}条`, () => {
          this.doGetSaleReturnList(this.query)
        })
      }
      this.doAbo(count - 1, arr, total)
      return err.message
    })
  }

  /**
   * 表格选择
   * @param arr
   */
  onSelectionChange(arr: SaleReturn[]) {
    this.selectedData = arr
    this.id = []
    if (this.selectedData) {
      for (let i = 0; i < this.selectedData.length; i++) {
        this.id[i] = this.selectedData[i].id!
      }
    }
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
