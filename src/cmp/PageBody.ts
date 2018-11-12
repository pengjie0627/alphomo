import { Component, Prop, Vue } from 'vue-property-decorator'
import PageHeader from './PageHeader.vue'

@Component({
  name: 'PageBody',
  components: {
    PageHeader
  }
})
export default class PageBody extends Vue {
  @Prop({
    type: Array,
    default: function () {
      return []
    }
  })
  menu: any[]
}
