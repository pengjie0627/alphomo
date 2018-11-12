import Vue from 'vue'
import Component from 'vue-class-component'
import PageBody from 'cmp/PageBody.vue'
import { DateUtil, Loading } from 'fant'
import { Watch } from 'vue-property-decorator'
import InventoryReportApi from 'http/inventory/report/InventoryReportApi' // 面包屑
import StorageRptListSku from 'pages/report/cmp/StorageRptListSku.vue'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  name: 'storage-rpt-list',
  components: {
    PageBody,
    StorageRptListSku
  }
})
export default class StorageRptList extends Vue {
  // 面包屑菜单
  menu = [{
    name: '库存报表',
    url: '/storageRptList'
  }]
  amount: string = '0.00'
  taxExcAmount: string = '0.00'
  maxAmountSku: string = '-'
  amountOfMaxAmountSku: string = '0.00'
  percentOfMaxAmountSku: string = '0.00%'
  hasPermission = PermissionMgr.hasOptionPermission

  // 业务日期
  businessDate: any = DateUtil.clearTime(new Date())
  // 时间
  businessTime = '今天'
  // 组件
  $refs: {
    storageList: any
  }

  @Watch('$route')
  onRouteChange(to: any, from: any) {
    if (from.name !== 'rptStorageSkuDtl' && from.name !== 'storageRptList' && to.name === 'storageRptList') {
      this.doReset()
      this.$refs.storageList.doToggle()
    }
  }

  doReset() {
    this.businessDate = DateUtil.clearTime(new Date())
    this.businessTime = '今天'
    this.amount = '0.00'
    this.taxExcAmount = '0.00'
    this.maxAmountSku = '-'
    this.amountOfMaxAmountSku = '0.00'
    this.percentOfMaxAmountSku = '0.00%'
    this.getSummary()
  }

  mounted() {
    this.getSummary()
  }

  onExport() {
    this.$refs.storageList.getExport()
  }

  @Watch('businessTime')
  onBusinessTimeChange(value: string) {
    let todayDate = DateUtil.format(new Date(), 'yyyy-MM-dd').toString()
    let yestodayDate = DateUtil.format(DateUtil.addDate(new Date(), -1), 'yyyy-MM-dd').toString()
    switch (value) {
      case '今天':
        this.businessDate = todayDate
        break
      case '昨天':
        this.businessDate = yestodayDate
        break
    }
  }

  @Watch('businessDate')
  onBusinessDateChange(value: Date) {
    console.log(value)
    if (value) {
      let selectDate = value.toString()
      let todayDate = DateUtil.format(new Date(), 'yyyy-MM-dd').toString()
      let yestodayDate = DateUtil.format(DateUtil.addDate(new Date(), -1), 'yyyy-MM-dd').toString()
      console.log(selectDate)
      console.log(todayDate)
      console.log(yestodayDate)
      if (selectDate === todayDate) {
        this.businessTime = '今天'
      } else if (selectDate === yestodayDate) {
        this.businessTime = '昨天'
      } else {
        this.businessTime = ''
      }
      // 查询
      this.$forceUpdate()
      this.getSummary()
    }
  }

  private getSummary() {
    let start: string = ''
    let end: string = ''
    if (this.businessDate === null) {
      //
    } else {
      start = DateUtil.format(new Date(this.businessDate), 'yyyy-MM-dd')
      end = DateUtil.format(new Date(this.businessDate), 'yyyy-MM-dd')
    }
    let loading = Loading.show()
    InventoryReportApi.total(start, end).then((res) => {
      if (res && res.success) {
        loading.hide()
        let amount: number = res.data.amount === null ? 0 : res.data.amount
        let taxExcAmount: number = res.data.taxExcAmount === null ? 0 : res.data.taxExcAmount
        this.amount = this.fmtThumb(amount.toString())
        this.taxExcAmount = this.fmtThumb(taxExcAmount.toString())
        this.maxAmountSku = res.data.maxAmountSku || '-'
        let amountOfMaxAmountSku: number = res.data.amountOfMaxAmountSku === null ? 0 : res.data.amountOfMaxAmountSku
        this.amountOfMaxAmountSku = this.fmtThumb(amountOfMaxAmountSku.toString())
        this.percentOfMaxAmountSku = (res.data.rateOfMaxAmountSku * 100).toFixed(2).toString() + '%'
      }
    }).catch((err) => {
      loading.hide()
      this.$message.error(err.message)
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
}
