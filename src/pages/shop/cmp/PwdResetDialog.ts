import { Vue, Component } from 'vue-property-decorator'
import { FormValidator, Loading } from 'fant'
import ShopApi from 'http/basicdata/shop/ShopApi'

@Component({
  name: 'pwd-reset-dialog'
})
export default class PwdResetDialog extends Vue {
  id: string = ''
  loginCode: string = ''
  loginPwd: string = ''
  validator = new FormValidator()

  mounted() {
    this.validator.push({
      loginPwd: [
        {
          required: true, message: '请输入新密码'
        },
        {
          minLength: 6, message: '请输入6-16位密码'
        },
        {
          maxLength: 16, message: '请输入6-16位密码'
        }
      ]
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
      let loading = Loading.show()
      ShopApi.reset(this.loginCode, this.loginPwd).then(resp => {
        if (resp && resp.success) {
          loading.hide()
          this.$emit('hide')
          this.$message.success('密码修改成功')
        }
      }).catch(error => {
        loading.hide()
        this.$message.error(error.message)
      })
    })
  }
}
