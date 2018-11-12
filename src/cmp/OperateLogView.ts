import { Component, Prop, Vue } from 'vue-property-decorator'
import OperateLog from 'model/operatelog/OperateLog'
import { DateUtil } from 'fant'

@Component({
  name: 'OperateLogView',
  components: {}
})
export default class OperateLogView extends Vue {
  @Prop({
    type: Array,
    default: function () {
      return []
    }
  })
  logs: OperateLog[]

  operateTimeFmt(time: Date) {
    return DateUtil.format(time, 'yyyy-MM-dd HH:mm:ss')
  }
}
