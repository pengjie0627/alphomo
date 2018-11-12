import { Vue, Component } from 'vue-property-decorator'
import { FormValidator, Loading } from 'fant'
import UserApi from 'http/framework/user/UserApi'

@Component({
  name: 'modify-pwd-dialog'
})
export default class ModifyPwdDialog extends Vue {
  id = ''
  oldPwd = ''
  newPwd = ''
  reNewPwd = ''
  validator = new FormValidator()

  mounted() {
    this.validator.push({
      oldPwd: [
        {
          required: true, message: '请输入原密码'
        },
        {
          minLength: 6, message: '请输入6-16位密码'
        },
        {
          maxLength: 16, message: '请输入6-16位密码'
        }
      ],
      newPwd: [
        {
          required: true, message: '请输入新密码'
        },
        {
          minLength: 6, message: '请输入6-16位密码'
        },
        {
          maxLength: 16, message: '请输入6-16位密码'
        }
      ],
      reNewPwd: [
        {
          required: true, message: '请再输一遍新密码'
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
      if (this.newPwd !== this.reNewPwd) {
        this.$message.warning('确认密码和新密码不一致')
        return
      }
      let loading = Loading.show()
      UserApi.updatePassword(this.oldPwd, this.newPwd).then(resp => {
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
