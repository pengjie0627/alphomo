import { Component, Vue } from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import ConstantMgr from 'mgr/ConstantMgr'
import FilterParam from 'model/request/FilterParam'
import SkuSearch from 'cmp/Search.vue'

// 查询数据对象
class ModelQueryCondition {
  keywords: string = '' //
  code: string = '' // 客户编号
  name: string = '' // 客户名称
  category: string = '' // 客户类型
  contact: string = '' // 联系人
  mobile: string = '' // 联系电话
  email: string = '' // 邮箱
}

@Component({
  name: 'CustomerSearch',
  components: {
    QueryCondition,
    SkuSearch
  }
})
export default class SaleListSearch extends Vue {
  // 查询数据对象
  queryCondition: ModelQueryCondition = new ModelQueryCondition()
  // 界面长度限制
  limits = ConstantMgr.limits.customer

  /**
   * 查询参数设置
   */
  doSearch() {
    let filters: FilterParam[] = []
    if (this.queryCondition.keywords) {
      filters.push(new FilterParam('keywords:%=%', this.queryCondition.keywords))
    }
    if (this.queryCondition.code) {
      filters.push(new FilterParam('code:%=%', this.queryCondition.code))
    }
    if (this.queryCondition.name) {
      filters.push(new FilterParam('name:%=%', this.queryCondition.name))
    }
    if (this.queryCondition.category) {
      filters.push(new FilterParam('category:=', this.queryCondition.category))
    }
    if (this.queryCondition.contact) {
      filters.push(new FilterParam('contactInfoContact:%=%', this.queryCondition.contact))
    }
    if (this.queryCondition.mobile) {
      filters.push(new FilterParam('contactInfoMobile:=', this.queryCondition.mobile))
    }
    if (this.queryCondition.email) {
      filters.push(new FilterParam('contactInfoEmail:%=%', this.queryCondition.email))
    }
    this.$emit('setFilters', filters)
  }

  /**
   * 重置搜索条件
   */
  doReset() {
    let filters: FilterParam[] = []
    this.queryCondition = new ModelQueryCondition()
    this.$emit('resetFilters', filters)
  }

  /**
   * 展开与收起
   * @param {boolean} flag
   */
  doToggle(flag: boolean) {
    this.queryCondition = new ModelQueryCondition()
  }
  doEnterSearch() {
    this.doSearch()
  }
}

