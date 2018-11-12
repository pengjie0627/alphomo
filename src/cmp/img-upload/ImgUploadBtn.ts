import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import ImageApi from 'http/image/ImageApi'
import OssImage from 'model/image/OssImage'

class DOssObject {
  storageId: Nullable<string>
  imageUrl: Nullable<string>
  objectUrl: Nullable<string>
  url: Nullable<string>
}

@Component({
  name: 'qf-img-upload-btn',
  components: {}
})
export default class ImageUpload extends Vue {
  @Prop({
    type: String,
    default: 'default'
  })
  type: string// 按钮类型，手机上传(mobile)、本地上传(default)
  @Prop()
  uploadType: string// 上传图片类型，shop 、sku
  @Prop({
    type: Number,
    default: 5
  })
  sizeLimit: number
  @Prop({
    type: Number,
    default: 1
  })
  total: number
  @Prop({
    type: String,
    default: 'plat'
  })
  target: string
  imageObj: OssImage = new OssImage()
  @Prop({
    type: Array
  })
  imgList: Array<DOssObject>
  imgs: Array<DOssObject>

  @Watch('imgList')
  watchImgs(value: Array<DOssObject>) {
    this.imgList = value
  }

  mounted() {
    this.watchImgs(this.imgList)
  }

  /*
   * 选择图片后的回调
   */
  onImageChanged(ev: any) {
    let $this = this
    $this.imgs = []
    let files = ev.target.files
    if (!this.onCheck(files)) {
      ($this.$refs.input as HTMLInputElement).value = ''
      return
    }
    console.log(files)
    let file = ev.target.files[0]
    // if (file.size > 3 * 1024 * 1024) {
    //   $this.$message.error('图片大于3M')
    //   return
    // }
    $this.imageObj.name = file.name
    if (file.type.split('/').length === 2) {
      $this.imageObj.ext = file.type.split('/')[1]
    }
    let reader = new FileReader()
    reader.readAsDataURL(file) // 读出 base64
    reader.onloadend = function () {
      // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
      $this.imageObj.bytes = reader.result
      let dossObject: DOssObject = new DOssObject()
      ImageApi.fileUpload($this.imageObj).then((resp) => {
        ($this.$refs.input as HTMLInputElement).value = ''
        dossObject.storageId = resp.data.storageId
        dossObject.url = resp.data.url
        $this.imgs.push(dossObject)
        $this.$emit('onChanged', $this.imgs)
      }).catch((e) => {
        $this.$message.error(e.message)
      })

    }
  }

  // /*
  //  * 弹出扫码框
  //  */
  // onShowQrcodeDialog() {
  //   let dialog = new Dialog(QrcodeDialogView, {
  //     uploadType: this.uploadType,
  //     onChanged: (imgList: DOssObject[]) => {
  //       this.$emit('onChanged', imgList)
  //     }
  //   })
  //   dialog.show()
  // }

  /*
   * 有效性判断
   */
  onCheck(files: File[]) {
    if (!files.length) {
      return false
    }
    if (files.length > this.total) {
      this.$message.error('上传图片数量超过限制，请重新上传')
      return false
    }
    for (let i = 0; i < files.length; i++) {
      let size = files[i].size / 1024
      if (size > this.sizeLimit * 1000) {
        this.$message.error(`图片不能大于3M`)
        return false
      }
      if (files[i].type.indexOf('image') < 0) {
        this.$message.error(`图片格式不正确，请重新选择图片`)
        return false
      }
    }
    return true
  }
}
