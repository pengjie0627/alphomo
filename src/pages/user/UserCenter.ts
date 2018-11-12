import { Vue, Component } from 'vue-property-decorator'
import { Dialog, Loading } from 'fant'
import EditInfoDialog from 'pages/user/cmp/EditInfoDialog.vue'
import ModifyPwdDialog from 'pages/user/cmp/ModifyPwdDialog.vue'
import BindMobileDialog from 'pages/user/cmp/BindMobileDialog.vue'
import UserApi from 'http/framework/user/UserApi'
import { State, Action } from 'vuex-class'
import User from 'model/framework/user/User'
import BindMobileConfirm from 'pages/user/cmp/BindMobileConfirm.vue'
import PageBody from 'cmp/PageBody.vue'

@Component({
  name: 'user-center',
  components: { PageBody }
})
export default class UserCenter extends Vue {
  userDtl: User = new User()
  @State('user') user: User
  @Action('user') actionUser: Function
  get getSecretMobile() {
    if (this.userDtl.loginMobile) {
      return this.userDtl.loginMobile.substring(0, 3) + '******' + this.userDtl.loginMobile.substring(9, 11)
    } else {
      return ''
    }
  }

  get getRolePermission() {
    if (this.userDtl.roles && this.userDtl.roles.length > 0) {
      let arr: any = []
      this.userDtl.roles.forEach(item => {
        arr.push(item.name)
      })
      return arr.join(',')
    }
    return ''
  }

  get getPricePermission() {
    if (this.userDtl.pricePerms && this.userDtl.pricePerms.length > 0) {
      let arr: any = []
      this.userDtl.pricePerms.forEach(item => {
        arr.push(item.caption)
      })
      return arr.join(',')
    }
    return ''
  }

  get getWarePerssion() {
    if (this.userDtl.warehousePerms && this.userDtl.warehousePerms.captions.length > 0) {
      let arr: any = []
      this.userDtl.warehousePerms.captions.forEach(item => {
        arr.push(item.value)
      })
      return arr.join(',')
    } else if (this.userDtl.warehousePerms) {
      return '全部仓库'
    }
    return ''
  }

  get getSimpleName() {
    if (this.userDtl.name) {
      return this.userDtl.name.charAt(0)
    }
    return ''
  }

  mounted() {
    this.getUserInfo()
  }

  onEdit() {
    new Dialog(EditInfoDialog, {
      name: this.userDtl.name,
      sex: this.userDtl.sex === 'male' ? '男' : '女',
      userInfo: this.userDtl,
      onConfirm: () => {
        this.getUserInfo()
      }
    }).show()
  }

  onModify() {
    new Dialog(ModifyPwdDialog, {
      id: this.user.id
    }).show()
  }

  onBind() {
    if (this.userDtl.loginMobile) {
      new Dialog(BindMobileConfirm, {
        loginMobile: this.userDtl.loginMobile,
        id: this.user.id,
        onRefresh: () => {
          this.getUserInfo()
        }
      }).show()
    } else {
      new Dialog(BindMobileDialog, {
        loginMobile: this.userDtl.loginMobile,
        id: this.user.id,
        onRefresh: () => {
          this.getUserInfo()
        }
      }).show()
    }
  }

  private getUserInfo() {
    let loading = Loading.show()
    UserApi.userInfo().then(resp => {
      if (resp && resp.success) {
        loading.hide()
        this.actionUser(resp.data)
        this.userDtl = resp.data
        this.userDtl.roles[0].functionPerms.forEach((item: any) => {
        })
      }
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }
}
