import { Vue, Component } from 'vue-property-decorator'
// import ConstantMgr from 'mgr/ConstantMgr'
import PermissionMgr from 'mgr/PermissionMgr'
import { State, Action } from 'vuex-class'
import User from 'model/framework/user/User'
import Merchant from 'model/framework/merchant/Merchant'
import PurchaseDialog from 'pages/main/cmp/PurchaseDialog'
import { Dialog, Loading } from 'fant'
import UserApi from 'http/framework/user/UserApi'
import { sessionStorage, storage } from 'mgr/BrowserMgr.js'
import FunctionPerm from 'model/framework/role/FunctionPerm'
import MerchantApi from 'http/framework/merchant/MerchantApi'
import QfNav from 'components/nav/Nav.vue'
import QfNavGroup from 'components/nav/NavGroup.vue'
import QfNavItem from 'components/nav/NavItem.vue'
import MenuApi from 'http/framework/menu/MenuApi'
import EnvUtil from 'util/EnvUtil.js'
import axios from 'axios'

@Component({
  name: 'main-frame',
  components: { QfNav, QfNavGroup, QfNavItem }
})
export default class MainFrame extends Vue {
  popperFlag = false
  merchantName = ''
  merchantUrl = ''
  roleList: any = []
  @State('user') user: User
  @State('permission') permission: FunctionPerm[]
  @State('merchant') merchant: Merchant
  @Action('user') actionUser: Function
  @Action('merchant') actionMerchant: Function
  @Action('merchantConfig') actionMerchantConfig: Function
  @Action('permission') actionPermission: Function
  // backendMenus = PermissionMgr.filterMenus(ConstantMgr.backendMenus)
  backendMenus: any[] = []
  alphamaLoginKey: string = ''
  loaded = false
  jdEnv: boolean = false
  $refs: {
    test: any
  }

  created() {
    this.getMenuList()
    let permission = sessionStorage.getItem('vuex').user
    let roles: any[] = []
    if (permission && permission.roles && permission.roles.length > 0) {
      // 对于多角色取并集
      for (let i = 0; i < permission.roles.length; i++) {
        roles.push.apply(roles, permission.roles[i].functionPerms)
      }
      this.roleList = roles
      // if (this.permission.length === 0) {
      //   this.actionPermission(roles)
      //   console.log(roles)
      // }
    }
  }

  mounted() {
    if (EnvUtil.isJdBranch()) {
      this.jdEnv = true
    }
    this.getMerchant()
    this.alphamaLoginKey = 'alphama-login-user'.concat(this.user.id || '')
    let storageStr = storage.getItem(this.alphamaLoginKey)
    if (!storageStr) {
      sessionStorage.clearItem('vuex')
      this.$message.warning('会话失效，请重新登录。')
      this.$router.push('/login')
    }
    console.log(this)
  }

  showPopper() {
    this.popperFlag = true
  }

  hidePopper() {
    this.popperFlag = false
  }

  onAddEmploy() {
    // todo 跳转到新建员工界面
  }

  onBuy() {
    new Dialog(PurchaseDialog).show()
  }

  toLogin() {
    let loading = Loading.show()
    UserApi.logout().then(resp => {
      if (resp && resp.success) {
        loading.hide()
        this.popperFlag = false
        this.actionUser(null)
        this.actionMerchant(null)
        this.actionMerchantConfig(null)
        this.actionPermission([])
        sessionStorage.clearItem('vuex')
        storage.clearItem('userInfo')
        storage.clearItem(this.alphamaLoginKey)
        this.tokenLogout(resp.data)
        this.$message.success('登出成功')
        this.$router.push('/login')
      }
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })

  }

  toUserCenter() {
    this.$router.push('/userCenter')
    this.$refs.test.doClose()
  }

  toEnterPriseInfo() {
    this.roleList.forEach((item: any) => {
      if (item.code === 'system.system.setup') {
        this.$router.push('/enterpriceEdit')
      }
    })
  }

  get getUserSimpleName() {
    if (this.user && this.user!.name) {
      return this.user!.name!.substring(0, 1)
    } else {
      return ''
    }
  }

  getMerchant() {
    let loading = Loading.show()
    MerchantApi.get().then((resp) => {
      if (resp && resp.success) {
        if (resp.data && resp.data.name) {
          this.merchantName = resp.data!.name!.toString()
          this.merchantUrl = resp.data!.logoImage!.url!
        }
      }
      loading.hide()
    }).catch((err) => {
      loading.hide()
      this.$message.error(err)
    })
  }

  tokenLogout(accessToken: any) {
    if (accessToken) {
      axios.defaults.withCredentials = true
      axios.get(EnvUtil.getVipmroServiceUrl() + `/auth/tokenLogout`, {
        params: {
          accessToken: accessToken
        }
      }).then((resp) => {
        console.log(resp)
      }).catch(() => {
        //
      })
    }
  }

  /**
   * 获取菜单
   */
  private getMenuList() {
    MenuApi.listMenus().then(resp => {
      if (resp.success) {
        PermissionMgr.filterMenus(resp.data).then((menu: any) => {
          this.backendMenus = menu
          setTimeout(() => {
            this.loaded = true
          }, 50)
        })
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }
}
