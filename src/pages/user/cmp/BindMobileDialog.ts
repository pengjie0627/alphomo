import { Vue, Component } from 'vue-property-decorator'
import CommonApi from 'http/commons/CommonApi'
import { Loading, FormValidator } from 'fant'
import UserApi from 'http/framework/user/UserApi'

@Component({
  name: 'bind-mobile-dialog'
})
export default class BindMobileDialog extends Vue {
  id = ''
  modifyCode = ''
  mobile = ''
  validator = new FormValidator()
  onRefresh: Function
  $refs: {
    mobile: any
  }

  mounted() {
    this.validator.push({
      mobile: [
        {
          required: true, message: '请输入手机号'
        }
      ],
      modifyCode: [
        {
          required: true, message: '请输入验证码'
        }
      ]
    })
  }

  sendCode() {
    if (!this.mobile) {
      this.$message.warning('请输入需要绑定的手机')
      this.$refs.mobile.focus()
      return
    }
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
      this.saveModifyMobile(this.mobile, this.modifyCode)
    })
  }

  private saveModifyMobile(mobile: string, code: string) {
    UserApi.bindMobile(mobile, code).then(resp => {
      if (resp && resp.success) {
        this.$emit('hide')
        this.$message.success('绑定手机号成功')
        this.onRefresh()
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }
}
