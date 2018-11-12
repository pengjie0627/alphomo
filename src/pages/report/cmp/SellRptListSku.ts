import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import ListContainer from 'cmp/ListContainer.vue'
import QueryParam from 'model/request/QueryParam'
import FilterParam from 'model/request/FilterParam'
import SkuCategoryApi from 'http/basicdata/sku/SkuCategoryApi'
import { Dialog, Loading } from 'fant'
import PurchaseReportApi from 'http/purchase/report/PurchaseReportApi.ts'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import PermissionMgr from 'mgr/PermissionMgr'
import MerchantConfig from 'model/framework/merchant/MerchantConfig'
import { State } from 'vuex-class'
import Ucn from 'model/entity/Ucn'


@Component({
  name: 'sell-rpt-list-sku',
  components: {
    QueryCondition,
    ListContainer
  }
})

export default class SellRptListSku extends Vue {
  @State('merchantConfig') merchantConfig: MerchantConfig
  opened: boolean = false // 是否展开
  zeroSell = true // 不显示零进货商品
  skuCategory: string = '' // 类别选择
  skuKeyword: string = ''// 商品查询关键字
  hasPermission = PermissionMgr.hasOptionPermission

  //
  @Prop() date: Date[]

  tableData: any[] = []
  summary: any

  // 分页信息
  totalItem: number = 0
  start: number = 0
  pageSize: number = 10

  // 查询条件
  queries: QueryParam = new QueryParam()

  // 类别下拉框数据
  skuCategories: Object[]
  @Prop()
  warehouse: Ucn

  @Watch('$route')
  onRouteChange(to: any, from: any) {
    if (from.name !== 'rptSellSkuDtl' && from.name !== 'sellRptList' && to.name === 'sellRptList') {
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
    // 加载商品类别筛选下拉框
    this.zeroSell = true
    let loading = Loading.show()
    SkuCategoryApi.list().then((res) => {
      if (res && res.success) {
        loading.hide()
        this.skuCategories = res.data
      }
    }).catch((err) => {
      loading.hide()
      this.$message.error(err.message)
    })
    //
    let queries = this.queries
    queries.limit = this.pageSize
    let f1: FilterParam = new FilterParam('businessDate:[,]', '')
    let f2: FilterParam = new FilterParam('skuKeyword:%=%', '')
    let f3: FilterParam = new FilterParam('skuCategory:=', '')
    let f4: FilterParam = new FilterParam('notZero:=', this.zeroSell ? '0' : '')
    let f5: FilterParam = new FilterParam('warehouseUuid:=', this.warehouse.id! || '')
    queries.filters.push(f1)
    queries.filters.push(f2)
    queries.filters.push(f3)
    queries.filters.push(f4)
    queries.filters.push(f5)
    this.getList()
  }

  mounted() {
    // todo
  }

  getExport() {
    new Dialog(ExportDialog, {
      title: '导出进货报表-按商品统计',
      onExport: () => {
        return PurchaseReportApi.exportSkuList(this.queries)
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
      sums[6] = this.summary && this.summary.qty ? this.summary.qty.toFixed(0) : 0
      if (this.merchantConfig.enableInputTaxRateSupport && !this.merchantConfig.inputReportOnlyTax) {
        sums[7] = this.summary && this.summary.taxExcAmount ? this.fmtThumb(this.summary.taxExcAmount.toString()) : 0.00
        sums[8] = this.summary && this.summary.amount ? this.fmtThumb(this.summary.amount.toString()) : 0.00
      } else {
        sums[7] = this.summary && this.summary.amount ? this.fmtThumb(this.summary.amount.toString()) : 0.00
      }
    }
    return sums
  }

  getList() {
    if (this.date !== null && this.date.length < 2) {
      this.queries.filters[0].value = ''
    } else {
      this.queries.filters[0].value = this.date
    }
    this.queries.filters[4].value = this.warehouse.id! || ''
    let loading = Loading.show()
    this.queries.start = (this.start - 1) * this.pageSize
    PurchaseReportApi.querySku(this.queries).then((res) => {
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
    this.queries.filters[3].value = ''
    if (this.opened) {
      this.queries.filters[2].value = this.skuCategory
    } else {
      this.queries.filters[2].value = ''
    }
    if (this.zeroSell) {
      this.queries.filters[3].value = '0'
    } else {
      this.queries.filters[3].value = ''
    }
    this.queries.filters[1].value = this.skuKeyword
    this.getList()
  }

  onChange() {
    this.getList()
  }

  sortChange({ column, prop, order }: any) {
    order === 'ascending' ? (order = 'ASC') : (order = 'DESC')
    let sorters = []
    column && prop && order && sorters.push({ 'property': this.sort(prop), 'direction': order })
    this.queries.sorters = sorters
    this.start = 1
    this.getList()
  }

  onToggle() {
    this.opened = !this.opened
  }

  doToggle() {
    this.opened = false;
  }

  onReset() {
    this.skuKeyword = ''
    this.skuCategory = ''
    this.zeroSell = false
    this.onSearch()
  }

  /**
   * 查看
   */
  onCheck(param: any) {
    let type = {
      type: 'SKU',
      skuP: param.sku.id,
      warehouseId: this.warehouse.id! || '',
      warehouse: this.warehouse.name! || '全部'
    }
    let oParam = Object.assign(param, type)
    this.$router.push({ name: 'rptSellSkuDtl', query: oParam })
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

  private sort(prop: string) {
    return (prop === 'avgPrice' || prop === 'taxExcAvgPrice') ? 'AVG(' + prop + ')' : 'SUM(' + prop + ')'
  }


}
