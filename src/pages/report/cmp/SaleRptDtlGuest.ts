import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import SaleReportApi from 'http/sale/report/SaleReportApi.ts'
import { Loading, Dialog } from 'fant'
import QueryParam from 'model/request/QueryParam'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import PermissionMgr from 'mgr/PermissionMgr'
import MerchantConfig from 'model/framework/merchant/MerchantConfig'
import { State } from 'vuex-class'

@Component({
  name: 'sale-rpt-dtl-guest'
})
export default class SaleRptDtlGuest extends Vue {
  @State('merchantConfig') merchantConfig: MerchantConfig
  tableData: any[] = []
  sort: any[] = []
  start = 1
  totalItem = 0
  summary: any = ''
  @Prop()
  queryArr: any[]
  // 接收导出标识
  @Prop()
  exportFlag: boolean
  hasPermission = PermissionMgr.hasOptionPermission

  @Watch('exportFlag')
  onExportFlagChange(value: boolean) {
    // todo 导出操作，导出成功后记得把父级的exportFlag变为false
    if (value) {
      new Dialog(ExportDialog, {
        title: '导出商品详情-按客户统计',
        onExport: () => {
          return this.getExport()
        },
        onProgress: (val: string) => {
          return JobQueryApi.query(val)
        },
        onConfirm: () => {
          this.$emit('exportEvent', false)
        }
      }).show()
    }
  }

  @Watch('queryArr', { deep: true })
  onQueryArrChange(value: any) {
    console.log(value)
    this.getSuppliersList(this.setQueryParams())
  }

  mounted() {
    this.getSuppliersList(this.setQueryParams())
  }

  getSummaries(param: any) {
    const { columns } = param
    const sums: any = []
    columns.forEach((column: any, index: any) => {
      if (index === 0) {
        sums[index] = '合计'
        return
      }
      if (this.merchantConfig.enableOutputTaxRateSupport && !this.merchantConfig.outputReportOnlyTax) {
        sums[2] = this.summary ? this.summary.qty.toFixed(0) : 0
        sums[3] = this.summary ? this.fmtThumb(this.summary.taxExcAmount.toString()) : 0
        sums[4] = this.summary ? this.fmtThumb(this.summary.amount.toString()) : 0
        sums[7] = this.summary ? this.fmtThumb(this.summary.taxExcGrossAmount.toString()) : 0
        sums[8] = this.summary ? this.fmtThumb(this.summary.grossAmount.toString()) : 0
        sums[9] = (this.summary ? (100 * this.summary.grossRate).toFixed(2) : 0) + '%'
      } else {
        sums[2] = this.summary ? this.summary.qty.toFixed(0) : 0
        sums[3] = this.summary ? this.fmtThumb(this.summary.amount.toString()) : 0
        sums[5] = this.summary ? this.fmtThumb(this.summary.grossAmount.toString()) : 0
        sums[6] = (this.summary ? (100 * this.summary.grossRate).toFixed(2) : 0) + '%'
      }
    })
    return sums
  }

  /**
   * 分页回调
   */
  onChange(start: number, pageSize: number) {
    this.start = this.start
    // todo 调用查询列表
    this.getSuppliersList(this.setQueryParams())
  }

  /**
   * 表格排序
   */
  sortChange({ column, prop, order }: any) {
    order === 'ascending' ? (order = 'ASC') : (order = 'DESC')
    this.sort = []
    column && prop && order && this.sort.push({ 'property': prop, 'direction': order })
    this.start = 1
    // todo 调用查询列表
    this.getSuppliersList(this.setQueryParams())
  }

  /**
   * 导出
   */
  private getExport() {
    // todo 调用导出apis
    return SaleReportApi.exportSaleList(true, this.setQueryParams())
  }

  /**
   * 获取商品下的列表
   */
  private getSuppliersList(query: any) {
    let loading = Loading.show()
    SaleReportApi.queryGroupByCustomer(true, query).then((resp: any) => {
      if (resp && resp.success) {
        loading.hide()
        this.tableData = resp.data
        this.totalItem = resp.total
        this.summary = resp.summary
      }
    }).catch((error: any) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  /**
   * 设置参数
   */
  private setQueryParams() {
    let query = new QueryParam()
    query.start = (this.start - 1) * 10
    query.limit = 10
    query.sorters = this.sort
    query.filters.push({ 'property': 'sku:=', 'value': this.queryArr[0] ? this.queryArr[0] : '' }) // 上一单商品id
    query.filters.push({ 'property': 'businessDate:[,]', 'value': this.queryArr[1] })
    query.filters.push({ 'property': 'customerName:%=%', 'value': this.queryArr[2] ? this.queryArr[2] : '' }) // 商品编号
    if (this.queryArr[4] !== '') {
      query.filters.push({ 'property': 'warehouseUuid:=', 'value': this.queryArr[4] ? this.queryArr[4] : '' }) // 仓库
    }
    return query
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
