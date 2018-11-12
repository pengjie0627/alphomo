import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import ListContainer from 'cmp/ListContainer.vue'
import QueryParam from 'model/request/QueryParam'
import FilterParam from 'model/request/FilterParam'
import SkuCategoryApi from 'http/basicdata/sku/SkuCategoryApi'
import WarehouseApi from 'http/basicdata/warehouses/WarehouseApi'
import { Dialog, Loading } from 'fant'
import InventoryReportApi from 'http/inventory/report/InventoryReportApi'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import PermissionMgr from 'mgr/PermissionMgr'
import Warehouse from 'model/basicdata/warehouses/Warehouse'

@Component({
  name: 'sell-rpt-list-sku',
  components: {
    QueryCondition,
    ListContainer
  }
})

export default class SellRptListSku extends Vue {
  opened: boolean = false // 是否展开
  zeroStorage: boolean = true // 不显示零库存商品
  skuCategory: string = '' // 类别选择
  skuKeyword: string = ''// 商品查询关键字
  warehouse: string = ''
  hasPermission = PermissionMgr.hasOptionPermission

  //
  @Prop() date: Date

  tableData: any[] = []
  summary: any

  // 分页信息
  totalItem: number = 0
  start: number = 1
  pageSize: number = 10

  // 查询条件
  queries: QueryParam = new QueryParam()

  // 类别下拉框数据
  skuCategories: Object[]
  warehouses: Warehouse[]

  @Watch('$route')
  onRouteChange(to: any, from: any) {
    if (from.name !== 'rptStorageSkuDtl' && from.name !== 'storageRptList' && to.name === 'storageRptList') {
      this.onReset()
    }
  }

  @Watch('date')
  onDate(value: any) {
    if (value) {
      this.date = value
      this.getList()
    }
  }

  beforeMount() {
    this.zeroStorage = true
    // 加载商品类别筛选下拉框
    this.listskuCategory()
    // 加载仓库下拉框
    this.listWarehouse()
    //
    let queries = this.queries
    queries.limit = this.pageSize
    let f1: FilterParam = new FilterParam('businessDate:[,]', '')
    let f2: FilterParam = new FilterParam('skuKeyword:%=%', '')
    let f3: FilterParam = new FilterParam('skuCategory:=', '')
    let f4: FilterParam = new FilterParam('warehouseUuid:=', '')
    let f5: FilterParam = new FilterParam('qty:!=', this.zeroStorage ? '0' : '')
    queries.filters.push(f1)
    queries.filters.push(f2)
    queries.filters.push(f3)
    queries.filters.push(f4)
    queries.filters.push(f5)
    this.getList()
  }

  listskuCategory() {
    SkuCategoryApi.list().then((res) => {
      if (res && res.success) {
        this.skuCategories = res.data
      }
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  listWarehouse() {
    WarehouseApi.query(new QueryParam()).then((resp) => {
      this.warehouses = resp.data
    }).catch(e => {
      this.$message.error(e.message)
    })
  }

  getExport() {
    new Dialog(ExportDialog, {
      title: '导出库存报表',
      onExport: () => {
        return InventoryReportApi.export(this.queries)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }

  getSummaries(param: any) {
    const sums: any = []
    if (this.summary !== null) {
      sums[0] = '合计'
      sums[1] = ''
      sums[2] = ''
      sums[3] = ''
      sums[4] = ''
      sums[5] = ''
      sums[6] = this.summary ? this.summary.beginingQty.toFixed(0) : 0
      sums[7] = this.summary ? this.summary.inQty.toFixed(0) : 0
      sums[8] = this.summary ? this.summary.outQty.toFixed(0) : 0
      sums[9] = this.summary ? this.summary.qty.toFixed(0) : 0
      sums[10] = this.summary ? this.fmtThumb(this.summary.taxExcAmount.toString()) : '0.00'
      sums[11] = this.summary ? this.fmtThumb(this.summary.amount.toString()) : '0.00'
    }
    return sums
  }

  getList() {
    this.queries.filters[0].value = [this.date, this.date]
    let loading = Loading.show()
    this.queries.start = (this.start - 1) * this.pageSize
    InventoryReportApi.query(this.queries).then((res) => {
      if (res && res.success) {
        loading.hide()
        this.tableData = res.data
        this.summary = res.summary
        this.totalItem = res.total
      }
    }).catch((err) => {
      loading.hide()
      this.$message.error(err.message)
    })
  }

  onSearch() {
    this.start = 1
    if (this.opened) {
      this.queries.filters[2].value = this.skuCategory
      this.queries.filters[3].value = this.warehouse
      if (this.zeroStorage) {
        this.queries.filters[4].value = '0'
      } else {
        this.queries.filters[4].value = ''
      }
    } else {
      this.queries.filters[2].value = ''
    }
    this.queries.filters[1].value = this.skuKeyword
    this.getList()
  }

  onChange() {
    this.getList()
  }

  onReset() {
    this.skuKeyword = ''
    this.skuCategory = ''
    this.warehouse = ''
    this.zeroStorage = true
    this.onSearch()
  }

  /**
   * 查看
   */
  onCheck(param: any) {
    let warehouseName = '全部'
    if (this.warehouse !== '') {
      this.warehouses.forEach(a => {
        if (a.id === this.warehouse) {
          warehouseName = a.name!
        }
      })
    }
    let type = {
      skuP: param.sku.id,
      warehouseId: this.warehouse,
      warehouseName: warehouseName
    }
    this.$router.push({ name: 'rptStorageSkuDtl', query: type })
  }

  onToggle() {
    this.opened = !this.opened
  }

  doToggle() {
    this.opened = false
  }

  sortChange({ column, prop, order }: any) {
    order === 'ascending' ? (order = 'ASC') : (order = 'DESC')
    let sorters = []
    column && prop && order && sorters.push({ 'property': prop, 'direction': order })
    this.queries.sorters = sorters
    this.start = 1
    this.getList()
  }

  doEnterSearch() {
    this.onSearch()
  }

  /**
   * 千分位
   * @param value
   * @returns {string}
   */
  private fmtThumb(value: string) {
    if (!value) return '0.00'
    let value2Array = value.split('.')
    let intPart = ''
    intPart = value2Array[0] // 获取整数部分
    let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三let
    let floatPart = '.00' // 预定义小数部分
    // =2表示数据有小数位
    if (value2Array.length === 2) {
      let floatStr = '0.' + value2Array[1]
      floatPart = Number(floatStr).toFixed(2).toString() // 拿到小数部分
      if (floatPart.length === 1) { // 补0,实际上用不着
        return intPartFormat + '.' + floatPart.substring(2, floatPart.length) + '0'
      } else {
        return intPartFormat + '.' + floatPart.substring(2, floatPart.length)
      }
    } else {
      return intPartFormat + floatPart
    }
  }
}

