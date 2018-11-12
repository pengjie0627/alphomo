import { Component, Prop, Vue } from 'vue-property-decorator'
import ConstantMgr from 'mgr/ConstantMgr'

@Component({
  name: 'PageHeader'
})
export default class PageHeader extends Vue {
  @Prop({
    type: Array,
    default: function () {
      return []
    }
  })
  menu: any[]
  menuList: any[] = []

  mounted() {
    let currentMenu = null
    ConstantMgr.backendMenus.forEach((item: any) => {
      if (item.url === this.$route.path) {
        currentMenu = item
        return
      }
      if (item.children) {
        item.children.forEach((child: any) => {
          if (child.url === this.$route.path) {
            currentMenu = child
            return
          }
        })
      }
    })
    if (currentMenu && this.menu.length === 0) {
      this.menuList.push(currentMenu)
    } else {
      this.menuList = this.menu
    }
  }

  onBack() {
    this.$router.back()
  }
}
