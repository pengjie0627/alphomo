import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class BillViewTitle extends Vue {
  @Prop() // 状态标签
  status: any
  @Prop() // 页面
  title: string

  @Watch('status', { deep: true })
  watchStatus(val: any) {
    this.status = val
  }

  mounted() {
    this.watchStatus(this.status)
  }
}
