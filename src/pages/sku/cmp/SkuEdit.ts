import { Component, Vue, Watch } from 'vue-property-decorator'
import { Dialog, FormValidator, Loading } from 'fant'
import Sku from 'model/basicdata/sku/Sku'
import SkuApi from 'http/basicdata/sku/SkuApi'
import ConstantMgr from 'mgr/ConstantMgr'
import DictionaryApi from 'http/basicdata/dictionary/DictionaryApi'
import Dictionary from 'model/basicdata/dictionary/Dictionary'
import SelectCategory from 'pages/sku/cmp/SelectCategory.vue'
import SkuCategory from 'model/basicdata/sku/SkuCategory'
import Supplier from 'model/basicdata/supplier/Supplier'
import Search from 'cmp/Search.vue'
import PermissionMgr from 'mgr/PermissionMgr'
import PageBody from 'cmp/PageBody.vue'
import SupplierApi from 'http/basicdata/supplier/SupplierApi'
import QueryParam from 'model/request/QueryParam'
import Ucn from 'model/entity/Ucn'
import SkuMunit from 'model/basicdata/sku/SkuMunit'
import MerchantConfig from 'model/framework/merchant/MerchantConfig'
import { State } from 'vuex-class'

@Component({
  components: {
    PageBody,
    SelectCategory,
    Search
  }

})
export default class SkuEdit extends Vue {
  @State('merchantConfig') merchantConfig: MerchantConfig
  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限
  menuList = [{
    name: '商品',
    url: '/skuList'
  }, {
    name: '编辑'
  }]
  presentation: string = 'edit'
  supplierList: Supplier[] = []
  purchaseGroupList: Dictionary[] = []
  supplier: Supplier = new Supplier()
  sku: Sku = new Sku()
  id: string = ''
  validator = new FormValidator()
  // 界面长度限制
  limits = ConstantMgr.limits.sku
  autoCreate: boolean = true
  munitList: Dictionary[] = []
  munit: string = '包'
  isEdit: boolean = false
  showInput: boolean = false
  category: SkuCategory = new SkuCategory()
  title: string = '新建商品'
  manyPack: boolean = false // 多包装
  min: number = 0.000000001

  data() {
    return {
      sku: {
        name: '',
        munit: '包',
        category: {
          name: 'test'
        },
        wholePrice: 0,
        minSalePrice: 0,
        refPurchasePrice: 0,
        salePrice: 0
      }
    }
  }

  created() {
    this.id = this.$route.query.id
    if (this.id && this.id.length > 0) {
      this.menuList = [{
        name: '商品',
        url: '/skuList'
      }, {
        name: '编辑'
      }]
      this.presentation = 'edit'
      this.isEdit = true
      this.title = '编辑商品'
      SkuApi.get(this.id).then((resp) => {
        this.sku = resp.data
        this.category = resp.data.category!
        this.getPurchaseGroup()
        this.getSupplierList()
        this.getPageList()
      }).catch(error => {
        this.$message.error(error.message)
      })
    } else {
      this.menuList = [{
        name: '商品',
        url: '/skuList'
      }, {
        name: '新建'
      }]
      this.presentation = 'create'
      this.getCode()
      this.getPurchaseGroup()
      this.getSupplierList()
    }
    this.sku.munit = ''
    this.getMunit()
  }

