import { Component, Vue, Watch } from 'vue-property-decorator'
import QfListContainer from 'cmp/ListContainer.vue'
import QfPageBody from 'cmp/PageBody.vue'
import SaleRptDtlBill from 'pages/report/cmp/SaleRptDtlBill.vue'
import SaleRptDtlGuest from 'pages/report/cmp/SaleRptDtlGuest.vue'
import SaleRptDtlSku from 'pages/report/cmp/SaleRptDtlSku.vue'
import SaleRptDtlWater from 'pages/report/cmp/SaleRptDtlWater.vue'
import CustomerApi from 'http/basicdata/customer/CustomerApi.ts'
import SkuApi from 'http/basicdata/sku/SkuApi'
import { DateUtil } from 'fant'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  name: 'rpt-sale-sku-dtl',
  components: {
    QfListContainer,
    QfPageBody,
    SaleRptDtlBill,
    SaleRptDtlGuest,
    SaleRptDtlSku,
    SaleRptDtlWater
  }
})
export default class RptSaleSkuDtl extends Vue {
  businessDate: any[] = []
  type: string = ''
  totalType = 'business' // 统计维度
  businessType = '' // 业务类型
  source = '' // 来源
  titleName = ''
  titleCode = ''
  warehouse: string = '' // 仓库名，参数
  warehouseId: string = '' // 仓库id
  id = ''
  passParams: any = {}
  skuOrGuestInfo = ''
  queryArr: any[] = []
  exportFlag = false
  menu = [{
    name: '销售报表',
    url: '/saleRptList'
  }, {
    name: '销售详情'
  }]
  hasPermission = PermissionMgr.hasOptionPermission

  @Watch('totalType')
  onTitalTypeChange(value: string) {
    // todo
    if (value === 'BUSINESS') { // 流水
      // todo
      this.queryArr = []
      this.queryArr[0] = this.id // id
      this.queryArr[1] = this.skuOrGuestInfo // 单据
      this.queryArr[2] = this.businessType // 业务类型
      this.queryArr[3] = this.source // 来源
    } else {
      this.queryArr = []
      this.queryArr[0] = this.id // id
      this.queryArr[1] = this.businessDate // 日期
      this.queryArr[2] = this.skuOrGuestInfo // 单据编号或者或者
      this.queryArr[3] = this.totalType // 统计维度
    }
    this.queryArr[4] = this.warehouseId
  }

  mounted() {
    let params: any = this.$route.query
    this.warehouse = params!.warehouseName! || '全部'
    this.warehouseId = params!.warehouseId! || ''
    this.type = params!.type
    this.id = params.id
    this.$set(this.menu[1], 'name', this.type === 'SKU' ? '商品详情' : (this.type === 'GUEST' ? '客户详情' : '单据流水'))
    // 设置日期
    let date = params!.businessDate
    if (date) {
      let oDate = DateUtil.format(new Date(date), 'yyyy-MM-dd')
      this.businessDate = [oDate + ' 00:00:00', oDate + ' 00:00:00']
    }
    if (this.type === 'BUSINESS') {
      this.titleName = '单据流水'
      this.titleCode = `销售单：${params.saleCount}；销售退货单：${params.returnCount}`
      this.queryArr = []
      this.queryArr[0] = this.businessDate // id
      this.queryArr[1] = this.skuOrGuestInfo // 单据
      this.queryArr[2] = this.businessType // 业务类型
      this.queryArr[3] = this.source // 来源
    } else if (this.type === 'SKU') {
      // 初始化
      this.queryArr = []
      this.queryArr[0] = this.id // id
      this.queryArr[1] = this.businessDate // 日期
      this.queryArr[2] = this.skuOrGuestInfo // 单据编号
      this.queryArr[3] = this.totalType // 统计维度
      SkuApi.getThin(this.id).then((res) => {
        if (res && res.success && res.data) {
          this.titleName = res.data!.name + ''
          this.titleCode = res.data!.barcode!
        }
      }).catch((err) => {
        this.$message.error(err.message)
      })
    } else if (this.type === 'GUEST') {
      // 初始化
      this.queryArr = []
      this.queryArr[0] = this.id // id
      this.queryArr[1] = this.businessDate // 日期
      this.queryArr[2] = this.skuOrGuestInfo // 单据编号
      this.queryArr[3] = this.totalType // 统计维度
      CustomerApi.getThin(this.id).then((res) => {
        if (res && res.success && res.data) {
          this.titleName = res.data!.name!
          this.titleCode = '联系方式：' + res.data!.mobile!
        }
      }).catch((err) => {
        this.$message.error(err.message)
      })
    }
    this.queryArr[4] = this.warehouseId
  }

  goBack() {
    this.$router.back()
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

  onSearch() {
    // <!--单据(商品-业务)(客户-业务)-->
    if ((this.type === 'SKU' && this.totalType === 'business') || (this.type === 'GUEST' && this.totalType === 'business')) {
      // todo
      this.queryArr = []
      this.queryArr[0] = this.id // id
      this.queryArr[1] = this.businessDate // 日期
      this.queryArr[2] = this.skuOrGuestInfo // 单据编号
      this.queryArr[3] = this.totalType // 统计维度
    }
    // <!--客户(商品-客户)-->
    if (this.type === 'SKU' && this.totalType === 'guest') {
      // todo
      this.queryArr = []
      this.queryArr[0] = this.id // id
      this.queryArr[1] = this.businessDate // 日期
      this.queryArr[2] = this.skuOrGuestInfo // 客户名称
      this.queryArr[3] = this.totalType // 统计维度
    }
    // <!--商品（客户-商品）-->
    if (this.type === 'GUEST' && this.totalType === 'sku') {
      // todo
      this.queryArr = []
      this.queryArr[0] = this.id // id
      this.queryArr[1] = this.businessDate // 日期
      this.queryArr[2] = this.skuOrGuestInfo // 商品名称
      this.queryArr[3] = this.totalType // 统计维度
    }
    // <!--流水-->
    if (this.type === 'BUSINESS') {
      // todo
      this.queryArr = []
      this.queryArr[0] = this.businessDate // id
      this.queryArr[1] = this.skuOrGuestInfo // 单据
      this.queryArr[2] = this.businessType // 业务类型
      this.queryArr[3] = this.source // 来源
    }
    this.queryArr[4] = this.warehouseId
  }

  onReset() {
    // todo 重置
    this.skuOrGuestInfo = ''
    this.businessType = ''
    this.source = ''
    this.onSearch()
  }
}
