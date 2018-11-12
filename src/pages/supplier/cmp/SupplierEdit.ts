import Vue from 'vue'
import Component from 'vue-class-component'
import { FormValidator, Loading } from 'fant'
import Supplier from 'model/basicdata/supplier/Supplier'
import SupplierApi from 'http/basicdata/supplier/SupplierApi'
import ConstantMgr from 'mgr/ConstantMgr'
import ContactInfo from 'model/basicdata/ContactInfo'

@Component({
  components: {}

})
export default class SupplierEdit extends Vue {
  supplier: Supplier = new Supplier()
  onConfirm: Function
  id: string = ''
  validator = new FormValidator()
  // 界面长度限制
  limits = ConstantMgr.limits.supplier
  isEdit: boolean = false
  title: string = '新建供应商'

  data() {
    return {
      supplier: {
        contactInfo: {}
      }
    }
  }

  doInitData() {
    this.supplier.contactInfo = new ContactInfo()
  }

  beforeMount() {
    if (this.id === '') {
      this.getCode()
    } else {
      this.isEdit = true
      this.title = '编辑供应商'
      SupplierApi.get(this.id).then((resp) => {
        this.supplier = resp.data
      })
    }
  }

  getCode() {
    SupplierApi.create().then((resp) => {
      this.supplier = resp.data
      this.doInitData()
    })
  }

  changeAmount() {
    if (this.supplier.payable.toString() === '') {
      this.supplier.payable = 0
    }
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
        message: '期初应付应大于等于0'
      }, {
        max: 999999999.99, message: '期初应付不能高于999999999.99'
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
      bankAccount: [{
        validate: (value: any) => {
          let accountReg = /^\d{16,19}$/
          if (value && !accountReg.test(value)) {
            return false
          } else {
            return true
          }
        },
        message: '请输入正确的银行账号'
      }],
      registrationNo: [{
        validate: (value: any) => {
          let registrationReg = /^([a-zA-Z0-9]{15}|[a-zA-Z0-9]{18}|[a-zA-Z0-9]{20})$/
          if (value && !registrationReg.test(value)) {
            return false
          } else {
            return true
          }
        },
        message: '请输入正确的纳税人识别号'
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

  saveAndCreate() {
    this.validator.validate(true).then(() => {
      let loading = Loading.show()
      SupplierApi.saveNew(this.supplier).then(resp => {
        loading.hide()
        this.$message.success(ConstantMgr.tips.saveNewAndModifySuccessTip)
        this.supplier = new Supplier()
        let contactInfo: ContactInfo = new ContactInfo()
        this.supplier.contactInfo = contactInfo
        this.getCode()
      }).catch(error => {
        loading.hide()
        this.$message.error(error.message)
      })
    })
  }


  save() {
    let loading = Loading.show()
    SupplierApi.saveNew(this.supplier).then(resp => {
      loading.hide()
      this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
      this.$emit('hide')
      this.onConfirm()
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  update() {
    let loading = Loading.show()
    SupplierApi.saveModify(this.supplier).then(resp => {
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

