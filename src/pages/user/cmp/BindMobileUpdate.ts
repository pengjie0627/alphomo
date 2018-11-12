import { Vue, Component } from 'vue-property-decorator'
import { FormValidator, Loading } from 'fant'
import CommonApi from 'http/commons/CommonApi'
import UserApi from 'http/framework/user/UserApi'

@Component({
  name: 'BindMobileUpdate',
  components: {}
})
export default class BindMobileUpdate extends Vue {
  id = ''
  newMobile = ''
  reModifyCode = ''
  validator = new FormValidator()
  onRefresh: Function
  onClose: Function

  mounted() {
    this.validator.push({
      newMobile: [
        {
          required: true, message: '请输入新手机号'
        }
      ],
      reModifyCode: [
        {
          required: true, message: '请输入新手机号验证码'
        }
      ]
    })
  }

  sendCode() {
    if (!this.newMobile) {
      this.$message.warning('请输入新手机号')
      return
    }
    let loading = Loading.show()
    CommonApi.smsVerificationCode(this.newMobile).then(resp => {
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
      UserApi.bindMobile(this.newMobile, this.reModifyCode).then(resp => {
        if (resp && resp.success) {
          this.$emit('hide')
          this.$message.success('绑定手机号成功')
          // todo 刷新父页面
          this.onClose()
          this.onRefresh()
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    })
  }
}


