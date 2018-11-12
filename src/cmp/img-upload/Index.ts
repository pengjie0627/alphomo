import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import QfImgUploadBtn from './ImgUploadBtn.vue'
import OssResult from 'model/image/OssResult'


class DOssObject {
  storageId: Nullable<string>
  imageUrl: Nullable<string>
  objectUrl: Nullable<string>
  url: Nullable<string>
}

@Component({
  name: 'qf-img-upload',
  components: {
    QfImgUploadBtn
  }
})


export default class ImageUpload extends Vue {

  @Prop({
    type: String,
    default: 'shop'
  })
  uploadType: string// PC端上传图片类型 ，shop 、sku
  @Prop({
    type: String,
    default: 'shop'
  })
  qrUploadType: string// 手机端上传图片类型 ，shop 、shopSku
  @Prop({
    type: String,
    default: 'plat'
  })
  target: string
  @Prop({
    type: Number,
    default: 1
  })
  total: number
  @Prop({
    type: Boolean,
    default: false
  })
  sortable: boolean
  @Prop({
    type: Boolean,
    default: true
  })
  preview: boolean
  @Prop({
    type: Number,
    default: 1024
  })
  sizeLimit: number
  @Prop({
    default: []
  })
  value: DOssObject[] | DOssObject
  imagesUrlList: Array<OssResult> = []
  imgs: Array<DOssObject> = []

  get model() {
    if (Array.isArray(this.value)) {
      return this.value
    } else {
      if (this.value) {
        let result: DOssObject[] = []
        result.push(this.value)
        return result
      } else {
        return []
      }
    }
  }

  set model(item: DOssObject[]) {
    if (Array.isArray(this.value)) {
      this.$emit('input', item)
    } else {
      this.$emit('input', item.length > 0 ? item[0] : null)
    }
  }

  get max() {
    if (!Array.isArray(this.value)) {
      return 1
    }
    return this.total
  }

  onChanged(imgs: DOssObject[]) {
    // this.value = []
    if (Array.isArray(this.value)) {
      for (let i = 0; i < imgs.length; i++) {
        let imgParam: OssResult = new OssResult()
        imgParam.storageId = imgs[i].storageId
        imgParam.url = imgs[i].url
        if (this.value.length >= this.max) {
          this.$message.error('超过上传图片数量限制')
          break
        }
        this.value.push(imgs[i])
        this.imagesUrlList.push(imgParam)
      }
      this.$emit('input', this.value)
      this.$emit('getImage', this.imagesUrlList)
    } else if (imgs.length > 0) {
      this.$emit('input', imgs[0])
    }
  }

  @Watch('imgs')
  watchImgs(value: Array<DOssObject>) {
    this.imgs = value
  }

  onDelete(imgs: DOssObject[]) {
    this.imgs = imgs
    this.imagesUrlList = []
    this.value = imgs
    for (let i = 0; i < imgs.length; i++) {
      let imgParam: OssResult = new OssResult()
      imgParam.storageId = imgs[i].storageId
      imgParam.url = imgs[i].url
      this.imagesUrlList.push(imgParam)
    }
    this.$emit('getImage', this.imagesUrlList)
  }


}
