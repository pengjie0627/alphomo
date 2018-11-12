import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'SaleTableContainer',
  components: {}
})
export default class SaleTableContainer extends Vue {
  @Prop({
    type: String,
    default: 'left'
  }) pagePosition: string
}
