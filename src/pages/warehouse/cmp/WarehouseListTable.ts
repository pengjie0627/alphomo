import {Component, Prop, Vue} from 'vue-property-decorator'
import Sale from 'model/sale/Sale'
import {Dialog, Loading} from 'fant'
import WarehouseEdit from 'pages/warehouse/cmp/WarehouseEdit.vue'
import QueryParam from 'model/request/QueryParam'
import PermissionMgr from 'mgr/PermissionMgr'
import WarehouseApi from 'http/basicdata/warehouses/WarehouseApi'
import DetailInfo from 'pages/warehouse/cmp/DetailInfo.vue'
import Warehouse from 'model/basicdata/warehouses/Warehouse'

@Component({
  components: {WarehouseEdit, DetailInfo}
})
export default class WarehouseListTable extends Vue {
  @Prop() data: Warehouse[]
  // 节点对象
  $refs: {
    skuTable: any
  }
  @Prop() ids: string[]
  @Prop() query: QueryParam

  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限

  /**
   * 表格排序条件
   */
  doSortChange({column, prop, order}: any) {
    order === 'ascending' ? (order = 'ASC') : (order = 'DESC')
    let sorters = []
    column && prop && order && sorters.push({'property': prop, 'direction': order})
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

  doDelete(id: string, version: number, status: string) {
    if (status === 'DELETED') {
      this.$msgBox.confirm('启用', '您是否确认启用选中仓库？', () => {
        let loading = Loading.show()
        WarehouseApi.unDelete(id, version).then(resp => {
          loading.hide()
          this.$emit('hide')
          this.$message.success('启用成功')
          this.getList()
        }).catch(error => {
          loading.hide()
          this.$message.error(error.message)
        })
      })
    } else {
      this.$msgBox.confirm('停用', '您是否确认停用选中仓库？', () => {
        let loading = Loading.show()
        WarehouseApi.delete(id, version).then(resp => {
          loading.hide()
          this.$emit('hide')
          this.$message.success('停用成功')
          this.getList()
        }).catch(error => {
          loading.hide()
          this.$message.error(error.message)
        })
      })
    }
  }

  doEdit(id: string) {
    new Dialog(WarehouseEdit, {
      id: id,
      onConfirm: () => {
        this.$emit('reload')
      }
    }).show()
  }

  /**
   * 表格过滤器： 分类
   */
  categoryFormatter(row: any, column: any, value: string) {
    let billText: string = '一般仓库'
    if (value) {
      switch (value) {
        case 'CAR':
          billText = '车辆'
          break
        case 'SHOP':
          billText = '门店'
          break
        default:
          break
      }
    }
    return billText
  }
}

