import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'AddCheckDialog',
  components: {}
})
export default class AddCheckDialog extends Vue {
  /**
   * dialog 取消
   */
  doCancel() {
    this.$emit('hide')
  }

  /**
   * dialog 确认
   */
  doConfirm() {
    this.$emit('hide')
  }
}


