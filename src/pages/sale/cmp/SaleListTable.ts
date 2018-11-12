import { Component, Prop, Vue } from 'vue-property-decorator'
import Sale from 'model/sale/Sale'
import { DateUtil } from 'fant'
import SaleViewButton from 'pages/sale/cmp/SaleViewButton.vue'
import QueryParam from 'model/request/QueryParam'
import PermissionMgr from 'mgr/PermissionMgr'
import { State } from 'vuex-class'
import MerchantConfig from 'model/framework/merchant/MerchantConfig'

@Component({
  components: { SaleViewButton }
})
export default class SaleListTable extends Vue {
  @State('merchantConfig') merchantConfig: MerchantConfig
  @Prop() data: Sale[]
  // 节点对象
  $refs: {
    skuTable: any
  }
  @Prop() ids: string[]
  @Prop() query: QueryParam

  // 权限
  hasPermissions: Function = PermissionMgr.hasPermissions

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
  doSelectionChange(val: Sale[]) {
    this.$emit('selectData', val)
  }

  getList() {
    this.$emit('getList')
  }

  /**
   * 表格过滤器： 状态
   * @param row
   * @param column
   * @param {string} value
   * @returns {string}
   */
  sourceFormatter(row: any, column: any, value: string) {
    let statusText: string = ''
    switch (value) {
      case '':
        statusText = '新建'
        break
      case null:
        statusText = '新建'
        break
      case 'alphamo':
        statusText = '新建'
        break
      case 'cloud_scm':
        if (row.externalBill) {
          if (row.externalBill.billType === 'Order') {
            statusText = '商城'
          }
          if (row.externalBill.billType === 'CarSale') {
            statusText = '车销'
          }
        }
        break
      case 'dpos':
        statusText = '零售'
        break
      default:
        statusText = '--'
    }
    return statusText
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
        case 'PART_DELIVERED':
          statusText = 'success'
          break
        case 'DELIVERED':
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
      return '--'
    }
  }

  /** ALPHAMO1202:从掌柜同步而来的直营门店销售单，客户字段建议显示"--" */
  customerFormatter(row: any, column: any, value: string) {
    if (row.externalBill.source === 'dpos') {
      return '--'
    } else {
      return value
    }
  }

  getCellClass(params: any) {
    let { columnIndex } = params
    if (columnIndex === 5) {
      return 'red'
    } else {
      return ''
    }
  }

  /**
   * 跳转到详情
   * @param {string} id
   */
  doGoSaleView(id: string) {
    this.$router.push({
      name: 'saleView', query: { id: id }, params: { ids: JSON.stringify(this.ids), query: JSON.stringify(this.query) }
    })
  }
}

SaleListTable.filter('status', (value: string) => {
  if (value) {
    let statusText: string = ''
    switch (value) {
      case 'UNAUDITED':
        statusText = '草稿'
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
})
