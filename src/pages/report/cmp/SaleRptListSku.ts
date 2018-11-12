import Vue from 'vue'
import Component from 'vue-class-component'
import QfQueryCondition from 'cmp/QueryCondition.vue'
import QfListContainer from 'cmp/ListContainer.vue'
import { Prop, Watch } from 'vue-property-decorator'
import { Loading, Dialog } from 'fant'
import QueryParam from 'model/request/QueryParam'
import SaleReportApi from 'http/sale/report/SaleReportApi.ts'
import SkuCategoryApi from 'http/basicdata/sku/SkuCategoryApi'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import PermissionMgr from 'mgr/PermissionMgr'
import Supplier from 'model/basicdata/supplier/Supplier'
import Ucn from 'model/entity/Ucn'
import Search from 'cmp/Search.vue'
import MerchantConfig from 'model/framework/merchant/MerchantConfig'
import { State } from 'vuex-class'

@Component({
  name: 'sale-rpt-list-sku',
  components: {
    QfQueryCondition,
    QfListContainer,
    Search
  }
})
export default class SaleRptListSku extends Vue {
  @State('merchantConfig') merchantConfig: MerchantConfig
  // 展开标识
  opened = false
  // 零销售
  zeroSale = true
  // 表格数据
  tableData: any[] = []
  // 分页起始页
  start = 1
  // 分页总条数
  totalItem = 0
  // 商品
  sku = ''
  // 分类选择
  selectCatogory = ''
  // 供应商
  searchObj: Nullable<Ucn> = new Ucn()
  // 排序数组
  sort: any = []
  // 参数数组
  queryArr: any = []
  // 类别
  catogoryList: any = []
  // 汇总
  summary: any = ''
  // refs定义
  $refs: {
    skuRef: any,
    skuExpendRef: any,
    taxClassificationRef: any
  }
  // 接收分类统计属性标识
  @Prop()
  flag: string
  // 接收导出标识
  @Prop()
  exportFlag: boolean
  // 接收日期参数
  @Prop()
  businessDate: any[]
  @Prop()
  warehouse: Ucn
  taxClassification: string = ''
  hasPermission = PermissionMgr.hasOptionPermission

  @Watch('$route')
  onRouteChange(to: any, from: any) {
    if (from.name !== 'rptSaleSkuDtl' && from.name !== 'saleRptList'  && to.name === 'saleRptList') {
      this.onReset()
    }
  }

