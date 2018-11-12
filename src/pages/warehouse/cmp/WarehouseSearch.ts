import { Component, Vue } from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import ConstantMgr from 'mgr/ConstantMgr'
import FilterParam from 'model/request/FilterParam'
import SkuSearch from 'cmp/Search.vue'

// 查询数据对象
class ModelQueryCondition {
  keyword: string = '' //
  category: string = '' //
}

@Component({
  name: 'WarehouseSearch',
  components: {
    QueryCondition,
    SkuSearch
  }
})
export default class WarehouseSearch extends Vue {
  // 查询数据对象
  queryCondition: ModelQueryCondition = new ModelQueryCondition()
  // 界面长度限制
  limits = ConstantMgr.limits.supplier

  /**
   * 查询参数设置
   */
  doSearch() {
    let filters: FilterParam[] = []
    if (this.queryCondition.keyword) {
      filters.push(new FilterParam('keyword:%=%', this.queryCondition.keyword))
    }
    if (this.queryCondition.category) {
      filters.push(new FilterParam('category:=', this.queryCondition.category))
    }
    this.$emit('setFilters', filters)
  }

  onReset() {
    let filters: FilterParam[] = []
    this.queryCondition = new ModelQueryCondition()
    this.$emit('setFilters', filters)
  }
  doEnterSearch() {
    this.doSearch()
  }

}