  mounted() {
    this.watchMunit(this.sku.munit!)
    this.watchMunitList(this.munitList)
    this.validator.push({
      name: [
        { required: true, message: '名称为必填项' }
      ],
      input: [
        {
          validate: (value: any) => {
            if (value > 0) {
              return true
            } else {
              return false
            }
          },
          message: '输入值需大于零。'
        }
      ],
      pakgeMunit: [
        { required: true, message: '单位为必填项' },
        { maxLength: 12, message: '单位最多12个字符' },
        {
          validate: (value: any) => {
            let ary = this.sku.skuMunitList.map((m) => {
              return m.name
            })
            let result: any[] = []
            ary.push(this.sku.munit)
            ary.forEach((item, index) => {
              for (let i = index + 1; i < ary.length - 1; i++) {
                if (ary[index] === ary[i]) {
                  result.push(ary[index])
                }
              }
            })
            if (result.length > 0) {
              if (result[0] === value) {
                return false
              } else {
                return true
              }
            } else {
              return true
            }
          },
          message: '单位不得选择已存在与多包装设置中的新增单位。'
        }
      ],
      munit: [
        { required: true, message: '单位为必填项' },
        { maxLength: 12, message: '单位最多12个字符' },
        {
          validate: (value: any) => {
            let ary = this.sku.skuMunitList.map((m) => {
              return m.name
            })
            if (ary.length > 0) {
              if (ary.includes(value) === true) {
                return false
              } else {
                return true
              }
            } else {
              return true
            }
          },
          message: '单位不得选择已存在与多包装设置中的新增单位。'
        }
      ],
      barcode: [{
        // minLength: 6, message: '商品条码不能低于6个字符'
        validate: (value: any) => {
          if (value && value.length < 6) {
            return false
          } else {
            return true
          }
        },
        message: '商品条码不能低于6个字符'
      }, {
        validate: (value: any) => {
          let numReg = /^\d{6,14}$/
          if (value && !numReg.test(value)) {
            return false
          } else {
            return true
          }
        },
        message: '请输入正确的商品条码'
      }],
      code: [{
        required: true, message: '商品编号必填'
      }],
      category: [{
        required: true, message: '必须选择一个商品分类'
      }],
      salePrice: [{
        min: 0, message: '零售价不能低于0'
      }, {
        max: 999999.99, message: '零售价不能高于999999.99'
      },
      {
        validate: (value: Number) => {
          if (value < Number(this.sku.minSalePrice)) {
            return false
          }
          return true
        },
        message: '零售价不能低于最低售价'
      }],
      minSalePrice: [
        {
          min: 0, message: '最低售价不能低于0'
        }, {
          max: 999999.99, message: '最低售价不能高于999999.99'
        }],
      wholePrice: [{
        min: 0, message: '批发价不能低于0'
      }, {
        max: 999999.99, message: '批发价不能高于999999.99'
      },
      {
        validate: (value: Number) => {
          if (value < Number(this.sku.minSalePrice)) {
            return false
          }
          return true
        },
        message: '批发价不能低于最低售价'
      }],
      refPurchasePrice: [{
        min: 0, message: '参考进价(含税)不能低于0'
      }, {
        max: 999999.99, message: '参考进价(含税)不能高于999999.99'
      },
      {
        validate: (value: Number) => {
          if (value < Number(this.sku.taxExcRefPurchasePrice)) {
            return false
          }
          return true
        },
        message: '参考进价(含税)不能低于参考进价(去税)'
      }],
      taxExcRefPurchasePrice: [{
        min: 0, message: '参考进价(去税)不能低于0'
      }, {
        max: 999999.99, message: '参考进价(去税)不能高于999999.99'
      }],
      inputTaxRate: [{
        min: 0, message: '进项税率不能低于0'
      }],
      outputTaxRate: [{
        min: 0, message: '销项税率不能低于0'
      }],
      taxClassification: [{
        validate: (value: any) => {
          if (value && value.length !== 19) {
            return false
          } else {
            return true
          }
        },
        message: '税收分类编码只能为19位数字'
      }]
    })
  }

  @Watch('munitList')
  watchMunitList(value: Array<Dictionary>) {
    if (value) {
      this.munitList = value
    }
  }

  @Watch('sku.munit')
  watchMunit(value: string) {
    if (value) {
      this.sku.munit = value
    }
  }

