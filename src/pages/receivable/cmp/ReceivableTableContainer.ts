import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'PayableTableContainer',
  components: {}
})
export default class PayableTableContainer extends Vue {
  @Prop({
    type: String,
    default: 'left'
  }) pagePosition: string
}

