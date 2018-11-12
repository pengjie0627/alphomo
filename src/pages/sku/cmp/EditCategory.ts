import Vue from 'vue'
import Component from 'vue-class-component'
import { FormValidator, Loading } from 'fant'
import ConstantMgr from 'mgr/ConstantMgr'
import Dictionary from 'model/basicdata/dictionary/Dictionary'
import SkuCategory from 'model/basicdata/sku/SkuCategory'
import SkuCategoryApi from 'http/basicdata/sku/SkuCategoryApi'
import { Watch } from 'vue-property-decorator'

@Component({
  components: {}

})
export default class EditCategory extends Vue {
  skuCategory: SkuCategory = new SkuCategory()
  onConfirm: Function
  uuid: string = ''
  data: SkuCategory
  validator = new FormValidator()
  // 界面长度限制
  limits = ConstantMgr.limits.sku
  munitList: Dictionary[]
  title: string = '新建分类'
  firstCategoryCode: string = ''
  secondCategoryCode: string = ''
  thirdCategoryCode: string = ''
  fourCategoryCode: string = ''
  parentCategory: SkuCategory = new SkuCategory()
  firstList: Array<SkuCategory> = []
  secondList: Array<SkuCategory> = []
  thirdList: Array<SkuCategory> = []
  fourList: Array<SkuCategory> = []


  beforeMount() {
    this.getFirstCategory()
    if (this.uuid === '') {
      this.getCode()
      if (this.data && this.data.name) {
        let codeList: SkuCategory[] = []
        codeList = []
        codeList.push(this.data)
        let parent: SkuCategory = this.data.parent!
        // let secondParent: SkuCategory = this.data.parent!.parent
        while (parent) {
          codeList.push(parent)
          parent = parent.parent!
        }
        if (codeList.length > 0) {
          this.firstCategoryCode = codeList!.pop()!.code!
        }
        if (codeList.length > 0) {
          this.secondCategoryCode = codeList!.pop()!.code!
        }
        if (codeList.length > 0) {
          this.thirdCategoryCode = codeList.pop()!.code!
        }
        if (codeList.length > 0) {
          this.fourCategoryCode = codeList.pop()!.code!
        }
      }
    } else {
      this.title = '编辑分类'
      SkuCategoryApi.get(this.uuid).then((resp) => {
        this.skuCategory = resp.data
        let codeList: Array<SkuCategory> = []
        // codeList.push(this.skuCategory)
        let parent: SkuCategory = this.skuCategory.parent!
        // let secondParent: SkuCategory = this.data.parent!.parent
        while (parent) {
          codeList.push(parent)
          parent = parent.parent!
        }
        if (codeList.length > 0) {
          this.firstCategoryCode = codeList!.pop()!.code!
        }
        if (codeList.length > 0) {
          this.secondCategoryCode = codeList!.pop()!.code!
        }
        if (codeList.length > 0) {
          this.thirdCategoryCode = codeList.pop()!.code!
        }
        if (codeList.length > 0) {
          this.fourCategoryCode = codeList.pop()!.code!
        }
      })
    }
  }

  @Watch('firstCategoryCode')
  onFirstCategoryCode() {
    this.getSecondCategory()
  }

  @Watch('secondCategoryCode')
  onSecondCategoryCode() {
    this.getThirdCategory()
  }

  @Watch('thirdCategoryCode')
  onThirdCategoryCode() {
    this.getFourCategory()
  }

  mounted() {
    this.validator.push({
      name: [
        { required: true, message: '分类名称为必填字段' }
      ],
      code: [
        { required: true, message: '分类编号为必填字段' }
      ]
    })
  }

  getCode() {
    SkuCategoryApi.createBefore().then((resp) => {
      this.skuCategory = resp.data
    })
  }

  getFirstCategory() {
    SkuCategoryApi.getFirstByMerchant().then((resp) => {
      this.firstList = resp.data
    })
  }

  getSecondCategory() {
    SkuCategoryApi.getByParent(this.firstCategoryCode).then((resp) => {
      this.secondList = resp.data
      let isSecondCodeNull: boolean = true
      this.secondList.forEach((item) => {
        if (item.code === this.secondCategoryCode) {
          isSecondCodeNull = false
        }
      })
      if (isSecondCodeNull) {
        this.secondCategoryCode = ''
      }
    })
  }

  getThirdCategory() {
    SkuCategoryApi.getByParent(this.secondCategoryCode).then((resp) => {
      this.thirdList = resp.data
      let isThirdCodeNull: boolean = true
      this.thirdList.forEach((item) => {
        if (item.code === this.thirdCategoryCode) {
          isThirdCodeNull = false
        }
      })
      if (isThirdCodeNull) {
        this.thirdCategoryCode = ''
      }
    })
  }

  getFourCategory() {
    SkuCategoryApi.getByParent(this.thirdCategoryCode).then((resp) => {
      this.fourList = resp.data
      let isFourCodeNull: boolean = true
      this.fourList.forEach((item) => {
        if (item.code === this.fourCategoryCode) {
          isFourCodeNull = false
        }
      })
      if (isFourCodeNull) {
        this.fourCategoryCode = ''
      }
    })
  }

  doCancel() {
    this.$emit('hide')
  }

  doConfirm() {
    this.validator.validate(true).then(() => {
      if (this.uuid === '') {
        this.save()
        this.onConfirm()
      } else {
        this.update()
        this.onConfirm()
      }
    })
  }


  save() {
    let loading = Loading.show()
    if (this.fourCategoryCode) {
      this.parentCategory.code = this.fourCategoryCode
      this.skuCategory.parent = this.parentCategory
    } else if (this.thirdCategoryCode) {
      this.parentCategory.code = this.thirdCategoryCode
      this.skuCategory.parent = this.parentCategory
    } else if (this.secondCategoryCode) {
      this.parentCategory.code = this.secondCategoryCode
      this.skuCategory.parent = this.parentCategory
    } else if (this.firstCategoryCode) {
      this.parentCategory.code = this.firstCategoryCode
      this.skuCategory.parent = this.parentCategory
    }


    console.log(this.skuCategory.parent)
    SkuCategoryApi.create(this.skuCategory).then(resp => {
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
    // 允许修改层级，但是后端会做校验。有子分类的情况下，层级不允许修改
    this.skuCategory.parent = null
    if (this.fourCategoryCode) {
      this.parentCategory.code = this.fourCategoryCode
      this.skuCategory.parent = this.parentCategory
    } else if (this.thirdCategoryCode) {
      this.parentCategory.code = this.thirdCategoryCode
      this.skuCategory.parent = this.parentCategory
    } else if (this.secondCategoryCode) {
      this.parentCategory.code = this.secondCategoryCode
      this.skuCategory.parent = this.parentCategory
    } else if (this.firstCategoryCode) {
      this.parentCategory.code = this.firstCategoryCode
      this.skuCategory.parent = this.parentCategory
    }
    // if (this.secondCategoryCode) {
    //   this.secondCategory.code = this.secondCategoryCode
    //   this.skuCategory.parent = this.secondCategory
    // } else if (this.firstCategoryCode) {
    //   this.firstCategory.code = this.firstCategoryCode
    //   this.skuCategory.parent = this.firstCategory
    // }
    SkuCategoryApi.edit(this.skuCategory).then(resp => {
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

