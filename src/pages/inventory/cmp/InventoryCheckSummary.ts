import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import CheckInventory from 'model/inventory/check/CheckInventory'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({ components: {} })
export default class InventoryCheckSummary extends Vue {
  @Prop()  // 商品行数组
  bill: CheckInventory

  // 盈亏总额
  amount: number = 0
  // 盘盈总额
  profitAmount: number = 0
  // 盘亏总额
  lossAmount: number = 0
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  @Watch('bill', { deep: true })
  watchSkuLine(value: CheckInventory) {
    this.profitAmount = value.profitAmount
    this.lossAmount = value.lossAmount
    this.amount = value.amount
  }

}

