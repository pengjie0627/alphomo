import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { DateUtil } from 'fant'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  name: 'storage-rpt-dtl-sku'
})

export default class SaleRptDtlSku extends Vue {
  @Prop() data: any[]
  @Prop() sku: string
  @Prop() warehouse: string
  @Prop() warehouseId: string
  hasPermission = PermissionMgr.hasOptionPermission

  @Watch('data')
  onDate(value: any) {
    if (value) {
      this.data = value
    }
  }

  /**
   * 跳转往该商品在选定业务日期的库存流水查询页面
   * @param param
   */
  onCheck(param: any) {
    let type = {
      sku: this.sku,
      id: this.sku,
      warehouse: this.warehouse,
      warehouseId: this.warehouseId,
      businessDate: param.businessDate
    }
    this.$router.push({ name: 'inventoryFlow', query: type })
  }

  /**
   * 表格过滤器： 业务时间
   * @param row
   * @param column
   * @param {string} value
   * @returns {string}
   */
  dateFormatter(row: any, column: any, value: string) {
    if (value) {
      let date = DateUtil.format(new Date(value), 'yyyy-MM-dd')
      return date
    } else {
      return '--'
    }
  }
}
