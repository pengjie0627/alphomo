import { Component, Vue } from 'vue-property-decorator'
import User from 'model/framework/user/User'
import ConstantMgr from 'mgr/ConstantMgr'
import FilterParam from 'model/request/FilterParam'
import Search from 'cmp/Search.vue'
import QueryCondition from 'cmp/QueryCondition.vue'

class PageQueryCondition {
  billNum: string
  billType: string = ''
  businessDate: Date
  settleStatus: string = ''
  createdDate: Date
  businessBillNum: string
  creatorId: string = ''
  manager: string = ''
}

@Component({
  components: {
    Search,
    QueryCondition
  }
})
export default class BusinessRecordSearch extends Vue {
  // 查询数据对象
  queryCondition: PageQueryCondition = new PageQueryCondition()
  supplier: string = ''
  // 界面长度限制
  limits = ConstantMgr.limits.payable
  manager: User = new User()
  creator: User = new User()

  /**
   * 查询参数设置
   */
  doSearch() {
    let filters: FilterParam[] = []
    if (this.queryCondition.billNum) {
      filters.push(new FilterParam('billNum:%=%', this.queryCondition.billNum))
    }
    if (this.queryCondition.settleStatus) {
      filters.push(new FilterParam('settleStatus:=', this.queryCondition.settleStatus))
    }
    if (this.queryCondition.billType) {
      filters.push(new FilterParam('billType:=', this.queryCondition.billType))
    }
    if (this.queryCondition.businessDate) {
      filters.push(new FilterParam('businessDate:[,]', this.queryCondition.businessDate))
    }
    if (this.queryCondition.createdDate) {
      filters.push(new FilterParam('created:[,]', this.queryCondition.createdDate))
    }
    if (this.queryCondition.manager) {
      filters.push(new FilterParam('manager:=', this.queryCondition.manager))
    }
    if (this.queryCondition.creatorId) {
      filters.push(new FilterParam('creatorId:=', this.queryCondition.creatorId))
    }
    this.$emit('setFilters', filters)
  }

  /**
   * 重置搜索条件
   */
  doReset() {
    this.creator = new User()
    this.manager = new User()
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

  mounted() {
    console.log(1)
  }

  onManagerChange(manager: User) {
    this.queryCondition.manager = manager.id!
  }

  onCreatorChange(creator: User) {
    this.queryCondition.creatorId = creator.id!
  }


}
