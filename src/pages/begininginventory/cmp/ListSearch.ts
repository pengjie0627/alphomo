import { Component, Vue } from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import ConstantMgr from 'mgr/ConstantMgr'
import FilterParam from 'model/request/FilterParam'
import QueryParam from 'model/request/QueryParam'
import WarehouseApi from 'http/basicdata/warehouses/WarehouseApi'
import Warehouse from 'model/basicdata/warehouses/Warehouse'
import SkuCategory from 'model/basicdata/sku/SkuCategory'
import SkuCategoryApi from 'http/basicdata/sku/SkuCategoryApi'

// 销售单查询数据对象
class InventoryCondition {
  warehouse: any = '' // 仓库
  type: string = '' // 商品类型
  keyword: string = '' // 关键字
}

@Component({
  components: {
    QueryCondition
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
  noWarehouseCaption: string = ''

  created() {
    this.doGetWarehouseList()
    this.doGetSkuCategoryList()
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
    this.$emit('setFilters', filters)
    this.$emit('queryWarehouse', this.queryCondition.warehouse)
  }

  /**
   * 重置搜索条件
   */
  doReset() {
    this.doGetWarehouseList()
    let filters: FilterParam[] = []
    if (this.queryCondition.type) {
      filters.push(new FilterParam('skuCategoryUuid:=', this.queryCondition.type))
    }

    this.queryCondition = new InventoryCondition()
    // this.$emit('setFilters', filters)
  }

  /**
   * 获取仓库列表
   */
  doGetWarehouseList() {
    let query: QueryParam = new QueryParam()
    WarehouseApi.queryExcludeCar(query).then((res) => {
      this.warehouseList = res.data
      if (this.warehouseList.length > 0) {
        this.queryCondition.warehouse = this.warehouseList[0]
        let filters: FilterParam[] = []
        if (this.queryCondition.warehouse) {
          filters.push(new FilterParam('warehouse:=', this.queryCondition.warehouse.id))
        }
        this.$emit('setFilters', filters)
        this.$emit('queryWarehouse', this.queryCondition.warehouse)
      } else {
        this.noWarehouseCaption = '暂无仓库可选'
      }
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
  doEnterSearch() {
    this.doSearch()
  }
}

