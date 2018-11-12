import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'InputEx',
  components: {}
})
export default class InputEx extends Vue {
  showInput: boolean
  @Prop()
  value: String
  $refs: {
    input: any // 输入框
  }

  data() {
    return {
      showInput: false
    }
  }


  mounted() {
    console.log(this.value)
  }


  onClick() {
    this.showInput = true
    this.$nextTick(() => {
      this.$refs.input.focus()
    })
  }

  onChange() {
    this.$emit('input', this.value)
  }

  onBlur() {
    this.showInput = false
  }
}
