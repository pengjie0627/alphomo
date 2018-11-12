import Vue from 'vue'
import Component from 'vue-class-component'
import { FormValidator, Loading } from 'fant'
import Shop from 'model/basicdata/shop/Shop'
import ShopApi from 'http/basicdata/shop/ShopApi'
import ConstantMgr from 'mgr/ConstantMgr'
import ContactInfo from 'model/basicdata/ContactInfo'
import PermissionMgr from 'mgr/PermissionMgr'
import RegionApi from 'http/region/RegionApi.ts'
import { Watch } from 'vue-property-decorator'
import ShopAddress from 'model/basicdata/shop/ShopAddress'
import Region from 'model/region/Region'

@Component({
  components: {}

})
export default class ShopEdit extends Vue {
  shop: Shop = new Shop()
  shopAddress: ShopAddress = new ShopAddress()
  onConfirm: Function
  id: string = ''
  validator = new FormValidator()
  // 界面长度限制
  limits = ConstantMgr.limits.shop
  title: string = '编辑门店'
  province = ''
  provinceObj: Region
  provinceArray: Region[] = []
  city = ''
  cityObj: Region
  cityArray: Region[] = []
  county = ''
  countyObj: Region
  countyArray: Region[] = []
  street = ''
  streetObj: Region
  streetArray: Region[] = []
  addressDtl = ''
  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限

  data() {
    return {
      shop: {
        contactInfo: {
          address: ''
        },
        shopAddress: {
          address: ''
        }
      },
      province: {
        id: ''
      },
      city: {
        id: ''
      },
      distinct: {
        id: ''
      },
      street: {
        id: ''
      }
    }
  }

  doInitData() {
    this.shop.contactInfo = new ContactInfo()
  }

  @Watch('province')
  onProvinceChange(value: string) {
    if (value) {
      this.province = value
      let id: string = ''
      if (this.province) {
        id = this.provinceObj.id!
      }
      if (this.provinceArray.length > 0) {
        let obj = this.provinceArray.filter(item => {
          return item.text === value
        })
        id = obj[0].id!
      }
      this.getAddress('city', id)
    }
  }

  @Watch('city')
  onCityChange(value: string) {
    if (value) {
      this.city = value
      let id: string = ''
      if (this.cityObj) {
        id = this.cityObj.id!
      }
      if (this.cityArray.length > 0) {
        let obj = this.cityArray.filter(item => {
          return item.text === value
        })
        id = obj[0].id!
      }
      this.getAddress('district', id)
    }
  }

  @Watch('county')
  onCountyChange(value: string) {
    if (value) {
      let id: string = ''
      if (this.countyObj) {
        id = this.countyObj.id!
      }
      if (this.countyArray.length > 0) {
        let obj = this.countyArray.filter(item => {
          return item.text === value
        })
        id = obj[0].id!
      }
      this.getAddress('street', id)
    }
  }

  beforeMount() {
    ShopApi.get(this.id).then((resp) => {
      this.shop = resp.data
      if (resp.data.shopAddress) {
        this.shop.shopAddress = resp.data.shopAddress
        this.shopAddress = resp.data.shopAddress
        if (this.shop.shopAddress.province) {
          this.provinceObj = this.shop.shopAddress.province
          this.province = this.shop.shopAddress.province.text!
        }
        if (this.shop.shopAddress.city) {
          this.cityObj = this.shop.shopAddress.city
          this.city = this.shop.shopAddress.city.text!
        }
        if (this.shop.shopAddress.district) {
          this.countyObj = this.shop.shopAddress.district
          this.county = this.shop.shopAddress.district.text!
        }
        if (this.shop.shopAddress.street) {
          this.streetObj = this.shop.shopAddress.street
          this.street = this.shop.shopAddress.street.text!
        }
        if (this.shop.shopAddress.address) {
          this.addressDtl = this.shop.shopAddress.address
        }
        this.onProvinceChange(this.province)
        this.onCityChange(this.city)
        this.onCountyChange(this.county)
        this.getAddress('province', '')
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  mounted() {
    this.validator.push({
      name: [
        { required: true, message: '名称为必填字段' },
        { minLength: 2, message: '名称不能少于2个字符' },
        { maxLength: 20, message: '名称不能大于20个字符' }
      ],
      code: [
        { required: true, message: '编号为必填字段' }
      ],
      shortName: [
        { required: true, message: '门店简称为必填字段' },
        { minLength: 2, message: '门店简称不能少于2个字符' },
        { maxLength: 12, message: '门店简称不能大于12个字符' }
      ],
      province: [
        {
          validate: () => {
            if (!this.province) {
              return false
            }
            return true
          }, message: '请选择省'
        }
      ],
      city: [
        {
          validate: () => {
            if (!this.city) {
              return false
            }
            return true
          }, message: '请选择市'
        }
      ],
      county: [
        {
          validate: () => {
            if (!this.county) {
              return false
            }
            return true
          }, message: '请选择区/县'
        }
      ],
      street: [
        {
          validate: () => {
            if (!this.street) {
              return false
            }
            return true
          }, message: '请选择街道'
        }
      ],
      addressDtl: [
        {
          validate: () => {
            if (!this.addressDtl) {
              return false
            }
            return true
          }, message: '请输入详细地址'
        }
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
      this.update()
    })
  }

  getAddress(level: string, code: string) {
    RegionApi.queryAddress(level, code).then(resp => {
      if (resp && resp.success) {
        if (level === 'province') {
          this.provinceArray = resp.data
        } else if (level === 'city') {
          this.cityArray = resp.data
          let isCityShow: boolean = false
          this.cityArray.forEach((item) => {
            if (this.city === item.text) {
              isCityShow = true
            }
          })
          if (!isCityShow) {
            this.city = ''
            this.county = ''
            this.street = ''
          }
        } else if (level === 'district') {
          this.countyArray = resp.data
          let isDistictShow: boolean = false
          this.countyArray.forEach((item) => {
            if (this.county === item.text) {
              isDistictShow = true
            }
          })
          if (!isDistictShow) {
            this.county = ''
            this.street = ''
          }
        } else {
          this.streetArray = resp.data
          let isStreetShow: boolean = false
          this.streetArray.forEach((item) => {
            if (this.street === item.text) {
              isStreetShow = true
            }
          })
          if (!isStreetShow) {
            this.street = ''
          }
        }
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  update() {
    let loading = Loading.show()
    this.shopAddress.province = this.provinceArray.filter(item => {
      return item.text === this.province
    })[0]
    this.shopAddress.city = this.cityArray.filter(item => {
      return item.text === this.city
    })[0]
    this.shopAddress.district = this.countyArray.filter(item => {
      return item.text === this.county
    })[0]
    this.shopAddress.street = this.streetArray.filter(item => {
      return item.text === this.street
    })[0]
    this.shopAddress.address = this.addressDtl
    this.shop.shopAddress = this.shopAddress
    ShopApi.saveModify(this.shop).then(resp => {
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

