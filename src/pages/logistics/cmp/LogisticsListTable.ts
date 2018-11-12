import { Component, Prop, Vue } from 'vue-property-decorator'
import Sale from 'model/sale/Sale'
import { Dialog, Loading } from 'fant'
import LogisticsCompanyEdit from 'pages/logistics/cmp/LogisticsEdit.vue'
import QueryParam from 'model/request/QueryParam'
import PermissionMgr from 'mgr/PermissionMgr'
import LogisticsCompanyApi from 'http/basicdata/logisticscompany/LogisticsCompanyApi'
import DetailInfo from 'pages/logistics/cmp/DetailInfo.vue'

@Component({
  components: {
    LogisticsCompanyEdit,
    DetailInfo
  }
})
export default class LogisticsCompanyListTable extends Vue {
  @Prop() data: Sale[]
  // 节点对象
  $refs: {
    skuTable: any
    expand: any
  }
  @Prop() ids: string[]
  @Prop() query: QueryParam

  // 权限
  hasPermissions: Function = PermissionMgr.hasOptionPermission

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
    this.$msgBox.confirm('批量删除', '您是否确认删除选中物流公司？', () => {
      let loading = Loading.show()
      LogisticsCompanyApi.delete(id, version).then(resp => {
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
    new Dialog(LogisticsCompanyEdit, {
      id: id,
      onConfirm: () => {
        this.$emit('reload')
      }
    }).show()
  }

}

