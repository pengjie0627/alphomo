import { Component, Vue } from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import ConstantMgr from 'mgr/ConstantMgr'
import FilterParam from 'model/request/FilterParam'

// 查询数据对象
class ModelQueryCondition {
  keywords: string = '' //
}

@Component({
  name: 'ShopSearch',
  components: {
    QueryCondition,
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
    this.$emit('setFilters', filters)
  }
  doEnterSearch() {
    this.doSearch()
  }

}

