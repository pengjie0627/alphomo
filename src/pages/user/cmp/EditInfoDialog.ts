import { Vue, Component } from 'vue-property-decorator'
import User from 'model/framework/user/User'
import UserApi from 'http/framework/user/UserApi'
import { Loading } from 'fant'
import ScopePerm from 'model/framework/role/ScopePerm'
import ConstantMgr from 'mgr/ConstantMgr'

@Component({
  name: 'edit-info-dialog'
})
export default class EditInfoDialog extends Vue {
  name = ''
  sex = ''
  userInfo: User
  onConfirm: Function

  /**
   * dialog 取消
   */
  doCancel() {
    this.$emit('hide')
  }

  /**
   * dialog 确认
   */
  doConfirm() {
    this.userInfo.name = this.name
    this.userInfo.sex = this.sex === '男' ? 'male' : 'female'
    // 价格权限
    this.userInfo.fieldPerms = this.userInfo.pricePerms
    // 仓库权限
    if (this.userInfo.admin) {
      this.userInfo.scopePerms = []
    } else {
      if (this.userInfo.warehousePerms && this.userInfo.warehousePerms.captions.length === 0 && this.userInfo.warehousePerms.scope === null) {
        let perm = new ScopePerm()
        perm.scope = null
        perm.code = this.userInfo.warehousePerms.code
        perm.name = this.userInfo.warehousePerms.name
        this.userInfo.scopePerms = []
        this.userInfo.scopePerms.push(perm)
      } else {
        let idStr = ''
        this.userInfo!.warehousePerms!.captions.forEach((item, index) => {
          if (item) {
            idStr += item.id + ','
          }
        })
        let perm = new ScopePerm()
        perm.scope = idStr.substring(0, idStr.length - 1)
        perm.code = this.userInfo!.warehousePerms!.code
        perm.name = this.userInfo!.warehousePerms!.name
        this.userInfo.scopePerms = []
        this.userInfo.scopePerms.push(perm)
      }
    }
    let loading = Loading.show()
    UserApi.upateBaseInfo(this.userInfo).then(resp => {
      if (resp && resp.success) {
        this.$emit('hide')
        loading.hide()
        this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
        this.onConfirm()
      }
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }
}
