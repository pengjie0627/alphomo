import Vue from 'vue'
import Component from 'vue-class-component'
import { FormValidator, Loading } from 'fant'
import Customer from 'model/basicdata/customer/Customer'
import CustomerApi from 'http/basicdata/customer/CustomerApi'
import ConstantMgr from 'mgr/ConstantMgr'
import ContactInfo from 'model/basicdata/ContactInfo'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  components: {}

})
export default class CustomerEdit extends Vue {
  customer: Customer = new Customer()
  onConfirm: Function
  id: string = ''
  validator = new FormValidator()
  // 界面长度限制
  limits = ConstantMgr.limits.customer
  isEdit: boolean = false
  title: string = '新建客户'
  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限
  isJoin: boolean = false

  data() {
    return {
      customer: {
        contactInfo: {
          address: ''
        }
      }
    }
  }

  doInitData() {
    this.customer.contactInfo = new ContactInfo()
  }

  beforeMount() {
    if (this.id === '') {
      this.getCode()
    } else {
      this.isEdit = true
      this.title = '编辑客户'
      CustomerApi.get(this.id).then((resp) => {
        this.customer = resp.data
        if (this.customer.category === 'JOIN') {
          this.isJoin = true
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    }
  }

  getCode() {
    CustomerApi.create().then((resp) => {
      this.customer = resp.data
      this.doInitData()
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  mounted() {
    this.validator.push({
      code: [
        { required: true, message: '编号为必填字段' }
      ],
      name: [
        { required: true, message: '名称为必填字段' },
        { minLength: 2, message: '名称不能少于2个字符' },
        { maxLength: 21, message: '名称不能大于20个字符' }
      ],
      receivable: [{
        validate: (value: any) => {
          if (value < 0) {
            return false
          }
          return true
        },
        message: '期初应收欠款应大于等于0'
      }, {
        max: 999999999.99, message: '期初应收欠款不能高于999999999.99'
      }],
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

  changeAmount() {
    if (this.customer.receivable.toString() === '') {
      this.customer.receivable = 0
    }
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

  saveAndCreate() {
    this.validator.validate(true).then(() => {
      let loading = Loading.show()
      CustomerApi.saveNew(this.customer).then(resp => {
        this.$message.success(ConstantMgr.tips.saveNewAndModifySuccessTip)
        loading.hide()
        this.customer = new Customer()
        let contactInfo: ContactInfo = new ContactInfo()
        this.customer.contactInfo = contactInfo
        this.getCode()
      }).catch(error => {
        loading.hide()
        this.$message.error(error.message)
      })
    })
  }

  save() {
    let loading = Loading.show()
    CustomerApi.saveNew(this.customer).then(resp => {
      this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
      loading.hide()
      this.$emit('hide')
      this.onConfirm()
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  update() {
    let loading = Loading.show()
    CustomerApi.saveModify(this.customer).then(resp => {
      this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
      loading.hide()
      this.$emit('hide')
      this.onConfirm()
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }
}


