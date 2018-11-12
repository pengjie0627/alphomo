import { Component, Prop, Vue } from 'vue-property-decorator'
import { DateUtil } from 'fant'
import PayableReport from 'model/statement/payable/PayableReport'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  components: {}
})
export default class PayableListTable extends Vue {
  @Prop() data: PayableReport[]
  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限

  /**
   * 表格过滤器： 状态
   * @param row
   * @param column
   * @param {string} value
   * @returns {string}
   */
  statusFormatter(row: any, column: any, value: string) {
    if (value) {
      let statusText: string = ''
      switch (value) {
        case 'UNAUDITED':
          statusText = '未审核'
          break
        case 'AUDITED':
          statusText = '已审核'
          break
        case 'PART_DELIVERED':
          statusText = '部分出库'
          break
        case 'DELIVERED':
          statusText = '已出库'
          break
        case 'ABOLISHED':
          statusText = '已作废'
          break
        default:
          statusText = '--'
      }
      return statusText
    } else {
      return '--'
    }
  }

  /**
   * 表格排序条件
   */
  doSortChange({ column, prop, order }: any) {
    order === 'ascending' ? (order = 'ASC') : (order = 'DESC')
    let sorters = []
    column && prop && order && sorters.push({ 'property': prop, 'direction': order })
    this.$emit('setSorters', sorters)
  }

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
   * 表格过滤器： 销售额
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
   * 跳转到详情
   * @param {string} id
   */
  doGoDetail(id: string, name: string, code: string) {
    this.$router.push({ name: 'receivableView', query: { id: id, name: name, code: code } })
  }
}
