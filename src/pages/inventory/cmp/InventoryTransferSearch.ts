import { Component, Vue, Watch } from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import ConstantMgr from 'mgr/ConstantMgr'
import FilterParam from 'model/request/FilterParam'
import QueryParam from 'model/request/QueryParam'
import WarehouseApi from 'http/basicdata/warehouses/WarehouseApi'
import Warehouse from 'model/basicdata/warehouses/Warehouse'
import SkuCategory from 'model/basicdata/sku/SkuCategory'
import Customer from 'model/basicdata/customer/Customer'
import Search from 'cmp/Search.vue'
import Sku from 'model/basicdata/sku/Sku'
import SkuSearch from 'cmp/Search.vue'

// 调拨单查询数据对象
class InventoryCondition {
  warehouseIn: string = '' // 调入仓库
  warehouseOut: string = '' // 调出仓库
  sku: Sku | null = null // 商品类型
  keyword: string = '' // 关键字
  manager: Customer | null = null // 经办人
  managerName: string = '' // 经办人名称
  billNumber: string = '' // 单号
  businessDate: string[] = [] // 入库时间
  createDate: string[] = [] // 制单时间
  status: string = '' // 状态
  remark: string = '' // 备注
  category: string = '' // 分类
}

@Component({
  components: {
    QueryCondition,
    Search,
    SkuSearch
  }
})
export default class InventoryInSearch extends Vue {
  // 查询数据对象
  queryCondition: InventoryCondition = new InventoryCondition()
  // 界面长度限制
  limits = ConstantMgr.limits.inventory
  // 仓库列表
  warehouseList: Warehouse[] = []
  // 商品类型列表
  skuCategory: SkuCategory[] = []

  $refs: {
    query: any
  }

  created() {
    this.doGetWarehouseList()
  }

  @Watch('$route')
  onRouteChange(to: any, from: any) {
    if (from.name !== 'inventoryTransferView' && from.name !== 'inventoryTransferList' && to.name === 'inventoryTransferList') {
      this.doReset()
      this.$refs.query.doToggle()
    }
  }

  /**
   * 查询参数设置
   */
  doSearch() {
    let filters: FilterParam[] = []
    if (this.queryCondition.sku) {
      filters.push(new FilterParam('sku:exist', this.queryCondition.sku.id))
    }
    if (this.queryCondition.managerName) {
      filters.push(new FilterParam('managerName:=', this.queryCondition.managerName))
    }
    if (this.queryCondition.keyword) {
      filters.push(new FilterParam('keyword:%=%', this.queryCondition.keyword))
    }
    if (this.queryCondition.warehouseIn) {
      filters.push(new FilterParam('inWarehouse:=', this.queryCondition.warehouseIn))
    }
    if (this.queryCondition.billNumber) {
      filters.push(new FilterParam('billNum:%=%', this.queryCondition.billNumber))
    }
    if (this.queryCondition.warehouseOut) {
      filters.push(new FilterParam('outWarehouse:=', this.queryCondition.warehouseOut))
    }
    if (this.queryCondition.businessDate && this.queryCondition.businessDate.length) {
      filters.push(new FilterParam('transferDate:[,]', this.queryCondition.businessDate))
    }
    if (this.queryCondition.createDate && this.queryCondition.createDate.length) {
      filters.push(new FilterParam('created:[,]', this.queryCondition.createDate))
    }
    if (this.queryCondition.remark) {
      filters.push(new FilterParam('remark:%=%', this.queryCondition.remark))
    }
    if (this.queryCondition.status) {
      filters.push(new FilterParam('status:=', this.queryCondition.status))
    }
    if (this.queryCondition.category) {
      filters.push(new FilterParam('category:=', this.queryCondition.category))
    }
    this.$emit('setFilters', filters)
  }

  /**
   * 重置搜索条件
   */
  doReset() {
    let filters: FilterParam[] = []
    this.queryCondition = new InventoryCondition()
    this.$emit('setFilters', filters)
  }

  /**
   * 展开与收起
   * @param {boolean} flag
   */
  doToggle(flag: boolean) {
    this.queryCondition = new InventoryCondition()
  }

  /**
   * 获取仓库列表
   */
  doGetWarehouseList() {
    let query: QueryParam = new QueryParam()
    WarehouseApi.query(query).then((res) => {
      this.warehouseList = res.data
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  setRowCustomer(customer: Customer) {
    if (!customer) {
      return new Customer()
    }
    this.queryCondition.manager = customer
  }

  onCustomerClear() {
    this.queryCondition.manager = null
  }

  setRowSku(sku: Sku) {
    if (!sku) {
      return new Sku()
    }
    this.queryCondition.sku = sku
  }

  onSkuClear() {
    this.queryCondition.sku = null
  }

  doEnterSearch() {
    this.doSearch()
  }
}

