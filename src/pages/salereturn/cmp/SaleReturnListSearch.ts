import { Component, Vue, Watch } from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import ConstantMgr from 'mgr/ConstantMgr'
import FilterParam from 'model/request/FilterParam'
import Warehouse from 'model/basicdata/warehouses/Warehouse'
import WarehouseApi from 'http/basicdata/warehouses/WarehouseApi'
import QueryParam from 'model/request/QueryParam'
import SkuSearch from 'cmp/Search.vue'
import Sku from 'model/basicdata/sku/Sku'

// 销售单查询数据对象
class SaleReturnQueryCondition {
  warehouse: string = '' // 仓库
  customerName: string = '' // 客户
  sku: Sku | null = null // 包含商品
  billNumber: string = '' // 单据编号
  businessDate: any = '' // 业务时间
  status: string = '' // 状态
  externalBillSource: string = '' // 来源
  keyword: string = '' //
}

@Component({
  name: 'SaleReturnListSearch',
  components: {
    QueryCondition,
    SkuSearch
  }
})
export default class SaleReturnListSearch extends Vue {
  // 查询数据对象
  queryCondition: SaleReturnQueryCondition = new SaleReturnQueryCondition()
  // 界面长度限制
  limits = ConstantMgr.limits.saleReturn
  // 仓库列表界面
  warehouseList: Warehouse[] = []

  $refs: {
    query: any
  }

  @Watch('$route')
  onRouteChange(to: any, from: any) {
    if (from.name !== 'saleReturnView' && from.name !== 'saleReturnList' && to.name === 'saleReturnList') {
      this.doReset()
      this.$refs.query.doToggle()
    }
  }

  mounted() {
    // this.queryCondition.businessDate = [DateUtil.clearTime(new Date()) + ' 00:00:00', DateUtil.clearTime(new Date()) + ' 00:00:00']
    console.log(this.queryCondition.businessDate)
    this.doGetWarehouseList()
  }

  /**
   * 查询参数设置
   */
  doSearch() {
    let filters: FilterParam[] = []
    if (this.queryCondition.keyword) {
      filters.push(new FilterParam('keyword:%=%', this.queryCondition.keyword))
    }
    if (this.queryCondition.billNumber) {
      filters.push(new FilterParam('billNum:%=%', this.queryCondition.billNumber))
    }
    if (this.queryCondition.businessDate) {
      filters.push(new FilterParam('businessDate:[,]', this.queryCondition.businessDate))
    }
    if (this.queryCondition.status) {
      filters.push(new FilterParam('status:=', this.queryCondition.status))
    }
    if (this.queryCondition.externalBillSource) {
      let source = this.queryCondition.externalBillSource
      switch (source) {
        case 'alphamo':
          filters.push(new FilterParam('externalBillSource:=null', null))
          break
        case 'cloud_scm':
          filters.push(new FilterParam('externalBillSource:=', 'cloud_scm'))
          filters.push(new FilterParam('externalBillType:=', 'Order'))
          break
        case 'carsale':
          filters.push(new FilterParam('externalBillSource:=', 'cloud_scm'))
          filters.push(new FilterParam('externalBillType:=', 'CarSale'))
          break
        case 'dpos':
          filters.push(new FilterParam('externalBillSource:=', 'dpos'))
          break
      }
    }
    if (this.queryCondition.warehouse) {
      filters.push(new FilterParam('warehouse:=', this.queryCondition.warehouse))
    }
    if (this.queryCondition.customerName) {
      filters.push(new FilterParam('customerName:%=%', this.queryCondition.customerName))
    }
    if (this.queryCondition.sku) {
      filters.push(new FilterParam('sku:exist', this.queryCondition.sku.id))
    }
    this.$emit('setFilters', filters)
  }

  /**
   * 重置搜索条件
   */
  doReset() {
    let filters: FilterParam[] = []
    this.queryCondition = new SaleReturnQueryCondition()
    this.$emit('resetFilters', filters)
  }

  /**
   * 展开与收起
   * @param {boolean} flag
   */
  doToggle(flag: boolean) {
    this.queryCondition = new SaleReturnQueryCondition()
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

