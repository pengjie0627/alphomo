import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'QueryCondition'
})
export default class QueryCondition extends Vue {
  opened = false

  onSearch() {
    this.$emit('search', this.opened)
  }

  onReset() {
    this.$emit('reset')
  }

  onToggle() {
    this.opened = !this.opened
    this.$emit('toggle', this.opened)
  }

  doToggle(){
    this.opened=false;
    this.$emit('toggle',this.opened)
  }
}
