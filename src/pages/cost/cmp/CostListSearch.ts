import { Component, Vue } from 'vue-property-decorator'
import ConstantMgr from 'mgr/ConstantMgr'
import FilterParam from 'model/request/FilterParam'
import User from 'model/framework/user/User'

// 列表查询数据对象
class PageQueryCondition {
  remarks: string
  businessDate: Date
  manager: User
  billNo: string
  payStatus: string
  billStatus: string
  payType: string
}

@Component({
  components: {}
})
export default class CostList extends Vue {
  // 查询数据对象
  queryCondition: PageQueryCondition = new PageQueryCondition()
  // 界面长度限制
  limits = ConstantMgr.limits.payable

  doSearch() {
    let filters: FilterParam[] = []
    if (this.queryCondition.billNo) {
      filters.push(new FilterParam('billNo:[,]', this.queryCondition.billNo))
    }
    if (this.queryCondition.businessDate) {
      filters.push(new FilterParam('businessDate:[,]', this.queryCondition.businessDate))
    }
    if (this.queryCondition.manager) {
      filters.push(new FilterParam('manager:%=%', this.queryCondition.manager))
    }
    if (this.queryCondition.payStatus) {
      filters.push(new FilterParam('payStatus:%=%', this.queryCondition.payStatus))
    }
    if (this.queryCondition.payType) {
      filters.push(new FilterParam('payType:%=%', this.queryCondition.payType))
    }
    if (this.queryCondition.billStatus) {
      filters.push(new FilterParam('billStatus:%=%', this.queryCondition.billStatus))
    }
    if (this.queryCondition.remarks) {
      filters.push(new FilterParam('keywords:%=%', this.queryCondition.remarks))
    }
    this.$emit('setFilters', filters)
  }

  /**
   * 重置搜索条件
   */
  doReset() {
    this.queryCondition.manager = new User()
    let filters: FilterParam[] = []
    this.queryCondition = new PageQueryCondition()
    this.$emit('resetFilters', filters)
  }

  /**
   * 展开与收起
   * @param {boolean} flag
   */
  doToggle(flag: boolean) {
    this.queryCondition = new PageQueryCondition()
  }
}
