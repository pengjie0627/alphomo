import Vue from 'vue'
import Component from 'vue-class-component'
import QfQueryCondition from 'cmp/QueryCondition.vue'
import QfListContainer from 'cmp/ListContainer.vue'
import { Prop, Watch } from 'vue-property-decorator'
import QueryParam from 'model/request/QueryParam'
import { Dialog, Loading } from 'fant'
import SaleReportApi from 'http/sale/report/SaleReportApi.ts'
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
  // 来源
  sourceSelect = ''
  start = 1
  totalItem = 0
  tableData: any[] = []
  // 排序数组
  sort: any = []
  // 参数数组
  queryArr: any = []
  // 销售日期
  // saleDateFlag = false
  summary: any = ''
  // 接收分类统计属性标识
  @Prop()
  flag: string

  // 接收导出标识
  @Prop()
  exportFlag: boolean
  // 接收日期参数
  @Prop()
  businessDate: any[]
  hasPermission = PermissionMgr.hasOptionPermission
  @Prop()
  warehouse: Ucn

  @Watch('exportFlag')
  onExportFlagChange(value: boolean) {
    // todo 导出操作，导出成功后记得把父级的exportFlag变为false
    if (value) {
      new Dialog(ExportDialog, {
        title: '导出销售报表-按业务统计',
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

  @Watch('businessDate')
  onBusinessDate(value: any) {
    this.queryArr = []
    this.queryArr[0] = value
    this.getSaleRptList(this.setQueryParam())
  }

  /**
   * 查询
   */
  onSearch() {
    this.start = 1
    // todo 构造参数
    this.queryArr = []
    this.queryArr.push(this.businessDate)
    // this.queryArr.push(this.saleDateFlag)
    // todo 调用查询列表
    this.getSaleRptList(this.setQueryParam())
  }

  /**
   * 查看
   */
  onCheck(param: any) {
    let type = {
      type: 'BUSINESS',
      warehouseId: this.warehouse.id! || '',
      warehouseName: this.warehouse.name! || '全部',
      id: param.id,
      businessDate: param.businessDate,
      saleCount: param.saleCount,
      returnCount: param.returnCount
    }
    this.$router.push({ name: 'rptSaleSkuDtl', query: type })
  }

  mounted() {
    console.log(this.$refs)
    this.queryArr[0] = this.businessDate
    this.getSaleRptList(this.setQueryParam())
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
        sums[3] = this.summary ? this.summary.saleCount.toFixed(0) : 0
        sums[4] = this.summary ? this.fmtThumb(this.summary.taxExcSaleAmount.toString()) : 0
        sums[5] = this.summary ? this.fmtThumb(this.summary.saleAmount.toString()) : 0
        sums[6] = this.summary ? this.summary.returnCount.toFixed(0) : 0
        sums[7] = this.summary ? this.fmtThumb(this.summary.taxExcReturnAmount.toString()) : 0
        sums[8] = this.summary ? this.fmtThumb(this.summary.returnAmount.toString()) : 0
        sums[9] = this.summary ? this.fmtThumb(this.summary.taxExcGrossAmount.toString()) : 0
        sums[10] = this.summary ? this.fmtThumb(this.summary.grossAmount.toString()) : 0
      } else {
        sums[3] = this.summary ? this.summary.saleCount.toFixed(0) : 0
        sums[4] = this.summary ? this.fmtThumb(this.summary.saleAmount.toString()) : 0
        sums[5] = this.summary ? this.summary.returnCount.toFixed(0) : 0
        sums[6] = this.summary ? this.fmtThumb(this.summary.returnAmount.toString()) : 0
        sums[7] = this.summary ? this.fmtThumb(this.summary.grossAmount.toString()) : 0
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
    this.getSaleRptList(this.setQueryParam())
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
    this.getSaleRptList(this.setQueryParam())
  }

  formatter(row: any, column: any, value: string) {
    if (value) {
      return value.substring(0, 11)
    }
    return ''
  }

  /**
   * 设置参数
   */
  private setQueryParam() {
    let query = new QueryParam()
    query.limit = 10
    query.start = (this.start - 1) * 10
    query.sorters = this.sort
    query.filters.push({ 'property': 'businessDate:[,]', 'value': this.queryArr[0].length > 0 ? this.queryArr[0] : '' })
    // query.filters.push({ 'property': 'notZero:=', 'value': this.queryArr[1] ? '0' : '' })
    if (this.sourceSelect === 'new') {
      query.filters.push({ 'property': 'externalBillSource:=null', 'value': null })
    } else if (this.sourceSelect === 'mall') {
      query.filters.push({ 'property': 'externalBillSource:=', 'value': 'cloud_scm' })
      query.filters.push({ 'property': 'externalBillType:=', 'value': 'Order' })
    } else if (this.sourceSelect === 'car') {
      query.filters.push({ 'property': 'externalBillSource:=', 'value': 'cloud_scm' })
      query.filters.push({ 'property': 'externalBillType:=', 'value': 'CarSale' })
    } else {
      query.filters.push({ 'property': 'externalBillSource:=', 'value': '' })
    }
    query.filters.push({ 'property': 'warehouseUuid:=', 'value': this.warehouse.id! || '' })
    return query
  }

  /**
   * 获取查询列表
   * @param query
   */
  private getSaleRptList(query: any) {
    let loading = Loading.show()
    // todo 调用接口
    SaleReportApi.business(query).then((resp: any) => {
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
   * 导出
   */
  private getExport() {
    // todo 调用导出api
    return SaleReportApi.exportBusinessList(this.setQueryParam())
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
