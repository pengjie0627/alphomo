import { Component, Vue } from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import ConstantMgr from 'mgr/ConstantMgr'
import FilterParam from 'model/request/FilterParam'
import SkuSearch from 'cmp/Search.vue'

// 查询数据对象
class ModelQueryCondition {
  keyword: string = '' //
}

@Component({
  name: 'CustomerSearch',
  components: {
    QueryCondition,
    SkuSearch
  }
})
export default class LogisticsSearch extends Vue {
  // 查询数据对象
  queryCondition: ModelQueryCondition = new ModelQueryCondition()
  // 界面长度限制
  limits = ConstantMgr.limits.logisticscompany

  /**
   * 查询参数设置
   */
  doSearch() {
    let filters: FilterParam[] = []
    if (this.queryCondition.keyword) {
      filters.push(new FilterParam('keyword:%=%', this.queryCondition.keyword))
    }
    this.$emit('setFilters', filters)
  }
  doEnterSearch() {
    this.doSearch()
  }
}

