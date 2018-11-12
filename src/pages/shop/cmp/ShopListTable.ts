import { Component, Prop, Vue } from 'vue-property-decorator'
import { Dialog, Loading } from 'fant'
import ShopEdit from 'pages/shop/cmp/ShopEdit.vue'
import QueryParam from 'model/request/QueryParam'
import PermissionMgr from 'mgr/PermissionMgr'
import ShopApi from 'http/basicdata/shop/ShopApi'
import DetailInfo from 'pages/shop/cmp/DetailInfo.vue'
import Shop from 'model/basicdata/shop/Shop'
import PwdResetDialog from 'pages/shop/cmp/PwdResetDialog'

@Component({
  components: {
    ShopEdit,
    DetailInfo,
    PwdResetDialog
  }
})
export default class ShopListTable extends Vue {
  @Prop() data: Shop[]
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
  doSelectionChange(val: Shop[]) {
    this.$emit('selectData', val)
  }

  getList() {
    this.$emit('getList')
  }

  doDelete(id: string, version: number ,name: string) {
    this.$msgBox.confirm('删除门店', `删除门店后将不会再进行任何门店数据同步，您确定删除门店</br><span style="color:#7fbdf5">${name}</span> 吗？`, () => {
      let loading = Loading.show()
      ShopApi.delete(id, version).then(resp => {
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
    new Dialog(ShopEdit, {
      id: id,
      onConfirm: () => {
        this.$emit('reload')
      }
    }).show()
  }

  judge(state: string) {
    if (state === 'NORMAL') {
      return true
    } else if (state === 'DISABLED') {
      return false
    }
    return true
  }

  doChange(id: string,version: number,state: string) {
    if (state === 'NORMAL') {
      this.$msgBox.confirm('停用门店', '停用门店后，该门店将变为不可查看的停用状态。', () => {
        let loading = Loading.show()
        ShopApi.disable(id, version).then(resp => {
          loading.hide()
          this.$message.success('停用成功')
          // 刷新绑定的数据
          this.data.forEach(function (value) {
            if (value.id === id) {
              ShopApi.get(id).then(resp => {
                value.state = resp.data.state
                value.version = resp.data.version
              })
            }
          })
        }).catch(error => {
          loading.hide()
          this.$message.error(error.message)
        })
      })
    } else {
      this.$msgBox.confirm('启用门店', '您确定启用该门店吗？', () => {
        let loading = Loading.show()
        ShopApi.enable(id, version).then(resp => {
          loading.hide()
          this.$message.success('启用成功')
          // 刷新绑定的数据
          this.data.forEach(function (value) {
            if (value.id === id) {
              ShopApi.get(id).then(resp => {
                value.state = resp.data.state
                value.version = resp.data.version
              })
            }
          })
        }).catch(error => {
          loading.hide()
          this.$message.error(error.message)
        })
      })
    }
    return false
  }

  doReset(id: string) {
    ShopApi.get(id).then(resp => {
      new Dialog(PwdResetDialog, {
        id: id,
        loginCode: resp.data.loginCode,
        onConfirm: () => {
          this.$emit('reload')
        }
      }).show()
    })
  }
}

