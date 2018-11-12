import { Component, Vue } from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import PermissionMgr from 'mgr/PermissionMgr'

// 销售单查询数据对象
class SellRptListSearchCondition {
  businessDateFrom: string = '' // 业务时间
  businessDateTo: string = '' // 业务时间
}

@Component({
  components: {
    QueryCondition
  }
})

export default class InventoryListSearch extends Vue {
  // 查询数据对象
  queryCondition: SellRptListSearchCondition = new SellRptListSearchCondition()
  // 业务日期
  businessDate = ''
  // 时间
  businessTime = '今天'
  hasPermission = PermissionMgr.hasOptionPermission


  changeTime() {
    console.log('changeTime')
  }

}
