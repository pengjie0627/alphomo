import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class ImgCheck extends Vue {
  imgUrl = ''
  showCancel = false
  $refs: {
    img: any,
    imgWrap: any
  }
  doConfirm() {
    // todo
    this.$emit('hide')
  }
  doCancel() {
    // todo
    this.$emit('hide')
  }
  mounted() {
    // let imgWidth = this.$refs.img.width
    // let imgHeight = this.$refs.img.heigth
    // let imgWrapWidth = this.$refs.imgWrap.width
    // let imgWrapHeight = this.$refs.imgWrap.height
  }
}
