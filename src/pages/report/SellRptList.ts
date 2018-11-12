import { Component, Vue, Watch } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue' // 面包屑
import ListContainer from 'cmp/ListContainer.vue'
import SellRptListSku from 'pages/report/cmp/SellRptListSku.vue'
import SellRptListSupplier from 'pages/report/cmp/SellRptListSupplier.vue'
import SellRptListBusiness from 'pages/report/cmp/SellRptListBusiness.vue'
import { DateUtil, Loading } from 'fant'
import PurchaseReportApi from 'http/purchase/report/PurchaseReportApi.ts'
import FilterParam from 'model/request/FilterParam'
import QueryParam from 'model/request/QueryParam'
import PermissionMgr from 'mgr/PermissionMgr'
import Ucn from 'model/entity/Ucn'
import Warehouse from 'model/basicdata/warehouses/Warehouse'
import WarehouseApi from 'http/basicdata/warehouses/WarehouseApi'

@Component({
  components: {
    PageBody,
    ListContainer,
    SellRptListSku,
    SellRptListSupplier,
    SellRptListBusiness
  }
})
export default class SellRptList extends Vue {
  // 面包屑菜单
  menu = [{
    name: '进货报表',
    url: '/sellRptList'
  }]
  // 统计数据
  taxExcSellTotal: string = '0.00'
  sellTotal: string = '0.00'
  sellCount: number = 0
  maxAmountSku: string = ''

  selectName: string = '按商品统计'
  // 查询条件
  queries: QueryParam = new QueryParam()
  // 业务日期
  businessDate: Date[] = [DateUtil.clearTime(new Date()), DateUtil.clearTime(new Date())]
  // 时间
  businessTime = '今天'
  hasPermission = PermissionMgr.hasOptionPermission
  warehouses: Warehouse [] = new Array()
  warehouse: Ucn = new Ucn()
  warehouseId: string = ''

  // 组件
  $refs: {
    skuList: any
    supplierList: any
    businessList: any
  }

  @Watch('$route')
  onRouteChange(to: any, from: any) {
    if (from.name !== 'rptSellSkuDtl' && from.name !== 'sellRptList' && to.name === 'sellRptList') {
      this.doReset()
      this.$refs.skuList.doToggle()
    }
  }

  @Watch('warehouseId')
  onWarehouseChange() {
    if (this.warehouseId !== '') {
      this.warehouses.forEach(a => {
        if (a.id === this.warehouseId) {
          this.warehouse.id = this.warehouseId
          this.warehouse.name = a.name
          this.warehouse.code = a.code
        }
      })
    } else {
      this.warehouse = new Ucn()
    }
  }

  doReset() {
    this.taxExcSellTotal = '0.00'
    this.sellTotal = '0.00'
    this.sellCount = 0
    this.maxAmountSku = ''
    this.selectName = '按商品统计'
    this.queries = new QueryParam()
    this.businessDate = [DateUtil.clearTime(new Date()), DateUtil.clearTime(new Date())]
    this.businessTime = '今天'
    this.warehouse = new Ucn()
    this.warehouseId = ''
  }

  beforeMount() {
    let queries = this.queries
    queries.limit = 0
    queries.start = 0
    let f1: FilterParam = new FilterParam('businessDate:[,]', '')
    this.listWarehouse()
    queries.filters.push(f1)
    this.getSummary()
  }

  onExport() {
    if (this.selectName === '按商品统计') {
      this.$refs.skuList.getExport()
    } else if (this.selectName === '按供应商统计') {
      this.$refs.supplierList.getExport()
    } else if (this.selectName === '按业务统计') {
      this.$refs.businessList.getExport()
    }
  }