  @Watch('exportFlag')
  onExportFlagChange(value: boolean) {
    // todo 导出操作，导出成功后记得把父级的exportFlag变为false
    if (value) {
      new Dialog(ExportDialog, {
        title: '导出销售报表-按商品统计',
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
    if (value) {
      this.queryArr = []
      // if (this.opened) {
      //   this.queryArr[0] = value
      //   this.queryArr[3] = true
      // } else {
      //   this.queryArr[0] = value
      // }
      this.queryArr[0] = value
      this.queryArr[3] = true
      this.queryArr[4] = this.warehouse!.id! || ''
      this.queryArr[5] = this.taxClassification
      this.getSaleRptList(this.setQueryParam())
    }
  }

  /**
   * 搜索
   */
  onSearch() {
    this.start = 1
    // todo 构造参数
    this.queryArr = []
    // if (this.opened) {// 展开状态
    //   this.queryArr.push(this.businessDate)
    //   this.queryArr.push(this.sku)
    //   this.queryArr.push(this.selectCatogory)
    //   this.queryArr.push(this.zeroSale ? '0' : '') // 零销售商品
    // } else { // 收起状态
    //   this.queryArr.push(this.businessDate)
    //   this.queryArr.push(this.sku)
    // }
    this.queryArr.push(this.businessDate)
    this.queryArr.push(this.sku)
    this.queryArr.push(this.selectCatogory)
    this.queryArr.push(this.zeroSale ? '0' : '') // 零销售商品
    this.queryArr.push(this.warehouse!.id! || '')
    this.queryArr.push(this.taxClassification)
    // todo 调用查询列表
    this.getSaleRptList(this.setQueryParam())
  }

  /**
   * 重置
   */
  onReset() {
    this.zeroSale = true
    this.sku = ''
    this.selectCatogory = ''
    this.searchObj = new Ucn()
    this.taxClassification = ''
    this.start = 1
    this.queryArr = []
    this.queryArr[0] = this.businessDate
    this.queryArr[1] = this.sku
    this.queryArr[2] = this.selectCatogory
    this.queryArr[3] = this.zeroSale ? '0' : '' // 零销售商品
    this.queryArr[4] = this.warehouse!.id! || ''
    this.queryArr[5] = this.taxClassification
    // todo 调用查询列表
    this.getSaleRptList(this.setQueryParam())
  }

  /**
   * 展开与关闭
   */
  onToggle() {
    this.opened = !this.opened
    this.sku = ''
    this.selectCatogory = ''
    this.searchObj = new Ucn()
    this.taxClassification = ''
  }

  doToggle() {
    this.opened = false
    this.sku = ''
    this.selectCatogory = ''
    this.searchObj = new Ucn()
    this.taxClassification = ''
  }

  /**
   * 生命周期-挂载
   */
  mounted() {
    console.log(this.flag)
    this.zeroSale = true
    this.onBusinessDate(this.businessDate)
    this.$refs.skuRef.focus()
    this.getCatogoryList()
  }
  doEnterSearch() {
    this.onSearch()
  }

  /**
   * 查看
   */
  onCheck(param: any) {
    let type = {
      type: 'SKU',
      id: param.sku.id,
      businessDate: param.businessDate,
      warehouseId: this.warehouse.id! || '',
      warehouseName: this.warehouse.name! || '全部'
    }
    this.$router.push({ name: 'rptSaleSkuDtl', query: type })
  }

  /**
   * 表格合计处理
   * @param param
   * @returns {any}
   */
  getSummaries(param: any) {
    const { columns } = param
    const sums: any = []
    columns.forEach((column: any, index: any) => {
      if (index === 0) {
        sums[index] = '合计'
        return
      }
      if (this.merchantConfig.enableOutputTaxRateSupport && !this.merchantConfig.outputReportOnlyTax) {
        sums[5] = this.summary ? this.summary.qty.toFixed(0) : 0
        sums[6] = this.summary ? this.fmtThumb(this.summary.taxExcAmount.toString()) : 0
        sums[7] = this.summary ? this.fmtThumb(this.summary.amount.toString()) : 0
        sums[10] = this.summary ? this.fmtThumb(this.summary.taxExcGrossAmount.toString()) : 0
        sums[11] = this.summary ? this.fmtThumb(this.summary.grossAmount.toString()) : 0
        sums[12] = (this.summary ? (100 * this.summary.grossRate).toFixed(2) : 0) + '%'
      } else {
        sums[5] = this.summary ? this.summary.qty.toFixed(0) : 0
        sums[6] = this.summary ? this.fmtThumb(this.summary.amount.toString()) : 0
        sums[8] = this.summary ? this.fmtThumb(this.summary.grossAmount.toString()) : 0
        sums[9] = (this.summary ? (100 * this.summary.grossRate).toFixed(2) : 0) + '%'
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

  /**
   * 设置参数
   */
  private setQueryParam() {
    let query = new QueryParam()
    query.limit = 10
    query.start = (this.start - 1) * 10
    query.sorters = this.sort
    // if (this.opened) {
    //   query.filters.push({
    //     'property': 'businessDate:[,]',
    //     'value': this.queryArr[0].length === 0 ? '' : this.queryArr[0]
    //   })
    //   query.filters.push({ 'property': 'skuKeyword:%=%', 'value': this.queryArr[1] ? this.queryArr[1] : '' })
    //   query.filters.push({ 'property': 'skuCategoryCode:=', 'value': this.queryArr[2] ? this.queryArr[2] : '' })
    //   query.filters.push({ 'property': 'notZero:=', 'value': this.queryArr[3] ? '0' : '' })
    // } else {
    //   query.filters.push({
    //     'property': 'businessDate:[,]',
    //     'value': this.queryArr[0].length === 0 ? '' : this.queryArr[0]
    //   })
    //   query.filters.push({ 'property': 'skuKeyword:%=%', 'value': this.queryArr[1] ? this.queryArr[1] : '' })
    // }
    query.filters.push({
      'property': 'businessDate:[,]',
      'value': this.queryArr[0].length === 0 ? '' : this.queryArr[0]
    })
    query.filters.push({ 'property': 'skuKeyword:%=%', 'value': this.queryArr[1] ? this.queryArr[1] : '' })
    query.filters.push({ 'property': 'skuCategory:=', 'value': this.queryArr[2] ? this.queryArr[2] : '' })
    query.filters.push({ 'property': 'notZero:=', 'value': this.queryArr[3] ? '0' : '' })
    query.filters.push({ 'property': 'supplier:=', 'value': this.searchObj ? this.searchObj.id : '' })
    query.filters.push({ 'property': 'warehouseUuid:=', 'value': this.queryArr[4] ? this.queryArr[4] : '' })
    query.filters.push({ 'property': 'taxClassification:%=%', 'value': this.queryArr[5] ? this.queryArr[5] : '' })
    return query
  }

  /**
   * 获取查询列表
   * @param query
   */
  private getSaleRptList(query: any) {
    let loading = Loading.show()
    // todo 调用接口
    SaleReportApi.queryGroupBySku(query).then((resp) => {
      if (resp && resp.success) {
        loading.hide()
        this.tableData = resp.data
        this.summary = resp.summary
        this.totalItem = resp.total
      }
    }).catch((error) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  /**
   * 导出
   */
  private getExport() {
    // todo 调用导出api
    return SaleReportApi.exportSkuList(this.setQueryParam())
  }

  /**
   * 获取类别
   */
  private getCatogoryList() {
    let loading = Loading.show()
    SkuCategoryApi.list().then((resp: any) => {
      if (resp && resp.success) {
        loading.hide()
        this.catogoryList = resp.data
        this.totalItem = resp.total
      }
    }).catch((error: any) => {
      loading.hide()
      this.$message.error(error.message)
    })
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

  setSupplier(supplier: Supplier) {
    if (!supplier) {
      this.searchObj = null
      return
    }
    let ucn = new Ucn()
    ucn.id = supplier.id
    ucn.code = supplier.code
    ucn.name = supplier.name
    this.searchObj = ucn
  }

  onSupplierClear() {
    this.searchObj = null
  }
}
