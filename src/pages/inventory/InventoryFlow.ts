import { Component, Vue, Watch } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import InventoryTransactionApi from 'http/inventory/transaction/InventoryTransactionApi'
import QueryParam from 'model/request/QueryParam'
import InventoryTransaction from 'model/inventory/transaction/InventoryTransaction'
import { DateUtil, Dialog, Loading, ObjectUtil } from 'fant'
import FilterParam from 'model/request/FilterParam'
import InventoryTransactionSummary from 'model/inventory/transaction/InventoryTransactionSummary'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import SkuApi from 'http/basicdata/sku/SkuApi'
import PermissionMgr from 'mgr/PermissionMgr'

// 分页插件数据对象
class InventoryPagination {
  start: number = 1
  total: number = 0
  limit: number = 10
}

@Component({
  components: {
    PageBody,
    ListContainer
  }
})
export default class InventoryFlow extends Vue {
  // 面包屑菜单
  menu = [{
    name: '库存',
    url: 'inventoryList'
  }, {
    name: '流水',
    url: ''
  }]

  // 库存流水列表
  tableData: InventoryTransaction[] = []
  // 分页插件数据对象
  pagination = new InventoryPagination()
  // 查询条件
  query: QueryParam = new QueryParam()
  // 日期
  businessDate: any = []
  // 商品流水汇总
  skuSummary: InventoryTransactionSummary = new InventoryTransactionSummary()
  // 商品详情
  skuDetail: any = null
  // 仓库信息
  warehouse: string = ''
  warehouseId: string
  hasPermissions: Function = PermissionMgr.hasOptionPermission


  created() {
    let query = this.$route.query
    let endTime = DateUtil.format(new Date(), 'yyyy-MM-dd')
    let startTime = DateUtil.format(new Date(new Date(endTime).getTime() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
    if (query && query.id) {
      this.businessDate = [startTime, endTime]
      this.doGetSkuDetail(query.sku)
      this.warehouse = query.warehouse
      this.warehouseId = query.warehouseId
    }
    // 从报表跳转过来会带时间
    let businessDate: string = this.$route.query.businessDate
    if (businessDate) {
      let temp = DateUtil.format(new Date(businessDate), 'yyyy-MM-dd')
      this.businessDate = [temp, temp]
    }
  }

  /**
   * 改变业务时间
   */
  @Watch('businessDate', { deep: true })
  changeBusinessDate() {
    // let endTime = DateUtil.format(new Date(), 'yyyy-MM-dd')
    // let startTime = DateUtil.format(new Date(new Date(endTime).getTime() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
    // if (this.businessDate[0] === null) {
    //   this.businessDate[0] = startTime
    // }
    // if (this.businessDate[1] === null) {
    //   this.businessDate[1] = endTime
    // }
    this.pagination.start = 1
    this.doSearchList(this.$route.query.id)
    this.doSearchDetail(this.$route.query.id)
  }

  /**
   * 页码改变
   * @param {number} val
   */
  onPageChange(val: number) {
    this.pagination.start = val / (this.pagination.limit - 1)
    this.doSearchList(this.$route.query.id)
    this.doSearchDetail(this.$route.query.id)
  }

  /**
   * 查询库存流水列表
   * @param {string} id
   */
  doSearchList(id: string) {
    let filter: FilterParam[] = []
    let loading = Loading.show()
    this.query.start = (this.pagination.start - 1) * 10
    this.query.limit = 10
    if (this.businessDate && this.businessDate.length) {
      this.businessDate[0] = this.businessDate[0] && DateUtil.format(new Date(this.businessDate[0]), 'yyyy-MM-dd') || ''
      this.businessDate[1] = this.businessDate[1] && DateUtil.format(new Date(this.businessDate[1]), 'yyyy-MM-dd') || ''
      filter.push(new FilterParam('businessDate:[,]', this.businessDate))
    }
    if (this.warehouseId) {
      filter.push(new FilterParam('warehouse:=', this.warehouseId))
    }
    this.query.filters = filter
    InventoryTransactionApi.query(id, this.query).then((resp) => {
      this.tableData = resp.data
      this.pagination.total = resp.total
      loading.hide()
    }).catch((err) => {
      this.$message.error(err.message)
      loading.hide()
    })
  }

  /**
   * 获取商品详情
   * @param {string} id
   */
  doSearchDetail(id: string) {
    let start = ''
    let end = ''
    if (this.businessDate && this.businessDate.length) {
      start = ObjectUtil.copy(this.businessDate[0])
      end = ObjectUtil.copy(this.businessDate[1])
    }
    InventoryTransactionApi.summary(id, start, end, this.warehouseId).then((resp) => {
      this.skuSummary = resp.data
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  /**
   * 获取商品信息
   * @param {string} id
   */
  doGetSkuDetail(id: string) {
    SkuApi.getThin(id).then((resp) => {
      this.skuDetail = resp.data
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  /**
   * 表格排序条件
   */
  doSortChange({ column, prop, order }: any) {
    order === 'ascending' ? (order = 'ASC') : (order = 'DESC')
    this.query.sorters = []
    this.pagination.start = 1
    column && prop && order && this.query.sorters.push({ 'property': prop, 'direction': order })
    this.doSearchList(this.$route.query.id)
  }

  /**
   * 业务
   * @param row
   * @param column
   * @param {string} value
   * @returns {string}
   */
  formatterType(row: any, column: any, value: string) {
    if (value) {
      switch (value) {
        case 'Purchase':
          return '进货'
        case 'Sale':
          return '销售'
        case 'CheckInventory':
          return '盘点'
        case 'InventoryTransfer':
          return '调拨'
        case 'PurchaseReturn':
          return '进货退货'
        case 'SaleReturn':
          return '销售退货'
        case 'OtherPaymentLine':
          return '其他支出'
        case 'OtherReceiptLine':
          return '其他收入'
      }
    } else {
      return '--'
    }
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

  /**
   * 导出数据
   */
  doExport() {
    new Dialog(ExportDialog, {
      title: '导出库存流水',
      onExport: () => {
        return InventoryTransactionApi.export(this.$route.query.id, this.query)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }
}
