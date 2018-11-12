import { Vue, Component } from 'vue-property-decorator'
import { FormValidator, Loading, Dialog } from 'fant'
import UserApi from 'http/framework/user/UserApi'
import CommonApi from 'http/commons/CommonApi'
import BindMobileUpdate from 'pages/user/cmp/BindMobileUpdate.vue'

@Component({
  name: 'BindMobileConfirm',
  components: {}
})
export default class BindMobileConfirm extends Vue {
  loginMobile = ''
  id = ''
  modifyCode = ''
  validator = new FormValidator()
  onRefresh: Function

  get getLoginMobile() {
    if (this.loginMobile) {
      return this.loginMobile.substring(0, 3) + '******' + this.loginMobile.substring(9, 11)
    } else {
      return ''
    }
  }

  mounted() {
    this.validator.push({
      modifyCode: [
        {
          required: true, message: '请输入原手机号验证码'
        }
      ]
    })
  }

  sendCode() {
    let loading = Loading.show()
    CommonApi.smsVerificationCode(this.loginMobile).then(resp => {
      if (resp && resp.success) {
        loading.hide()
      }
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

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
    this.validator.validate(true).then(() => {
      UserApi.verifyMobile(this.loginMobile, this.modifyCode).then(resp => {
        if (resp && resp.success) { // 校验成功
          new Dialog(BindMobileUpdate, {
            id: this.id, onRefresh: this.onRefresh, onClose: () => {
              this.$emit('hide')
            }
          }).show()
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    })
  }
}


