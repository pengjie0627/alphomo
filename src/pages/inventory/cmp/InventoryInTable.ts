import { Component, Prop, Vue } from 'vue-property-decorator'
import { DateUtil } from 'fant'
import InInventory from 'model/inventory/in/InInventory'
import QueryParam from 'model/request/QueryParam'
import InInventoryApi from 'http/inventory/in/InInventoryApi'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  components: {}
})
export default class InventoryInTable extends Vue {
  @Prop() data: InInventory[]
  @Prop() query: QueryParam
  hasPermissions: Function = PermissionMgr.hasOptionPermission

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
  doSelectionChange(val: InInventory[]) {
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
        case 'UNAUDITED':
          statusText = 'warning'
          break
        case 'AUDITED':
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
   * 跳转到详情
   * @param {string} id
   */
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
      name: 'inventoryInView',
      query: { id: id },
      params: { ids: JSON.stringify(ids), query: JSON.stringify(this.query) }
    })
  }

  /**
   * 入库
   * @param {string} id
   */
  doEntryInventory(bill: InInventory) {
    InInventoryApi.audit(bill).then((resp) => {
      this.$message.success('入库成功！')
      this.$emit('getList')
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }
}

InventoryInTable.filter('status', (value: string) => {
  if (value) {
    let statusText: string = ''
    switch (value) {
      case 'UNAUDITED':
        statusText = '未入库'
        break
      case 'AUDITED':
        statusText = '已入库'
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

