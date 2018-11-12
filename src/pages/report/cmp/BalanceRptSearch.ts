import { Component, Vue, Watch } from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import FilterParam from 'model/request/FilterParam'

class BalanceQueryCondition {
  billNum: string = '' // 单号
  billType: string = '' // 收支类型
  businessDate: string = '' // 业务日期
  csId: string = '' // 业务对象
  csName: string = '' // 业务对象
  created: string = '' // 制单时间
}

@Component({
  name: 'BalanceRptSearch',
  components: {
    QueryCondition
  }
})

export default class BalanceRptSearch extends Vue {
  // 面包屑菜单
  menu = [{
    name: '收支流水',
    url: '/balanceRptList'
  }]

  // 查询数据对象
  queryCondition: BalanceQueryCondition = new BalanceQueryCondition()
  businessTime: string = ''

  $refs: {
    query: any
  }

  @Watch('$route')
  onRouteChange(to: any, from: any) {
    if (from.name !== 'payBillView' && from.name !== 'receiptBillView' && from.name !== 'balanceRptList' && to.name === 'receiptBillView') {
      this.doReset()
      this.$refs.query.doToggle()
    }
  }

  /**
   * 设置查询条件
   */
  doSearch() {
    let filters: FilterParam[] = []
    if (this.queryCondition.billNum) {
      filters.push({ 'property': 'billNum:%=%', 'value': this.queryCondition.billNum })
    }
    if (this.queryCondition.billType) {
      filters.push({ 'property': 'billType:=', 'value': this.queryCondition.billType })
    }
    if (this.queryCondition.businessDate) {
      filters.push({ 'property': 'businessDate:[,]', 'value': this.queryCondition.businessDate })
    }
    if (this.queryCondition.csName) {
      filters.push({ 'property': 'csName:%=%', 'value': this.queryCondition.csName })
    }
    if (this.queryCondition.created) {
      filters.push({ 'property': 'created:[,]', 'value': this.queryCondition.created })
    }
    this.$emit('setFilters', filters)
  }

  /**
   * 重置搜索条件
   */
  doReset() {
    let filters: FilterParam[] = []
    this.queryCondition = new BalanceQueryCondition()
    this.$emit('setFilters', filters)
  }

  /**
   * 展开与收起
   * @param {boolean} flag
   */
  doToggle(flag: boolean) {
    this.queryCondition = new BalanceQueryCondition()
  }

  doEnterSearch() {
    this.doSearch()
  }
}
