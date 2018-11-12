import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Inventory from 'model/inventory/Inventory'
import { Dialog } from 'fant'
import Edit from 'pages/begininginventory/cmp/Edit.vue'
import FilterParam from 'model/request/FilterParam'
import BeginingInventory from 'model/inventory/begining/BeginingInventory'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  components: {
    Edit
  }
})
export default class InventoryListTable extends Vue {
  @Prop() data: BeginingInventory[]
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

  doGoEdit(id: string, obj: BeginingInventory) {
    new Dialog(Edit, {
      uuid: id,
      beginingInventory: obj,
      onConfirm: () => {
        let filters: FilterParam[] = []
        if (obj.warehouse) {
          filters.push(new FilterParam('warehouse:=', obj.warehouse.id))
        }
        this.$emit('setFilter', filters)
      }
    }).show()
  }
  priceFormatter(row: any, column: any, value: string) {
    if (value && Number(value) !== 0) {
      return Number(value).toFixed(6)
    } else {
      return '0.000000'
    }
  }

  amountFormatter(row: any, column: any, value: string) {
    if (value && Number(value) !== 0) {
      return Number(value).toFixed(2)
    } else {
      return '0.00'
    }
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
}
