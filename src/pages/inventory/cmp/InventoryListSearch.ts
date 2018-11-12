import {Component, Vue, Watch} from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import ConstantMgr from 'mgr/ConstantMgr'
import FilterParam from 'model/request/FilterParam'
import QueryParam from 'model/request/QueryParam'
import WarehouseApi from 'http/basicdata/warehouses/WarehouseApi'
import Warehouse from 'model/basicdata/warehouses/Warehouse'
import SkuCategory from 'model/basicdata/sku/SkuCategory'
import SkuCategoryApi from 'http/basicdata/sku/SkuCategoryApi'
import Supplier from 'model/basicdata/supplier/Supplier'
import Search from 'cmp/Search.vue'
import Ucn from 'model/entity/Ucn'

// 销售单查询数据对象
class InventoryCondition {
  warehouse: any = '' // 仓库
  type: string = '' // 商品类型
  keyword: string = '' // 关键字
}

@Component({
  components: {
    QueryCondition,
    Search
  }
})
export default class InventoryListSearch extends Vue {
  // 查询数据对象
  queryCondition: InventoryCondition = new InventoryCondition()
  // 界面长度限制
  limits = ConstantMgr.limits.inventory
  // 仓库列表
  warehouseList: Warehouse[] = []
  // 商品类型列表
  skuCategoryList: SkuCategory[] = []
  // 供应商
  searchObj: Nullable<Ucn> = new Ucn()

  created() {
    this.doGetWarehouseList()
    this.doGetSkuCategoryList()
  }

  @Watch('$route')
  onRouteChange(to: any, from: any) {
    if (from.name !== 'inventoryFlow' && from.name !== 'inventoryList' && to.name === 'inventoryList') {
      this.doReset()
    }
  }

  /**
   * 查询参数设置
   */
  doSearch() {
    let filters: FilterParam[] = []
    if (this.queryCondition.type) {
      filters.push(new FilterParam('skuCategoryUuid:=', this.queryCondition.type))
    }
    if (this.queryCondition.keyword) {
      filters.push(new FilterParam('keyword:%=%', this.queryCondition.keyword))
    }
    if (this.queryCondition.warehouse) {
      filters.push(new FilterParam('warehouse:=', this.queryCondition.warehouse.id))
    }
    if (this.searchObj) {
      filters.push(new FilterParam('supplier:=', this.searchObj.id))
    }

    this.$emit('setFilters', filters)
    this.$emit('queryWarehouse', this.queryCondition.warehouse)
  }

  /**
   * 重置搜索条件
   */
  doReset() {
    let filters: FilterParam[] = []
    this.queryCondition = new InventoryCondition()
    this.searchObj = new Ucn()
    this.$emit('setFilters', filters)
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

  /**
   * 获取仓库列表
   */
  doGetSkuCategoryList() {
    SkuCategoryApi.list().then((res) => {
      this.skuCategoryList = res.data
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  setSupplier(supplier: Supplier) {
    if (!supplier) {
      this.searchObj = null
      return
    }
    let ucn = new Ucn()
    ucn.id = supplier.id
    ucn.code = supplier.code
    ucn.name = supplier.name
    this.searchObj = ucn
  }

  onSupplierClear() {
    this.searchObj = null
  }
  doEnterSearch() {
    this.doSearch()
  }
}

