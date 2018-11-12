import Vue from 'vue'
import Component from 'vue-class-component'
import QfListContainer from 'cmp/ListContainer.vue'
import QfPageBody from 'cmp/PageBody.vue'
import SaleRptListBusiness from 'pages/report/cmp/SaleRptListBusiness.vue'
import SaleRptListGuest from 'pages/report/cmp/SaleRptListGuest.vue'
import SaleRptListSku from 'pages/report/cmp/SaleRptListSku.vue'
import { DateUtil, Loading } from 'fant'
import { Watch } from 'vue-property-decorator'
import SaleReportApi from 'http/sale/report/SaleReportApi.ts'
import PermissionMgr from 'mgr/PermissionMgr.ts'
import QueryParam from 'model/request/QueryParam'
import WarehouseApi from 'http/basicdata/warehouses/WarehouseApi'
import Warehouse from 'model/basicdata/warehouses/Warehouse'
import Ucn from 'model/entity/Ucn'

@Component({
  name: 'sale-rpt-list',
  components: {
    QfPageBody,
    SaleRptListBusiness,
    SaleRptListGuest,
    SaleRptListSku,
    QfListContainer
  }
})
export default class SaleRptList extends Vue {
  // 业务日期
  businessDate: any = ''
  // 时间
  businessTime = '今天'
  // 类型
  selectName = '按商品统计'
  // 导出参数
  exportFlag = false
  // 销售统计
  sale: any = {
    saleTotal: 0,
    taxExcSaleTotal: 0,
    saleCount: 0,
    saleAmount: 0,
    taxExcSaleAmount: 0,
    saleRate: 0,
    saleMostSku: ''
  }
  // 商品统计标识/客户统计标识/业务统计标识
  flag = 'sku'
  hasPermission = PermissionMgr.hasOptionPermission
  warehouses: Warehouse [] = new Array()
  warehouse: Ucn = new Ucn()
  warehouseId: string = ''
  $refs: {
    query: any
  }

  @Watch('$route')
  onRouteChange(to: any, from: any) {
    if (from.name !== 'rptSaleSkuDtl' && from.name !== 'saleRptList' && to.name === 'saleRptList') {
      this.doReset()
      this.$refs.query.doToggle()
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
    this.businessDate = [DateUtil.clearTime(new Date()), DateUtil.clearTime(new Date())]
    this.businessTime = '今天'
    this.selectName = '按商品统计'
    this.exportFlag = false
    this.sale = {
      saleTotal: 0,
      taxExcSaleTotal: 0,
      saleCount: 0,
      saleAmount: 0,
      taxExcSaleAmount: 0,
      saleRate: 0,
      saleMostSku: ''
    }
    this.flag = 'sku'
    this.warehouse = new Ucn()
    this.warehouseId = ''
  }

  // 日期tab监听
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

  // 日期选择监听
  @Watch('businessDate')
  onBusinessDate(value: any) {
    console.log(value)
    let today: Date = DateUtil.clearTime(new Date())
    let yesterday: Date = DateUtil.clearTime(DateUtil.addDate(new Date(), -1))
    let thisWeek: Date = DateUtil.clearTime(DateUtil.addDate(new Date(), -6))
    let thisMonth: Date = DateUtil.clearTime(DateUtil.addMonth(new Date(), -1))
    if (value === null || value.length === 0) {
      this.businessTime = '全部'
      this.getSummary()
      return
    }
    if (value.length < 2) {
      this.businessTime = ''
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
    this.$forceUpdate()
    this.getSummary()
  }

  /**
   * 统计分类
   */
  @Watch('selectName')
  onSelectNameChange(value: string) {
    switch (value) {
      case '按商品统计':
        this.flag = 'sku'
        break
      case '按客户统计':
        this.flag = 'guest'
        break
      case '按业务统计':
        this.flag = 'business'
        break
    }

  }

  /**
   * 导出
   */
  onExport() {
    // todo 导出
    this.exportFlag = true
  }

  /**
   * 接收导出标识事件
   */
  exportEvent(flag: boolean) {
    this.exportFlag = flag
  }

  beforeMount() {
    this.listWarehouse()
  }

  /**
   * 生命周期方法
   */
  mounted() {
    // 初始化默认为今天
    this.businessDate = [DateUtil.clearTime(new Date()), DateUtil.clearTime(new Date())]
  }

  listWarehouse() {
    WarehouseApi.query(new QueryParam()).then((resp) => {
      this.warehouses = resp.data
    }).catch(e => {
      this.$message.error(e.message)
    })
  }

  /**
   * 获取汇总信息
   */
  private getSummary() {
    // todo 调用汇总接口
    let loading = Loading.show()
    let start: string = ''
    let end: string = ''
    if (this.businessDate === null || this.businessDate.length === 0) {
      start = ''
      end = ''
    } else {
      start = DateUtil.format(new Date(this.businessDate[0]), 'yyyy-MM-dd')
      end = DateUtil.format(new Date(this.businessDate[1]), 'yyyy-MM-dd')
    }
    SaleReportApi.summary(start, end).then((resp: any) => {
      if (resp && resp.success) {
        loading.hide()
        // todo 接口调用后赋值
        this.sale.saleTotal = resp.data.amount
        this.sale.taxExcSaleTotal = resp.data.taxExcAmount
        this.sale.saleCount = resp.data.count
        this.sale.saleAmount = resp.data.grossAmount
        this.sale.taxExcSaleAmount = resp.data.taxExcGrossAmount
        this.sale.saleRate = resp.data.grossRate
        this.sale.saleMostSku = resp.data.maxAmountSku
      }
    }).catch((error: any) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }
}
SaleRptList.filter('fmtThumb', (value: string) => {
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
})
