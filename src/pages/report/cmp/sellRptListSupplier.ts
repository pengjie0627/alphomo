import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import ListContainer from 'cmp/ListContainer.vue'
import FilterParam from 'model/request/FilterParam'
import { Dialog, Loading } from 'fant'
import QueryParam from 'model/request/QueryParam'
import PurchaseReportApi from 'http/purchase/report/PurchaseReportApi.ts'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import PermissionMgr from 'mgr/PermissionMgr'
import MerchantConfig from 'model/framework/merchant/MerchantConfig'
import { State } from 'vuex-class'
import Ucn from 'model/entity/Ucn'


@Component({
  name: 'sell-rpt-list-supplier',
  components: {
    QueryCondition,
    ListContainer
  }
})

export default class SellRptListSupplier extends Vue {
  @State('merchantConfig') merchantConfig: MerchantConfig
  supplierKeyword: string = ''
  zeroSell: boolean = true // 不显示零进货商品
  hasPermission = PermissionMgr.hasOptionPermission

  //
  @Prop() date: Date[]

  tableData: any[] = []
  summary: any

  // 查询条件
  queries: QueryParam = new QueryParam()

  // 分页信息
  totalItem: number = 0
  start: number = 0
  pageSize: number = 10
  @Prop()
  warehouse: Ucn

  @Watch('date')
  onDate(value: any) {
    if (value) {
      this.date = value
      this.getList()
    }
  }

  beforeMount() {
    let queries = this.queries
    queries.limit = this.pageSize
    let f1: FilterParam = new FilterParam('businessDate:[,]', '')
    let f2: FilterParam = new FilterParam('supplierKeyword:%=%', '')
    let f3: FilterParam = new FilterParam('notZero:=', '')
    let f4: FilterParam = new FilterParam('warehouseUuid:=', this.warehouse.id! || '')

    queries.filters.push(f1)
    queries.filters.push(f2)
    queries.filters.push(f3)
    queries.filters.push(f4)
    this.onSearch()
  }

  mounted() {
    //
  }

  getExport() {
    new Dialog(ExportDialog, {
      title: '导出进货报表-按供应商统计',
      onExport: () => {
        return PurchaseReportApi.exportPurchaseList(false, this.queries)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }

  onSearch() {
    this.start = 1
    this.queries.filters[1].value = this.supplierKeyword
    if (this.zeroSell) {
      this.queries.filters[2].value = '0'
    } else {
      this.queries.filters[2].value = ''
    }
    this.getList()
  }

  sortChange({ column, prop, order }: any) {
    order === 'ascending' ? (order = 'ASC') : (order = 'DESC')
    let sorters = []
    column && prop && order && sorters.push({ 'property': 'SUM(' + prop + ')', 'direction': order })
    this.queries.sorters = sorters
    this.start = 1
    this.getList()
  }

  getList() {
    if (this.date !== null && this.date.length < 2) {
      this.queries.filters[0].value = ''
    } else {
      this.queries.filters[0].value = this.date
    }
    this.queries.filters[3].value = this.warehouse.id! || ''
    let loading = Loading.show()
    this.queries.start = (this.start - 1) * this.pageSize
    PurchaseReportApi.querySupplier(false, this.queries).then((res) => {
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

  getSummaries(param: any) {
    const sums: any = []
    if (this.summary !== null) {
      sums[0] = '合计'
      sums[1] = ''
      sums[2] = ''
      sums[3] = ''
      sums[4] = this.summary ? this.summary.purchaseCount : 0
      if (PermissionMgr.hasOptionPermission('price.refPurchasePrice')) {
        if (this.merchantConfig.enableInputTaxRateSupport && !this.merchantConfig.inputReportOnlyTax) {
          sums[5] = this.summary ? this.fmtThumb(this.summary.taxExcPurchaseAmount.toString()) : 0.00
          sums[6] = this.summary ? this.fmtThumb(this.summary.purchaseAmount.toString()) : 0.00
          sums[7] = this.summary ? this.summary.returnCount : 0
          sums[8] = this.summary ? this.fmtThumb(this.summary.taxExcReturnAmount.toString()) : 0.00
          sums[9] = this.summary ? this.fmtThumb(this.summary.returnAmount.toString()) : 0.00
        } else {
          sums[5] = this.summary ? this.fmtThumb(this.summary.purchaseAmount.toString()) : 0.00
          sums[6] = this.summary ? this.summary.returnCount : 0
          sums[7] = this.summary ? this.fmtThumb(this.summary.returnAmount.toString()) : 0.00
        }
      } else {
        if (this.merchantConfig.enableInputTaxRateSupport && !this.merchantConfig.inputReportOnlyTax) {
          sums[5] = this.summary ? this.summary.returnCount : 0
          sums[6] = this.summary ? this.fmtThumb(this.summary.taxExcReturnAmount.toString()) : 0.00
          sums[7] = this.summary ? this.fmtThumb(this.summary.returnAmount.toString()) : 0.00
        } else {
          sums[5] = this.summary ? this.summary.returnCount : 0
          sums[6] = this.summary ? this.fmtThumb(this.summary.returnAmount.toString()) : 0.00
        }
      }
    }
    return sums
  }

  onChange() {
    this.getList()
  }

  /**
   * 查看
   */
  onCheck(param: any) {
    let params = {
      type: 'SUPPLIER',
      supplierP: param.supplier.id,
      warehouse: this.warehouse.name! || '全部',
      warehouseId: this.warehouse.id! || ''
    }
    let oParam = Object.assign(param, params)
    this.$router.push({ name: 'rptSellSkuDtl', query: oParam })
  }

  zeroChcek() {
    this.onSearch()
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
