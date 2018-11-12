import { Component, Prop, Vue } from 'vue-property-decorator'
import { DateUtil } from 'fant'
import OutInventory from 'model/inventory/out/OutInventory'
import QueryParam from 'model/request/QueryParam'
import InventoryDetailButton from 'pages/inventory/cmp/InventoryDetailButton.vue'

@Component({
  components: { InventoryDetailButton }
})
export default class InventoryTransferListTable extends Vue {
  @Prop() data: OutInventory[]
  @Prop() query: QueryParam

  // 节点对象
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
  doSelectionChange(val: OutInventory[]) {
    this.$emit('selectData', val)
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

  getList() {
    this.$emit('getList')
  }

  /**
   * 备注过滤器
   * @param row
   * @param column
   * @param {string} value
   * @returns {string}
   */
  remarkFormatter(row: any, column: any, value: string) {
    if (value && value.length > 50) {
      value = `${value.substr(0, 50)}...`
    }
    return value
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
        case 'unaudited':
          statusText = 'warning'
          break
        case 'audited':
          statusText = 'info'
          break
        case 'placed':
          statusText = 'success'
          break
        case 'delivered':
          statusText = 'success'
          break
        case 'abolished':
          statusText = 'danger'
          break
        case 'applying':
          statusText = 'warning'
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
   * 跳转到详情
   * @param {string} id
   */
  doGoDetail(id: string) {
    let ids: any[] = []
    this.data.forEach((item) => {
      ids.push(item.id!)
    })
    this.$router.push({
      name: 'inventoryTransferView',
      query: { id: id },
      params: { ids: JSON.stringify(ids), query: JSON.stringify(this.query) }
    })
  }

  /**
   * 表格过滤器： 分类
   */
  categoryFormatter(row: any, column: any, value: string) {
    let billText: string = '一般调拨'
    if (value) {
      switch (value) {
        case 'CAR_PICKUP':
          billText = '提货申请'
          break
        case 'CAR_BACK':
          billText = '回库申请'
          break
        case 'MASTER_TO_SHOP':
          billText = '门店配货'
          break
        case 'SHOP_TO_SHOP':
          billText = '门店调拨'
          break
        case 'SHOP_TO_MASTER':
          billText = '门店退货'
          break
        default:
          break
      }
    }
    return billText
  }
}

InventoryTransferListTable.filter('status', (value: string) => {
  if (value) {
    let statusText: string = ''
    switch (value) {
      case 'unaudited':
        statusText = '草稿'
        break
      case 'delivered':
        statusText = '已出库'
        break
      case 'audited':
        statusText = '已审核'
        break
      case 'placed':
        statusText = '已入库'
        break
      case 'abolished':
        statusText = '已作废'
        break
      case 'applying':
        statusText = '申请中'
        break
      default:
        statusText = '--'
    }
    return statusText
  } else {
    return '--'
  }
})

