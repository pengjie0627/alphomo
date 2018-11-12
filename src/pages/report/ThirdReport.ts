import { Component, Vue, Watch } from 'vue-property-decorator'
@Component({
  components: {
  }
})
export default class ThirdReport extends Vue {
  thirdUrl = ''
  @Watch('$route')
  onRouteChange(to: any, from: any) {
    // this.thirdUrl = decodeURI(to.fullPath.substring(17, to.fullPath.length))
    this.thirdUrl = this.$route.query.url
    console.log(this.thirdUrl)
    this.$forceUpdate()
  }
  mounted() {
    this.thirdUrl = this.$route.query.url
    // this.thirdUrl = decodeURI(this.$route.fullPath.substring(17, this.$route.fullPath.length))
    console.log(this.thirdUrl)
  }
}
