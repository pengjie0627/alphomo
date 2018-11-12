import { Component, Prop, Vue } from 'vue-property-decorator'
import Sale from 'model/sale/Sale'
import { Loading } from 'fant'
import SkuEdit from 'pages/sku/cmp/SkuEdit.vue'
import QueryParam from 'model/request/QueryParam'
import PermissionMgr from 'mgr/PermissionMgr'
import SkuApi from 'http/basicdata/sku/SkuApi'

@Component({
  components: { SkuEdit }
})
export default class SkuListTable extends Vue {
  @Prop() data: Sale[]
  // 节点对象
  $refs: {
    skuTable: any
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
    this.$msgBox.confirm('批量删除', '您是否确认删除选中商品？', () => {
      let loading = Loading.show()
      SkuApi.delete(id, version).then(resp => {
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

  priceFormatter(row: any, column: any, value: string) {
    if (value && Number(value) !== 0) {
      return Number(value).toFixed(2)
    } else {
      return '0.00'
    }
  }

  doEdit(id: string) {
    this.$router.push({ name: 'skuEdit', query: { id: id } })
    // new Dialog(SkuEdit, {
    //   id: id,
    //   onConfirm: () => {
    //     this.$emit('reload')
    //   }
    // }).show()
  }

  doGoDetail(id: string) {
    this.$router.push({ name: 'skuDetail', query: { id: id } })
  }

}
