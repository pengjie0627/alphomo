import { Component, Prop, Vue } from 'vue-property-decorator'
import PurchaseReturn from 'model/purchasereturn/PurchaseReturn'
import QueryParam from 'model/request/QueryParam'
import { DateUtil } from 'fant'
import DetailButton from 'pages/purchasereturn/cmp/PurchaseReturnViewButton.vue'
import { State } from 'vuex-class'
import MerchantConfig from 'model/framework/merchant/MerchantConfig'

@Component({
  components: { DetailButton }
})

export default class PurchaseReturnListTable extends Vue {
  @State('merchantConfig') merchantConfig: MerchantConfig
  @Prop() data: PurchaseReturn[]
  // 节点对象
  $refs: {
    purchaseReturnTable: any
  }
  @Prop() ids: string[]
  @Prop() query: QueryParam

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
   * 表格选择
   * @param val
   */
  doSelectionChange(val: PurchaseReturn[]) {
    this.$emit('selectData', val)
  }

  /**
   * TODO 什么意思？
   * @param params
   * @returns {string}
   */
  getCellClass(params: any) {
    let { columnIndex } = params
    if (columnIndex === 5) {
      return 'red'
    } else {
      return ''
    }
  }

  /**
   * 表格过滤器： 状态
   * @param {string} value
   * @returns {string}
   */
  statusFormatter(value: string) {
    if (value) {
      let statusText: string = ''
      switch (value) {
        case 'UNAUDITED':
          statusText = 'warning'
          break
        case 'AUDITED':
          statusText = 'info'
          break
        case 'PART_RETURNED':
          statusText = 'success'
          break
        case 'RETURNED':
          statusText = 'success'
          break
        case 'ABOLISHED':
          statusText = 'danger'
          break
        default:
          statusText = ''
      }
      return statusText
    } else {
      return ''
    }
  }

  /**
   * 表格过滤器： 结算状态
   * @param {string} value
   * @returns {string}
   */
  settleStatusFormatter(value: string) {
    if (value) {
      let statusText: string = ''
      switch (value) {
        case 'UNSETTLED':
          statusText = 'warning'
          break
        case 'PART_SETTLED':
          statusText = 'info'
          break
        case 'SETTLED':
          statusText = 'success'
          break
        default:
          statusText = ''
      }
      return statusText
    } else {
      return ''
    }
  }

  /**
   * 表格过滤器： 付款状态
   * @param {string} value
   * @returns {string}
   */
  payStatusFormatter(value: string) {
    if (value) {
      let statusText: string = ''
      switch (value) {
        case 'UNPAID':
          statusText = 'warning'
          break
        case 'PART_PAID':
          statusText = 'info'
          break
        case 'PAID':
          statusText = 'success'
          break
        default:
          statusText = ''
      }
      return statusText
    } else {
      return ''
    }
  }

  getList() {
    this.$emit('getList')
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
   * 表格过滤器： 退货额
   * @param row
   * @param column
   * @param {string} value
   * @returns {string}
   */
  priceFormatter(row: any, column: any, value: string) {
    if (value && Number(value) !== 0) {
      return Number(value).toFixed(2)
    } else {
      return '--'
    }
  }

  /**
   * 跳转到详情
   * @param {string} id
   */
  doGoDetail(id: string) {
    this.$router.push({
      name: 'purchaseReturnView', query: { id: id, ids: JSON.stringify(this.ids), query: JSON.stringify(this.query) }
    })
  }
}

PurchaseReturnListTable.filter('status', (value: string) => {
  if (value) {
    let statusText: string = ''
    switch (value) {
      case 'UNAUDITED':
        statusText = '草稿'
        break
      case 'AUDITED':
        statusText = '已审核'
        break
      case 'PART_RETURNED':
        statusText = '部分出库'
        break
      case 'RETURNED':
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
})

PurchaseReturnListTable.filter('settleStatus', (value: string) => {
  if (value) {
    let statusText: string = ''
    switch (value) {
      case 'UNSETTLED':
        statusText = '未结算'
        break
      case 'PART_SETTLED':
        statusText = '部分结算'
        break
      case 'SETTLED':
        statusText = '已结算'
        break
      default:
        statusText = '--'
    }
    return statusText
  } else {
    return '--'
  }
})

PurchaseReturnListTable.filter('payStatus', (value: string) => {
  if (value) {
    let statusText: string = ''
    switch (value) {
      case 'UNPAID':
        statusText = '未付款'
        break
      case 'PART_PAID':
        statusText = '部分付款'
        break
      case 'PAID':
        statusText = '已付款'
        break
      default:
        statusText = '--'
    }
    return statusText
  } else {
    return '--'
  }
})
