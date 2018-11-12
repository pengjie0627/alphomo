import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Inventory from 'model/inventory/Inventory'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  components: {}
})
export default class InventoryListTable extends Vue {
  @Prop() data: Inventory[]
  @Prop() query: any
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  @Watch('query', { deep: true, immediate: true })
  watchQuery(value: any) {
    this.query = value
  }

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
  doSelectionChange(val: Inventory[]) {
    this.$emit('selectData', val)
  }

  /**
   * 检查空值显示
   * @param {string} value
   * @param {any} row
   * @param {any} column
   * @returns {string}
   */
  checkNullValue(row: any, column: any, value: string) {
    if (value) {
      return value
    }
    return '--'
  }

  /**
   * 跳转到详情
   * @param {string} id
   */
  doGoDetail(id: string, inventory: any) {
    console.log(this.query)
    this.$router.push({
      name: 'inventoryFlow',
      query: { id: id, sku: inventory.sku.id, warehouse: this.query.name || '全部', warehouseId: this.query.id || '' }
    })
  }
}
