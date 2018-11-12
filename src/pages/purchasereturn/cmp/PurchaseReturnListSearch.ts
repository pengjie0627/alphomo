import { Component, Vue, Watch } from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import ConstantMgr from 'mgr/ConstantMgr'
import FilterParam from 'model/request/FilterParam'

// 销售单查询数据对象
class PurchaseReturnQueryCondition {
  warehouse: string = '' // 仓库
  supplierName: string = '' // 供应商
  creatorName: string = '' // 制单人
  sku: string = '' // 包含商品
  billNumber: string = '' // 单据编号
  businessDate: string = '' // 业务时间
  status: string = '' // 状态
  keyword: string = '' //
  payStatus: string = '' // 付款状态
  settleStatus: string = '' // 结算状态
}

@Component({
  components: {
    QueryCondition
  }
})

export default class PurchaseReturnListSearch extends Vue {
  // 查询数据对象
  queryCondition: PurchaseReturnQueryCondition = new PurchaseReturnQueryCondition()
  // 界面长度限制
  limits = ConstantMgr.limits.purchaseReturn

  $refs: {
    query: any
  }

  @Watch('$route')
  onRouteChange(to: any, from: any) {
    if (from.name !== 'purchaseReturnView' && from.name !== 'purchaseReturnList' && to.name === 'purchaseReturnList') {
      this.doReset()
      this.$refs.query.doToggle()
    }
  }

  /**
   * 查询参数设置
   */
  doSearch() {
    let filters: FilterParam[] = []
    if (this.queryCondition.keyword) {
      filters.push({ 'property': 'keyword:%=%', 'value': this.queryCondition.keyword })
    }
    if (this.queryCondition.billNumber) {
      filters.push({ 'property': 'billNum:%=%', 'value': this.queryCondition.billNumber })
    }
    if (this.queryCondition.businessDate) {
      filters.push(new FilterParam('businessDate:[,]', this.queryCondition.businessDate))
    }
    if (this.queryCondition.status) {
      filters.push({ 'property': 'status:=', 'value': this.queryCondition.status })
    }
    if (this.queryCondition.warehouse) {
      filters.push({ 'property': 'warehouse:=', 'value': this.queryCondition.warehouse })
    }
    if (this.queryCondition.supplierName) {
      filters.push({ 'property': 'supplierName:%=%', 'value': this.queryCondition.supplierName })
    }
    if (this.queryCondition.creatorName) {
      filters.push({ 'property': 'creatorName:%=%', 'value': this.queryCondition.creatorName })
    }
    if (this.queryCondition.sku) {
      filters.push({ 'property': 'sku:in', 'value': this.queryCondition.sku })
    }
    if (this.queryCondition.payStatus) {
      filters.push({ 'property': 'payStatus:=', 'value': this.queryCondition.payStatus })
    }
    if (this.queryCondition.settleStatus) {
      filters.push({ 'property': 'settleStatus:=', 'value': this.queryCondition.settleStatus })
    }
    this.$emit('setFilters', filters)
  }

  /**
   * 重置搜索条件
   */
  doReset() {
    let filters: FilterParam[] = []
    this.queryCondition = new PurchaseReturnQueryCondition()
    this.$emit('resetFilters', filters)
  }

  /**
   * 展开与收起
   * @param {boolean} flag
   */
  doToggle(flag: boolean) {
    this.queryCondition = new PurchaseReturnQueryCondition()
  }

  /**
   * 回车查询
   */
  doEnterSearch() {
    this.doSearch()
  }
}
