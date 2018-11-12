import { Component, Vue } from 'vue-property-decorator'
import AuthApi from 'http/authen/AuthApi'
import User from 'model/framework/user/User'
import { FormValidator, Loading } from 'fant'
import { Action } from 'vuex-class'
import CommonApi from 'http/commons/CommonApi'
import { storage } from 'mgr/BrowserMgr.js'

@Component({
  components: {
    // 你的组件
  }
})
export default class Register extends Vue {
  user: User = new User()
  mobile = ''
  pwd = ''
  confirmPwd = ''
  modifyNum = ''
  typeInfo = ''
  // 校验器
  validator = new FormValidator()
  @Action('user') actionUser: Function
  @Action('merchant') actionMerchant: Function
  @Action('merchantConfig') actionMerchantConfig: Function
  @Action('permission') actionPermission: Function
  $refs: {
    mobile: any,
    pwd: any,
    confirmPwd: any,
    modifyNum: any,
    register: any
  }

  mounted() {
    let params = this.$route.query
    if (params.type === 'forgot') {
      this.typeInfo = '忘记密码'
    } else {
      this.typeInfo = '申请入驻'
    }
    this.$nextTick(() => {
      this.$refs.mobile.focus()
    })
    // 校验规则
    this.validator.push({
      mobile: [
        { minLength: 11, message: '请输入11位手机号码' }
      ],
      modifyNum: [
        { maxLength: 6, message: '请输入6位验证码' }
      ],
      pwd: [
        { minLength: 6, message: '最小长度为6个字符' }
      ],
      confirmPwd: [
        { minLength: 6, message: '最小长度为6个字符' }
      ]
    })
  }

  sendCode() {
    this.$refs.modifyNum.focus()
    // todo  获取验证码
    let loading = Loading.show()
    CommonApi.smsVerificationCode(this.mobile).then(resp => {
      if (resp && resp.success) {
        loading.hide()
      }
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  confirmByKey(event: any, type: string) {
    if (event.keyCode === 13) {
      switch (type) {
        case 'mobile' :
          this.$refs.modifyNum.focus()
          break
        case 'modifyNum' :
          this.$refs.pwd.focus()
          break
        case 'pwd' :
          this.$refs.confirmPwd.focus()
          break
        case 'confirmPwd' :
          !this.$refs.register.disabled && this.$refs.register.$el.click()
          break
      }
    }
  }

  toLogin() {
    this.$router.push('/login')
  }

  onRegister() {
    this.validator.validate(true).then(() => {
      if (this.pwd !== this.confirmPwd) {
        this.$message.warning('密码与确认密码不一致')
        return
      }
      let loading = Loading.show()
      this.user.loginMobile = this.mobile
      this.user.password = this.pwd
      if (this.$route.query.type === 'forgot') {
        AuthApi.resetPassword(this.mobile, this.pwd, this.modifyNum).then((resp) => {
          if (resp && resp.success) {
            loading.hide()
            this.$router.push('login')
          }
        }).catch((err) => {
          loading.hide()
          this.$message.error(err.message)
        })
      } else { // 注册
        AuthApi.register(this.modifyNum, this.user).then((resp) => {
          if (resp && resp.success) {
            loading.hide()
            this.actionUser(resp.data.user)
            this.actionMerchant(resp.data.merchant)
            this.actionMerchantConfig(resp.data.merchantConfig)
            // 存储权限
            let roles: any[] = []
            let user: any = resp.data.user
            if (user && user.roles && user.roles.length > 0) {
              // 对于多角色取并集
              for (let i = 0; i < user.roles.length; i++) {
                roles.push.apply(roles, user.roles[i].functionPerms)
              }
              this.actionPermission(roles)
              console.log(roles)
            }
            // 实现自动登录
            let userStr = ''
            userStr += this.user.loginMobile
            userStr += '&'
            userStr += this.user.password
            storage.setItem('userInfo', userStr)
            // 保存 cookies
            storage.clearPreItem('alphama-login-user')
            let alphamaLoginKey = 'alphama-login-user'.concat(resp.data.user!.id || '')
            storage.setItem(alphamaLoginKey, resp.data.user)
            this.$router.push('enterpriseSetting')
          }
        }).catch((err) => {
          loading.hide()
          this.$message.error(err.message)
        })
      }
    })
  }
}
