import { Component, Vue, Watch } from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import ConstantMgr from 'mgr/ConstantMgr'
import FilterParam from 'model/request/FilterParam'
import Search from 'cmp/Search.vue'
// import { DateUtil } from 'fant'

// 列表查询数据对象
class PageQueryCondition {
  businessDate: Date
  customer: string
}

@Component({
  components: {
    QueryCondition,
    Search
  }
})
export default class PayableListSearch extends Vue {
  // 查询数据对象
  queryCondition: PageQueryCondition = new PageQueryCondition()
  // 界面长度限制
  limits = ConstantMgr.limits.receivable
  checkbox: boolean = true

  $refs: {
    query: any
  }

  @Watch('$route')
  onRouteChange(to: any, from: any) {
    if (from.name !== 'receivableView' && from.name !== 'receivableList' && to.name === 'receivableList') {
      this.doReset()
      this.$refs.query.doToggle()
    }
  }

  /**
   * 查询参数设置
   */
  doSearch() {
    let filters: FilterParam[] = []
    if (this.queryCondition.businessDate) {
      filters.push(new FilterParam('businessDate:[,]', this.queryCondition.businessDate))
    }
    if (this.queryCondition.customer) {
      filters.push(new FilterParam('customer:%=%', this.queryCondition.customer))
    }
    if (this.checkbox) {
      filters.push(new FilterParam('amount:!=', 0))
    }
    this.$emit('setFilters', filters)
  }

  /**
   * 重置搜索条件
   */
  doReset() {
    let filters: FilterParam[] = []
    this.queryCondition = new PageQueryCondition()
    this.checkbox = true
    if (this.checkbox) {
      filters.push(new FilterParam('amount:!=', 0))
    }
    this.$emit('resetFilters', filters)
  }

  /**
   * 展开与收起
   * @param {boolean} flag
   */
  doToggle(flag: boolean) {
    this.queryCondition = new PageQueryCondition()
  }

  doEnterSearch() {
    this.doSearch()
  }
}

