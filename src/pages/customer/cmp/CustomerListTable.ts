import { Component, Prop, Vue } from 'vue-property-decorator'
import Sale from 'model/sale/Sale'
import { Dialog, Loading } from 'fant'
import CustomerEdit from 'pages/customer/cmp/CustomerEdit.vue'
import QueryParam from 'model/request/QueryParam'
import PermissionMgr from 'mgr/PermissionMgr'
import CustomerApi from 'http/basicdata/customer/CustomerApi'
import DetailInfo from 'pages/customer/cmp/DetailInfo.vue'

@Component({
  components: {
    CustomerEdit,
    DetailInfo
  }
})
export default class CustomerListTable extends Vue {
  @Prop() data: Sale[]
  // 节点对象
  $refs: {
    skuTable: any
    expand: any
  }
  @Prop() ids: string[]
  @Prop() query: QueryParam

  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限

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

  doDelete(id: string, version: number) {
    this.$msgBox.confirm('删除', '您是否确认删除选中客户？', () => {
      let loading = Loading.show()
      CustomerApi.delete(id, version).then(resp => {
        loading.hide()
        this.$emit('hide')
        this.$message.success('删除成功')
        this.getList()
      }).catch(error => {
        loading.hide()
        this.$message.error(error.message)
      })
    })
  }

  doEdit(id: string) {
    new Dialog(CustomerEdit, {
      id: id,
      onConfirm: () => {
        this.$emit('reload')
      }
    }).show()
  }

  isDirect(category: string) {
    if (category === 'DIRECT') {
      return true
    } else {
      return false
    }
  }
}
