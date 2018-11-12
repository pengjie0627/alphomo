import { Component, Prop, Vue } from 'vue-property-decorator'
import { DateUtil } from 'fant'
import StatementReport from 'model/statement/StatementReport'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  components: {}
})
export default class BalanceRptTable extends Vue {

  // 表格数据
  @Prop()
  tableData: StatementReport[]
  hasPermission = PermissionMgr.hasOptionPermission

  /**
   * 表格过滤器： 业务时间
   * @param row
   * @param column
   * @param {string} value
   * @returns {string}
   */
  dateFormatter(row: any, column: any, value: string) {
    if (value) {
      let date = DateUtil.format(new Date(value), 'yyyy-MM-dd')
      return date
    } else {
      return '--'
    }
  }

  /**
   * 表格过滤器：
   * @param row
   * @param column
   * @param {string} value
   * @returns {string}
   */
  priceFormatter(row: any, column: any, value: string) {
    if (value && Number(value) !== 0) {
      return Number(value).toFixed(2)
    } else {
      return '0.00'
    }
  }

  /**
   * 表格过滤器： 业务类型
   */
  billTypeFormatter(row: any, column: any, value: string) {
    if (value) {
      let billText: string = ''
      switch (value) {
        case 'payment':
          billText = '支出'
          break
        case 'receipt':
          billText = '收入'
          break
        default:
          billText = '--'
      }
      return billText
    } else {
      return '--'
    }
  }

  getCellClass() {
    return ''
  }

  /**
   * 跳转详情页面
   */
  doGoDetail(id: any, value: string) {
    this.$emit('toView', id, value)
  }
}
