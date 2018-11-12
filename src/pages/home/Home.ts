import Vue from 'vue'
import Component from 'vue-class-component'
import { DateUtil, Loading } from 'fant'
import InventoryReportApi from 'http/inventory/report/InventoryReportApi'
import QueryParam from 'model/request/QueryParam'
import SaleReportApi from 'http/sale/report/SaleReportApi.ts'
import { Watch } from 'vue-property-decorator'
import FilterParam from 'model/request/FilterParam'
import UserConfigApi from 'http/framework/user/UserConfigApi'
import User from 'model/framework/user/User'
import { State } from 'vuex-class'
import PageBody from 'cmp/PageBody.vue'
import { sessionStorage } from 'mgr/BrowserMgr'
import Merchant from 'model/framework/merchant/Merchant'
import FunctionPerm from 'model/framework/role/FunctionPerm'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
    name: 'Home',
    components: { PageBody }
  }
)
export default class Home extends Vue {
  @State('user') user: User
  // 查询条件
  queries: QueryParam = new QueryParam()
  qty: number = 0
  amount: number = 0
  saleAmount: number = 0
  saleProfit: number = 0
  businessTime: string = '最近7天'
  businessDate: Date[] = []
  isShow: boolean = false
  roleList: any = []
  @State('permission') permission: FunctionPerm[]
  @State('merchant') merchant: Merchant
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  created() {
    let permission = sessionStorage.getItem('vuex').user
    let roles: any[] = []
    if (permission && permission.roles && permission.roles.length > 0) {
      // 对于多角色取并集
      for (let i = 0; i < permission.roles.length; i++) {
        roles.push.apply(roles, permission.roles[i].functionPerms)
      }
      this.roleList = roles
    }
  }

  /**
   * 权限处理
   * @param {string} name
   * @param {number} type
   * @returns {boolean}
   */
  getPermission(name: string) {
    let oArr: any = ''
    oArr = this.roleList.filter((item: any) => {
      let itemName = item.name.split('.')
      if (itemName[1] === '系统' && item.name.split('.')[2] === '系统设置') {
        if (name === '企业设置') {
          return true
        } else if (name === '业务设置') {
          return true
        } else if (name === '员工管理') {
          return true
        } else if (name === '角色管理') {
          return true
        } else {
          return itemName[1] === name && item.name.split('.')[2] === '查询'
        }
      } else {
        return itemName[1] === name && item.name.split('.')[2] === '查询'
      }
    })
    if (oArr.length > 0) {
      return true
    } else {
      return false
    }
  }

  mounted() {
    this.getStorage()
    this.getSale()
    this.onBusinessTimeChange(this.businessTime)
    this.getByKey()
  }

  getByKey() {
    let key = 'noDisplayInitialization'
    UserConfigApi.getByKey(this.user.id!, key).then((resp) => {
      this.isShow = !resp.data
    })
  }

  @Watch('businessTime')
  onBusinessTimeChange(value: string) {
    let today: Date = DateUtil.clearTime(new Date())
    let thisWeek: Date = DateUtil.clearTime(DateUtil.addDate(new Date(), -6))
    let thisMonth: Date = DateUtil.clearTime(DateUtil.addMonth(new Date(), -1))
    switch (value) {
      case '最近7天':
        this.businessDate = [thisWeek, today]
        break
      case '最近1个月':
        this.businessDate = [thisMonth, today]
        break
      case '全部':
        this.businessDate = []
        break
    }
    this.getSale()
  }

  doGoRoute(route: string, role: string) {
    if (this.getPermission(role)) {
      this.$router.replace('/' + route)
    } else {
      this.$message.error('该用户没有此权限')
    }
  }

  setting() {
    this.isShow = false
    let key: string = 'noDisplayInitialization'
    let value: string = 'true'
    let loading = Loading.show()
    UserConfigApi.update(this.user.id!, key, value).then((resp) => {
      this.isShow = false
      loading.hide()
    }).catch((err) => {
      loading.hide()
      this.$message.error(err.message)
    })
  }


  getStorage() {
    let loading = Loading.show()
    this.queries.start = 0
    this.queries.limit = 1
    let filters: FilterParam[] = []
    this.queries.filters = filters
    this.queries.filters.push(new FilterParam('businessDate:[,]',[new Date(),new Date()]))
    InventoryReportApi.queryHome(this.queries).then((res) => {
      if (res && res.success) {
        loading.hide()
        this.qty = res.summary.qty
        this.amount = res.summary.amount
      }
    }).catch((err) => {
      loading.hide()
      this.$message.error(err.message)
    })
  }

  getSale() {
    let loading = Loading.show()
    let start: string = ''
    let end: string = ''
    if (this.businessDate === null || this.businessDate.length === 0) {
      start = ''
      end = ''
    } else {
      start = DateUtil.format(new Date(this.businessDate[0]), 'yyyy-MM-dd')
      end = DateUtil.format(new Date(this.businessDate[1]), 'yyyy-MM-dd')
    }
    SaleReportApi.summaryHome(start, end).then((resp: any) => {
      if (resp && resp.success) {
        loading.hide()
        // todo 接口调用后赋值
        this.saleAmount = resp.data.amount
        this.saleProfit = resp.data.grossAmount
      }
    }).catch((error: any) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }
}
Home.filter('price', (value: string) => {
  if (value) {
    return Number(value).toFixed(2)
  } else {
    return '0.00'
  }
})
Home.filter('fmtThumb', (value: string) => {
  if (!value) return '0.00'
  value = value.toString()
  let intPart = value.split('.')[0] // 之前的处理方式会四舍五入
  let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三let
  let floatPart = '.00' // 预定义小数部分
  let value2Array = value.split('.')

  // =2表示数据有小数位
  if (value2Array.length === 2) {
    let floatStr = '0.' + value2Array[1]
    floatPart = Number(floatStr).toFixed(2).toString() // 拿到小数部分

    if (floatPart.length === 1) { // 补0,实际上用不着
      return intPartFormat + '.' + floatPart.substring(2, floatPart.length) + '0'
    } else {
      return intPartFormat + '.' + floatPart.substring(2, floatPart.length)
    }

  } else {
    return intPartFormat + floatPart
  }
})
