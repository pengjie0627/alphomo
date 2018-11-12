import { Component, Vue } from 'vue-property-decorator'
import { Action } from 'vuex-class'
import AuthApi from 'http/authen/AuthApi'
import { FormValidator, Loading } from 'fant'
import { storage } from 'mgr/BrowserMgr.js'
import EnvUtil from 'util/EnvUtil.js'
import { sessionStorage } from 'mgr/BrowserMgr'
import Auth2Api from 'http/authen/Auth2Api'

@Component({
  components: {
    // 你的组件
  }
})
export default class Login extends Vue {
  @Action('user') actionUser: Function
  @Action('merchant') actionMerchant: Function
  @Action('merchantConfig') actionMerchantConfig: Function
  @Action('permission') actionPermission: Function
  user: string = ''
  password: string = ''
  savePwd = false
  disabled = true
  jdEnv: boolean = false
  // 校验器
  validator = new FormValidator()
  $refs: {
    name: any,
    password: any,
    login: any
  }

  mounted() {
    if (EnvUtil.isJdBranch()) {
      this.jdEnv = true
    }
    let storageStr = storage.getItem('userInfo')
    if (storageStr) {
      let info = storageStr.split('&')
      this.user = info[0]
      this.password = info[1]
      this.savePwd = true
      // this.onLogin()
    }
    sessionStorage.length > 0 && sessionStorage.clear()
    // 获取焦点
    this.$nextTick(() => {
      this.$refs.name.focus()
    })
    // 校验规则
    this.validator.push(
      {
        pwd: [
          { minLength: 6, message: '最小长度为6个字符' }
        ]
      })
  }


  onLogin() {
    // todo 登录事件
    this.validator.validate(true).then(() => {
      let loading = Loading.show()
      AuthApi.login(this.user, this.password).then((res) => {
        if (res && res.data) {
          loading.hide()
          this.actionUser(res.data.user)
          this.actionMerchant(res.data.merchant)
          this.actionMerchantConfig(res.data.merchantConfig)
          // 存储权限
          let roles: any[] = []
          let user: any = res.data.user
          if (user && user.roles && user.roles.length > 0) {
            // 对于多角色取并集
            for (let i = 0; i < user.roles.length; i++) {
              roles.push.apply(roles, user.roles[i].functionPerms)
            }
            this.actionPermission(roles)
            console.log(roles)
          }
          // 实现自动登录
          // let userStr = ''
          // userStr += this.user
          // userStr += '&'
          // userStr += this.password
          // storage.setItem('userInfo', userStr)
          storage.clearPreItem('alphama-login-user')
          let alphamaLoginKey = 'alphama-login-user'.concat(res.data.user!.id || '')
          storage.setItem(alphamaLoginKey, res.data.user)
          this.$router.push('/home')// 跳转到销售列表不合理，万一要是没有销售列表模块的权限呢。所以默认还是跳转到欢迎页
        }
      }).catch((err) => {
        loading.hide()
        this.$message.error(err.message)
      })
    })
  }

  /**
   * 键盘按键事件
   */
  confirmByKey(event: any, type: string) {
    if (event.keyCode === 13) {
      switch (type) {
        case 'userName' :
          this.$refs.password.focus()
          break
        case 'password' :
          !this.$refs.login.disabled && this.$refs.login.$el.click()
          break
      }
    }
  }

  onToAuthorize(type: string) {
    window.location.href = EnvUtil.getServiceUrl() + Auth2Api.onToAuthorize(type)
  }

  onToRegister(type: string) {
    // this.$router.replace(`/register?type=${type}`)
    this.$router.push({ name: 'register', query: { type: type } })
  }
}
