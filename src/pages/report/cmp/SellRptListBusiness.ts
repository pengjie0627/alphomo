import Vue from 'vue'
import Component from 'vue-class-component'
import QfQueryCondition from 'cmp/QueryCondition.vue'
import QfListContainer from 'cmp/ListContainer.vue'
import QueryParam from 'model/request/QueryParam'
import { Dialog, Loading } from 'fant'
import PurchaseReportApi from 'http/purchase/report/PurchaseReportApi.ts'
import { Prop, Watch } from 'vue-property-decorator'
import FilterParam from 'model/request/FilterParam'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import PermissionMgr from 'mgr/PermissionMgr'
import MerchantConfig from 'model/framework/merchant/MerchantConfig'
import { State } from 'vuex-class'
import Ucn from 'model/entity/Ucn'

@Component({
  name: 'sale-rpt-list-business',
  components: {
    QfQueryCondition,
    QfListContainer
  }
})
export default class SaleRptListBusiness extends Vue {
  @State('merchantConfig') merchantConfig: MerchantConfig
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
  hasPermission = PermissionMgr.hasOptionPermission
  @Prop() warehouse: Ucn
  @Prop() warehouseId: string

  /**
   * 查询
   */
  onSearch() {
    this.start = 1
    this.getList()
  }

  @Watch('date')
  onDate(value: any) {
    if (value) {
      this.date = value
      this.getList()
    }
  }

  @Watch('warehouseId', { deep: true })
  onWareHouseChange() {
    this.getList()
  }

  beforeMount() {
    let queries = this.queries
    queries.limit = this.pageSize
    let f1: FilterParam = new FilterParam('businessDate:[,]', '')
    let f2: FilterParam = new FilterParam('warehouseUuid:=', this.warehouse.id! || '')
    queries.filters.push(f1)
    queries.filters.push(f2)
    this.getList()
  }

  getExport() {
    new Dialog(ExportDialog, {
      title: '导出进货报表-按业务统计',
      onExport: () => {
        return PurchaseReportApi.exportBillReportList(this.queries)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }

  getList() {
    if (this.date !== null && this.date.length < 2) {
      this.queries.filters[0].value = ''
    } else {
      this.queries.filters[0].value = this.date
    }
    this.queries.filters[1].value = this.warehouse.id! || ''
    let loading = Loading.show()
    this.queries.start = (this.start - 1) * this.pageSize
    PurchaseReportApi.business(this.queries).then((res) => {
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

  mounted() {
    //
  }

  getSummaries(param: any) {
    const sums: any = []
    if (this.summary !== null) {
      sums[0] = '合计'
      sums[1] = ''
      sums[2] = ''
      sums[3] = this.summary ? this.summary.purchaseCount : 0
      if (PermissionMgr.hasOptionPermission('price.refPurchasePrice')) {
        if (this.merchantConfig.enableInputTaxRateSupport && !this.merchantConfig.inputReportOnlyTax) {
          sums[4] = this.summary ? this.fmtThumb(this.summary.taxExcPurchaseAmount.toString()) : 0.00
          sums[5] = this.summary ? this.fmtThumb(this.summary.purchaseAmount.toString()) : 0.00
          sums[6] = this.summary ? this.summary.returnCount : 0
          sums[7] = this.summary ? this.fmtThumb(this.summary.taxExcReturnAmount.toString()) : 0.00
          sums[8] = this.summary ? this.fmtThumb(this.summary.returnAmount.toString()) : 0.00
        } else {
          sums[4] = this.summary ? this.fmtThumb(this.summary.purchaseAmount.toString()) : 0.00
          sums[5] = this.summary ? this.summary.returnCount : 0
          sums[6] = this.summary ? this.fmtThumb(this.summary.returnAmount.toString()) : 0.00
        }
      } else {
        if (this.merchantConfig.enableInputTaxRateSupport && !this.merchantConfig.inputReportOnlyTax) {
          sums[4] = this.summary ? this.summary.returnCount : 0
          sums[5] = this.summary ? this.fmtThumb(this.summary.taxExcReturnAmount.toString()) : 0.00
          sums[6] = this.summary ? this.fmtThumb(this.summary.returnAmount.toString()) : 0.00
        } else {
          sums[4] = this.summary ? this.summary.returnCount : 0
          sums[5] = this.summary ? this.fmtThumb(this.summary.returnAmount.toString()) : 0.00
        }
      }
    }
    return sums
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

  onCheck(param: any) {
    let params = {
      type: 'BUSINESS',
      warehouseId: this.warehouse.id! || '',
      warehouse: this.warehouse.name! || '全部'
    }
    let oParam = Object.assign(param, params)
    this.$router.push({ name: 'rptSellSkuDtl', query: oParam })
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
    if (prop === 'purchaseAmount') {
      return 'SUM(inRealAmount)'
    }
    if (prop === 'returnAmount') {
      return 'SUM(outRealAmount)'
    }
    if (prop === 'purchaseCount') {
      return 'COUNT(distinct inUuid)'
    }
    if (prop === 'returnCount') {
      return 'COUNT(distinct outUuid)'
    }
    return (prop === 'avgPrice' || prop === 'taxExcAvgPrice') ? 'AVG(' + prop + ')' : 'SUM(' + prop + ')'
  }
}
