import Vue from 'vue'
import Component from 'vue-class-component'
import { FormValidator, Loading } from 'fant'
import LogisticsCompany from 'model/basicdata/logisticscompany/LogisticsCompany'
import LogisticsCompanyApi from 'http/basicdata/logisticscompany/LogisticsCompanyApi'
import ConstantMgr from 'mgr/ConstantMgr'
import ContactInfo from 'model/basicdata/ContactInfo'

@Component({
  components: {}

})
export default class LogisticsCompanyEdit extends Vue {
  logisticscompany: LogisticsCompany = new LogisticsCompany()
  onConfirm: Function
  id: string = ''
  validator = new FormValidator()
  // 界面长度限制
  limits = ConstantMgr.limits.logisticscompany
  isEdit: boolean = false
  title: string = '新建物流公司'

  data() {
    return {
      logisticscompany: {
        contactInfo: {}
      }
    }
  }

  doInitData() {
    this.logisticscompany.contactInfo = new ContactInfo()
  }

  beforeMount() {
    if (this.id === '') {
      this.doInitData()
    } else {
      this.isEdit = true
      this.title = '编辑物流公司'
      LogisticsCompanyApi.get(this.id).then((resp) => {
        this.logisticscompany = resp.data
      })
    }

  }

  mounted() {
    this.validator.push({
      name: [
        { required: true, message: '名称为必填字段' },
        { minLength: 2, message: '名称不能少于2个字符' },
        { maxLength: 21, message: '名称不能大于20个字符' }
      ],
      mobile: [{
        validate: (value: any) => {
          let mobileReg = /^[1][3,4,5,7,8][0-9]{9}$/
          let phoneReg = /^0\d{2,3}\-{0,1}\d{7,8}$/
          if (value && !mobileReg.test(value) && !phoneReg.test(value)) {
            return false
          } else {
            return true
          }
        },
        message: '请输入正确的手机号或座机号'
      }],
      fax: [{
        validate: (value: any) => {
          let phoneReg = /^0\d{2,3}\-{0,1}\d{7,8}$/
          if (value && !phoneReg.test(value)) {
            return false
          } else {
            return true
          }
        },
        message: '请输入正确的传真号'
      }],
      email: [{
        validate: (value: any) => {
          let emailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
          if (value && !emailReg.test(value)) {
            return false
          } else {
            return true
          }
        },
        message: '请输入正确的邮箱'
      }],
      qq: [{
        validate: (value: any) => {
          let emailReg = /^[1-9]\d{4,19}$/
          if (value && !emailReg.test(value)) {
            return false
          } else {
            return true
          }
        },
        message: '请输入正确的qq号'
      }],
      postCode: [{
        validate: (value: any) => {
          let emailReg = /^[0-9]{6}$/
          if (value && !emailReg.test(value)) {
            return false
          } else {
            return true
          }
        },
        message: '请输入正确的邮政编码'
      }]
    })
  }

  doCancel() {
    this.$emit('hide')
    this.onConfirm()
  }

  doConfirm() {
    this.validator.validate(true).then(() => {
      if (this.id === '') {
        this.save()
      } else {
        this.update()
      }
    })
  }


  save() {
    let loading = Loading.show()
    LogisticsCompanyApi.saveNew(this.logisticscompany).then(resp => {
      this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
      loading.hide()
      this.$emit('hide')
      this.onConfirm()
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  saveAndCreate() {
    this.validator.validate(true).then(() => {
      let loading = Loading.show()
      LogisticsCompanyApi.saveNew(this.logisticscompany).then(resp => {
        loading.hide()
        this.$message.success(ConstantMgr.tips.saveNewAndModifySuccessTip)
        this.logisticscompany = new LogisticsCompany()
        let contactInfo: ContactInfo = new ContactInfo()
        this.logisticscompany.contactInfo = contactInfo
        this.doInitData()
      }).catch(error => {
        loading.hide()
        this.$message.error(error.message)
      })
    })
  }

  update() {
    let loading = Loading.show()
    LogisticsCompanyApi.saveModify(this.logisticscompany).then(resp => {
      loading.hide()
      this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
      this.$emit('hide')
      this.onConfirm()
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

}

