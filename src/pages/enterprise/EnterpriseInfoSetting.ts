import { Vue, Component } from 'vue-property-decorator'
import EnterpriseInfo from 'pages/enterprise/cmp/EnterpriseInfoSetting.vue'

@Component({
  name: 'enterprise-info-setting',
  components: {
    EnterpriseInfo
  }
})
export default class EnterpriseInfoSetting extends Vue {
}
