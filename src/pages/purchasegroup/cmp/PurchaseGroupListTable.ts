import Vue from 'vue'
import Component from 'vue-class-component'
import QueryParam from 'model/request/QueryParam'
import Dictionary from 'model/basicdata/dictionary/Dictionary'
import { Prop } from 'vue-property-decorator'

@Component({
  components: {}
})

export default class PurchaseGroupListTable extends Vue {
  @Prop() data: Dictionary[]
  // 节点对象
  @Prop() ids: string[]
  @Prop() query: QueryParam

  /**
   * 表格选择
   * @param val
   */
  doSelectionChange(val: Dictionary[]) {
    this.$emit('selectData', val)
  }

  getList() {
    this.$emit('getList')
  }
}

