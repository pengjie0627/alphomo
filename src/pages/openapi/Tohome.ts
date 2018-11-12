import { Component, Vue } from 'vue-property-decorator'
import { Loading } from 'fant'
import AuthApi from 'http/authen/AuthApi'
import { storage } from 'mgr/BrowserMgr'
import { Action } from 'vuex-class'

@Component({
  name: 'Tohome',
  components: {}
})
export default class Tohome extends Vue {

  @Action('user') actionUser: Function
  @Action('merchant') actionMerchant: Function
  @Action('merchantConfig') actionMerchantConfig: Function
  @Action('permission') actionPermission: Function

  jwt: string = ''
  merchant: string = ''

  mounted() {
    this.jwt = this.$route.query.jwt
    this.merchant = this.$route.query.merchant
    if (!this.jwt || !this.merchant) {
      this.$router.push('/login')
      return
    }
    let loading = Loading.show()
    AuthApi.jwt(this.jwt, this.merchant).then((res) => {
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
      this.$message.error(err)
      this.$router.push('/login')
    })
  }
}

