import { Vue, Component, Watch } from 'vue-property-decorator'
import OssResult from 'model/image/OssResult'
import QfImgUpload from 'cmp/img-upload/Index.vue'
import { FormValidator } from 'fant'
import DictionaryApi from 'http/basicdata/dictionary/DictionaryApi.ts'
import Dictionary from 'model/basicdata/dictionary/Dictionary'
import MerchantApi from 'http/framework/merchant/MerchantApi'
import Merchant from 'model/framework/merchant/Merchant'
import RegionApi from 'http/region/RegionApi.ts'

class DOssObject {
  storageId: Nullable<string>
  imageUrl: Nullable<string>
  objectUrl: Nullable<string>
  url: Nullable<string>
}

@Component({
  name: 'enterprise-info-setting',
  components: {
    QfImgUpload
  }
})
export default class EnterpriseInfoSetting extends Vue {
  imgUploadData: DOssObject[] = []
  validator = new FormValidator()
  enterName = ''
  catogory = ''
  province = ''
  provinceArray: any[] = []
  city = ''
  cityArray: any[] = []
  county = ''
  countyArray: any[] = []
  street = ''
  streetArray: any[] = []
  addressDtl = ''
  owner = ''
  mobile = ''
  imgUrl: OssResult = new OssResult()
  industry: Dictionary[] = []
  $refs: {
    enterprise: any
  }

  @Watch('province')
  onProvinceChange(value: string) {
    if (value) {
      this.province = value
      let obj = this.provinceArray.filter(item => {
        return item.text === value
      })
      this.getAddress('city', obj[0].id)
    }
  }

  @Watch('city')
  onCityChange(value: string) {
    if (value) {
      this.city = value
      let obj = this.cityArray.filter(item => {
        return item.text === value
      })
      this.getAddress('district', obj[0].id)
    }
  }

  @Watch('county')
  onCountyChange(value: string) {
    if (value) {
      this.street = ''
      let obj = this.countyArray.filter(item => {
        return item.text === value
      })
      this.getAddress('street', obj[0].id)
    }
  }

  mounted() {
    this.$refs.enterprise.focus()
    this.validator.push({
      enterName: [
        {
          validate: () => {
            if (!this.enterName) {
              return false
            }
            return true
          }, message: '请输入企业名称'
        }
      ],
      catogory: [
        {
          validate: () => {
            if (!this.catogory) {
              return false
            }
            return true
          }, message: '请选择所属行业'
        }
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
      ]
    })
    this.getIndustry()
    this.getAddress('province', '')
  }

  onToMain() {
    this.$router.push('home')
  }

  getImage(imgs: Array<OssResult>) {
    console.log(imgs)
    this.imgUrl = imgs[0]
  }

  onConfirm() {
    this.validator.validate(true).then(() => {
      // todo 点击确定调用接口
      this.savemodify()
    })
  }

  private getIndustry() {
    DictionaryApi.list('industry').then(resp => {
      if (resp && resp.success) {
        this.industry = resp.data
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  private getAddress(level: string, code: string) {
    RegionApi.queryAddress(level, code).then(resp => {
      if (resp && resp.success) {
        if (level === 'province') {
          this.provinceArray = resp.data
        } else if (level === 'city') {
          this.cityArray = resp.data
        } else if (level === 'district') {
          this.countyArray = resp.data
        } else {
          this.streetArray = resp.data
        }
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  private savemodify() {
    let merchant: Merchant = new Merchant()
    merchant.name = this.enterName
    merchant.industry = this.catogory
    merchant.logoImage = this.imgUrl
    merchant.contact = this.owner
    merchant.phone = this.mobile
    merchant.province = this.provinceArray.filter(item => {
      return item.text === this.province
    })[0]
    merchant.city = this.cityArray.filter(item => {
      return item.text === this.city
    })[0]
    merchant.district = this.countyArray.filter(item => {
      return item.text === this.county
    })[0]
    merchant.street = this.streetArray.filter(item => {
      return item.text === this.street
    })[0]
    merchant.address = this.addressDtl
    MerchantApi.saveModify(merchant).then(resp => {
      if (resp && resp.success) {
        this.$router.push('/home')
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }
}
