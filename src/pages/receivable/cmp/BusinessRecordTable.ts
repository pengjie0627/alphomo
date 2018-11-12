import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Payable from 'model/statement/payable/Payable'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  components: {}
})
export default class BusinessRecordTable extends Vue {
  @Prop() data: Payable[]
  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限

  @Watch('data')
  watchData(value: Array<Payable>) {
    this.data = value
  }

  mounted() {
    this.watchData(this.data)
  }

  /**
   * 表格过滤器： 状态
   * @param row
   * @param column
   * @param {string} value
   * @returns {string}
   */

  settleFormatter(row: any, column: any, value: string) {
    if (value) {
      let statusText: string = ''
      switch (value) {
        case 'UNSETTLED':
          statusText = '未核销'
          break
        case 'PART_SETTLED':
          statusText = '部分核销'
          break
        case 'SETTLED':
          statusText = '已核销'
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
   * 表格过滤器： 业务时间
   * @param row
   * @param column
   * @param {string} value
   * @returns {string}
   */
  dateFormatter(row: any, column: any, value: string) {
    if (value) {
      console.log(value)
      let date = value.split(' ')[0]
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
   * 表格排序条件
   */
  doSortChange({ column, prop, order }: any) {
    order === 'ascending' ? (order = 'ASC') : (order = 'DESC')
    let sorters = []
    column && prop && order && sorters.push({ 'property': prop, 'direction': order })
    this.$emit('setSorters', sorters)
  }

  billTypeFormatter(row: any, column: any, value: string) {
    if (value) {
      let statusText: string = ''
      switch (value) {
        case 'OtherPaymentLine':
          statusText = '其他支出'
          break
        case 'OtherReceiptLine':
          statusText = '其他收入'
          break
        case 'Purchase':
          statusText = '进货'
          break
        case 'PurchaseReturn':
          statusText = '进货退货'
          break
        case 'Sale':
          statusText = '销售'
          break
        case 'SaleReturn':
          statusText = '销售退货'
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
   * 跳转到详情
   * @param {string} id
   */
  doGoDetail(id: string, type: string) {
    if (type === 'Sale') {
      this.$router.push({ name: 'saleView', query: { id: id } })
    } else {
      this.$router.push({ name: 'saleReturnView', query: { id: id } })
    }
  }
}
BusinessRecordTable.filter('price', (value: string) => {
  if (value && Number(value) !== 0) {
    return Number(value).toFixed(2)
  } else {
    return '0.00'
  }
})
