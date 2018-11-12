import { Component, Vue } from 'vue-property-decorator'
import { FormValidator, Loading, ObjectUtil } from 'fant'
import AccountCategory from 'model/basicdata/accountcategory/AccountCategory'
import AccountCategoryApi from 'http/basicdata/accountcategory/AccountCategoryApi'

@Component({
  components: {}
})
export default class AccountCategoryEdit extends Vue {
  // 面包屑菜单
  prentSub: AccountCategory = new AccountCategory()
  accountCategory: AccountCategory = new AccountCategory()
  model: AccountCategory = new AccountCategory()
  title: string = '新建科目'
  validator = new FormValidator()
  doConfirm: Function
  created() {
    if (this.title === '编辑科目') {
      this.accountCategory = ObjectUtil.copy(this.model)
    }
  }
  mounted() {
    if (this.prentSub && this.prentSub.code) {
      this.accountCategory.parent = this.prentSub.code
    } else {
      if (this.accountCategory.parent) {
        AccountCategoryApi.getByCode(this.accountCategory.parent).then((resp) => {
          if (resp.data) {
            this.prentSub = resp.data
          }
        }).catch(e => {
          this.$message.error(e.message)
        })
      } else {
        let m = new AccountCategory()
        m.name = '科目管理'
        this.prentSub = m
      }
    }
    this.validator.push({
      name: [
        { required: true, message: '请输入科目名称' },
        { maxLength: 12, message: '最大长度为12个字符' }
      ],
      code: [
        { required: true, message: '请输入科目编号' },
        { maxLength: 20, message: '最大长度为20个字符' }
      ]
    })
  }
  get prentSubName() {
    if (this.prentSub.name && this.prentSub.name !== null) {
      return this.prentSub.name
    } else {
      return ''
    }
  }
  doCancel() {
    this.$emit('hide')
  }
  onConfirm() {
    this.validator.validate(true).then(() => {
      let loading = Loading.show()
      if (this.title === '新建科目') {
        AccountCategoryApi.saveNew(this.accountCategory).then((resp) => {
          loading.hide()
          if (resp.data) {
            this.doConfirm(resp.data)
            this.$emit('hide')
          }
        }).catch(e => {
          loading.hide()
          this.$message.error(e.message)
        })
      } else {
        AccountCategoryApi.saveModify(this.accountCategory).then((resp) => {
          loading.hide()
          if (resp.success) {
            this.doConfirm(resp.success)
            this.$emit('hide')
          }
        }).catch(e => {
          loading.hide()
          this.$message.error(e.message)
        })
      }
    })
  }
}
