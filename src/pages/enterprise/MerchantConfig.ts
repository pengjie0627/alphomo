import { Vue, Component, Watch } from 'vue-property-decorator'
import OssResult from 'model/image/OssResult'
import QfImgUpload from 'cmp/img-upload/Index.vue'
import { FormValidator, Loading } from 'fant'
import Dictionary from 'model/basicdata/dictionary/Dictionary'
import Merchant from 'model/framework/merchant/Merchant'
import PageBody from 'cmp/PageBody.vue'
import DictionaryApi from 'http/basicdata/dictionary/DictionaryApi'
import RegionApi from 'http/region/RegionApi'
import MerchantApi from 'http/framework/merchant/MerchantApi'
import Region from 'model/region/Region'

class DOssObject {
  storageId: Nullable<string>
  imageUrl: Nullable<string>
  objectUrl: Nullable<string>
  url: Nullable<string>
}

@Component({
  name: 'MerchantConfig',
  components: {
    QfImgUpload,
    PageBody
  }
})
export default class MerchantConfig extends Vue {
  imgUploadData: DOssObject[] = []
  validator = new FormValidator()
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
  imgUrl: OssResult = new OssResult()
  industry: Dictionary[] = []
  merchant: Merchant = new Merchant()
  $refs: {
    enterprise: any
  }
  menu = [{
    name: '企业设置',
    url: 'enterpriceEdit'
  }]

  data() {
    return {
      merchant: {
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

  mounted() {
    this.getMerchant()
    this.onProvinceChange(this.province)
    this.onCityChange(this.city)
    this.onCountyChange(this.county)
    this.$refs.enterprise.focus()
    this.validator.push({
      enterName: [
        {
          validate: () => {
            if (!this.merchant.name) {
              return false
            }
            return true
          }, message: '请输入企业名称'
        }
      ],
      catogory: [
        {
          validate: () => {
            if (!this.merchant.industry) {
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
            if (!this.merchant.address) {
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
      }]
    })
    this.getIndustry()
    this.getAddress('province', '')
  }

  getMerchant() {
    let loading = Loading.show()
    this.imgUploadData = []
    MerchantApi.get().then((resp) => {
      this.merchant = resp.data
      if (this.merchant.province) {
        this.provinceObj = this.merchant.province
        this.province = this.merchant.province.text!
      }
      if (this.merchant.city) {
        this.cityObj = this.merchant.city
        this.city = this.merchant.city.text!
      }
      if (this.merchant.district) {
        this.countyObj = this.merchant.district
        this.county = this.merchant.district.text!
      }
      if (this.merchant.street) {
        this.streetObj = this.merchant.street
        this.street = this.merchant.street.text!
      }
      if (resp.data.logoImage) {
        let imgObj: DOssObject = new DOssObject()
        imgObj.storageId = resp.data.logoImage.storageId
        imgObj.url = resp.data.logoImage.url
        this.imgUploadData.push(imgObj)
      }
      loading.hide()
    }).catch((err) => {
      loading.hide()
      this.$message.error(err)
    })
  }

  getImage(imgs: Array<OssResult>) {
    console.log(imgs)
    this.imgUrl = imgs[0]
  }

  get model() {
    if (Array.isArray(this.imgUploadData)) {
      return this.imgUploadData
    } else {
      if (this.imgUploadData) {
        let result: DOssObject[] = []
        result.push(this.imgUploadData)
        return result
      } else {
        return []
      }
    }
  }

  set model(item: DOssObject[]) {
    if (Array.isArray(this.imgUploadData)) {
      this.$emit('input', item)
    } else {
      this.$emit('input', item.length > 0 ? item[0] : null)
    }
  }

  getIndustry() {
    DictionaryApi.list('industry').then(resp => {
      if (resp && resp.success) {
        this.industry = resp.data
      }
    }).catch(error => {
      this.$message.error(error.message)
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

  savemodify() {
    this.validator.validate(true).then(() => {
      let logoObj: OssResult = new OssResult()
      if (this.imgUploadData.length === 1) {
        logoObj.storageId = this.imgUploadData[0].storageId
        logoObj.url = this.imgUploadData[0].url
      }
      this.merchant.logoImage = logoObj
      this.merchant.province = this.provinceArray.filter(item => {
        return item.text === this.province
      })[0]
      this.merchant.city = this.cityArray.filter(item => {
        return item.text === this.city
      })[0]
      this.merchant.district = this.countyArray.filter(item => {
        return item.text === this.county
      })[0]
      this.merchant.street = this.streetArray.filter(item => {
        return item.text === this.street
      })[0]
      MerchantApi.saveModify(this.merchant).then(resp => {
        if (resp && resp.success) {
          this.$message.success('保存成功！')
          // @ts-ignore
          this.$root.$children[0].$children[0].getMerchant()
          this.getMerchant()
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    })

  }
}