  getCode() {
    SkuApi.create().then((resp) => {
      this.sku = resp.data
      this.sku.wholePrice = 0
      this.sku.refPurchasePrice = 0
      this.sku.salePrice = 0
      this.sku.minSalePrice = 0
      this.sku.skuMunitList = []
      this.sku.taxExcRefPurchasePrice = 0
      this.getPageList()
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  changeAmount() {
    if (this.sku.wholePrice.toString() === '') {
      this.sku.wholePrice = 0
    }
    if (this.sku.salePrice.toString() === '') {
      this.sku.salePrice = 0
    }
    if (this.sku.minSalePrice.toString() === '') {
      this.sku.minSalePrice = 0
    }
  }

  changeRefPurchasePrice(isTaxExc: boolean) {
    if (isTaxExc) {
      if (this.sku.taxExcRefPurchasePrice.toString() === '' || this.sku.taxExcRefPurchasePrice < 0) {
        this.sku.taxExcRefPurchasePrice = 0
      }
      this.sku.refPurchasePrice = Number((this.sku.taxExcRefPurchasePrice * (100 + Number(this.sku.inputTaxRate)) / 100).toFixed(this.merchantConfig.purchasePriceBit))
    } else {
      if (this.sku.refPurchasePrice.toString() === '' || this.sku.refPurchasePrice < 0) {
        this.sku.refPurchasePrice = 0
      }
      this.sku.taxExcRefPurchasePrice = Number((100 * this.sku.refPurchasePrice / (100 + Number(this.sku.inputTaxRate))).toFixed(this.merchantConfig.purchasePriceBit))
    }
  }

  changeInputTaxRate() {
    if (this.sku.inputTaxRate < 0) {
      this.sku.inputTaxRate = 0
    }
    this.sku.refPurchasePrice = Number((this.sku.taxExcRefPurchasePrice * (100 + Number(this.sku.inputTaxRate)) / 100).toFixed(this.merchantConfig.purchasePriceBit))
  }

  priceFormatter(row: any, column: any, value: string) {
    if (value && Number(value) !== 0) {
      return Number(value).toFixed(2)
    } else {
      return '0.00'
    }
  }

  getPageList() {
    if (this.sku.skuMunitList.length === 0) {
      let pack = new SkuMunit()
      pack.times = 0
      this.sku.skuMunitList.push(pack)
      return
    }
    if (this.isEdit === true) {
      if (this.sku.skuMunitList.length > 0) {
        this.manyPack = true
      }
    }
  }

  getPageLabel(index: number) {
    let i = index + 1
    return '单位-' + i
  }

  onAddMunit() {
    let pack = new SkuMunit()
    this.sku.skuMunitList.push(pack)
  }

  onDeleteMunit(index: number) {
    this.sku.skuMunitList.splice(index, 1)
  }

  checkPackList() {
    if (this.manyPack === false) {
      this.sku.skuMunitList = []
    }
  }

  getMunit() {
    let type: string = 'munit'
    DictionaryApi.list(type).then((resp) => {
      this.munitList = resp.data
      this.watchMunitList(this.munitList)
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  getPurchaseGroup() {
    let type: string = 'purchaseGroup'
    DictionaryApi.list(type).then((resp) => {
      this.purchaseGroupList = resp.data
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  getSupplierList() {
    let query: QueryParam = new QueryParam()
    SupplierApi.query(query).then((resp) => {
      this.supplierList = resp.data
      if (this.sku.supplier !== undefined && this.sku.supplier !== null) {
        this.supplierList.forEach((val, index, array) => {
          if (this.sku.supplier!.id === val.id) {
            this.supplier = val
          }
        })
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  onCancel() {
    this.$router.back()
  }

  selectCategory() {
    new Dialog(SelectCategory, {
      onConfirm: (obj: SkuCategory) => {
        this.sku.category = obj
        this.category = obj
      }
    }).show()
  }

  onSave() {
    this.validator.validate(true).then(() => {
      if (this.supplier.name !== null) {
        this.sku.supplier = this.setSupplier(this.supplier)
      }
      this.checkPackList()
      if (!this.id) {
        this.save()
      } else {
        this.update()
      }
    })
  }

  onSaveAndCreate() {
    this.validator.validate(true).then(() => {
      if (this.supplier.name !== null) {
        this.sku.supplier = this.setSupplier(this.supplier)
      }
      this.checkPackList()
      let loading = Loading.show()
      SkuApi.saveNew(this.sku).then(resp => {
        loading.hide()
        this.$message.success(ConstantMgr.tips.saveNewAndModifySuccessTip)
        this.sku = new Sku()
        this.supplier = new Supplier()
        this.getCode()
      }).catch(error => {
        loading.hide()
        this.$message.error(error.message)
      })
    })
  }

  save() {
    let loading = Loading.show()
    SkuApi.saveNew(this.sku).then(resp => {
      loading.hide()
      this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
      this.$emit('hide')
      this.$router.push('/skuList')
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  update() {
    let loading = Loading.show()
    SkuApi.edit(this.sku).then(resp => {
      loading.hide()
      this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
      this.$emit('hide')
      this.$router.push('/skuList')
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  setSupplier(supplier: Supplier) {
    let ucn: Ucn = new Ucn()
    ucn.id = this.supplier.id
    ucn.name = this.supplier.name
    ucn.code = this.supplier.code
    return ucn
  }
}