  @Watch('businessTime')
  onBusinessTimeChange(value: string) {
    let today: Date = DateUtil.clearTime(new Date())
    let yesterday: Date = DateUtil.clearTime(DateUtil.addDate(new Date(), -1))
    let thisWeek: Date = DateUtil.clearTime(DateUtil.addDate(new Date(), -6))
    let thisMonth: Date = DateUtil.clearTime(DateUtil.addMonth(new Date(), -1))
    switch (value) {
      case '今天':
        this.businessDate = [today, today]
        break
      case '昨天':
        this.businessDate = [yesterday, yesterday]
        break
      case '最近7天':
        this.businessDate = [thisWeek, today]
        break
      case '最近1个月':
        this.businessDate = [thisMonth, today]
        break
      case '全部':
        this.businessDate = []
        break
    }
  }

  @Watch('businessDate')
  onBusinessDateChange(value: Date[]) {
    console.log(value)
    let today: Date = DateUtil.clearTime(new Date())
    let yesterday: Date = DateUtil.clearTime(DateUtil.addDate(new Date(), -1))
    let thisWeek: Date = DateUtil.clearTime(DateUtil.addDate(new Date(), -6))
    let thisMonth: Date = DateUtil.clearTime(DateUtil.addDate(new Date(), -30))
    if (value === null || value.length === 0) {
      this.businessTime = '全部'
      this.getSummary()
      return
    }
    if (value.length < 2) {
      this.businessTime = ''
      this.getSummary()
      return
    }
    let end: Date = new Date(value[1])
    let start: Date = new Date(value[0])
    if (end.getTime() === today.getTime()) {
      if (start.getTime() === today.getTime()) {
        this.businessTime = '今天'
      } else if (start.getTime() === thisWeek.getTime()) {
        this.businessTime = '最近7天'
      } else if (start.getTime() === thisMonth.getTime()) {
        this.businessTime = '最近1个月'
      } else {
        this.businessTime = ''
      }
    } else if (start.getTime() === yesterday.getTime() && end.getTime() === yesterday.getTime()) {
      this.businessTime = '昨天'
    } else {
      this.businessTime = ''
    }
    // 查询
    this.$forceUpdate()
    this.getSummary()
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

  listWarehouse() {
    WarehouseApi.query(new QueryParam()).then((resp) => {
      this.warehouses = resp.data
    }).catch(e => {
      this.$message.error(e.message)
    })
  }

  private getSummary() {
    if (this.businessDate === null || this.businessDate.length < 2) {
      let f1: FilterParam = new FilterParam('businessDate:[,]', '')
      this.queries.filters = []
      this.queries.filters.push(f1)
      this.queries.filters[0].value = ''
    } else {
      let f1: FilterParam = new FilterParam('businessDate:[,]', '')
      this.queries.filters = []
      this.queries.filters.push(f1)
      this.queries.filters[0].value = this.businessDate
    }
    let loading = Loading.show()
    PurchaseReportApi.getSummary(this.queries).then((res) => {
      if (res && res.success) {
        loading.hide()
        let taxExcSellTotal: number = res.data.taxExcAmount === null ? 0 : res.data.taxExcAmount
        let sellTotal: number = res.data.amount === null ? 0 : res.data.amount
        this.taxExcSellTotal = this.fmtThumb(taxExcSellTotal.toString())
        this.sellTotal = this.fmtThumb(sellTotal.toString())
        this.sellCount = res.data.count === null ? 0 : res.data.count
        this.maxAmountSku = res.data.maxAmountSku === null ? '-' : res.data.maxAmountSku
      }
    }).catch((err) => {
      loading.hide()
      this.$message.error(err.message)
    })
    // if (this.selectName === '按商品统计') {
    //   this.$refs.skuList.date = this.businessDate
    //   this.$refs.skuList.getList()
    // } else if (this.selectName === '按供应商统计') {
    //   this.$refs.supplierList.date = this.businessDate
    //   this.$refs.supplierList.getList()
    // } else if (this.selectName === '按业务统计') {
    //   this.$refs.businessList.date = this.businessDate
    //   this.$refs.businessList.getList()
    // }
  }
}
