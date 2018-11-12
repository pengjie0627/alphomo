import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import ConstantMgr from 'mgr/ConstantMgr'
import FilterParam from 'model/request/FilterParam'
import SkuCategory from 'model/basicdata/sku/SkuCategory'
import PageHeader from 'cmp/PageHeader.vue'
import SupplierApi from 'http/basicdata/supplier/SupplierApi'
import QueryParam from 'model/request/QueryParam'
import Supplier from 'model/basicdata/supplier/Supplier'

// 查询数据对象
class ModelQueryCondition {
  keyword: string = '' //
  code: string = '' // 编号
  name: string = '' // 名称
  barcode: string = '' // 条码
  externalCode: string = '' // 外部编码
  supplier: Supplier = new Supplier() // 供应商
}

@Component({
  name: 'SupplierSearch',
  components: {
    QueryCondition,
    PageHeader
  }
})
export default class SaleListSearch extends Vue {
  // 查询数据对象
  queryCondition: ModelQueryCondition = new ModelQueryCondition()
  // 界面长度限制
  limits = ConstantMgr.limits.sku
  @Prop()
  skuCategory: SkuCategory
  supplierList: Supplier[] = []
  menu = [{
    name: '商品分类',
    url: 'skuCategoryList'
  }, {
    name: '',
    url: ''
  }]

  $refs: {
    query: any
  }

  @Watch('$route')
  onRouteChange(to: any, from: any) {
    if (from.name !== 'skuDetail' && from.name !== 'skuList' && to.name === 'skuList') {
      this.doReset()
      this.$refs.query.doToggle()
    }
  }

  @Watch('skuCategory')
  watchSkuCategory(value: SkuCategory) {
    this.skuCategory.name = value.name
    this.menu.splice(1, 1, { name: value.name!, url: '' })
    this.doSearch()
  }


  mounted() {
    this.watchSkuCategory(this.skuCategory)
    this.getSupplierList()
  }

  /**
   * 查询参数设置
   */
  doSearch() {
    let filters: FilterParam[] = []
    if (this.queryCondition.keyword) {
      filters.push(new FilterParam('keyword:%=%', this.queryCondition.keyword))
    }
    if (this.skuCategory) {
      filters.push(new FilterParam('categoryUuid:=', this.skuCategory.id))
    }
    if (this.queryCondition.code) {
      filters.push(new FilterParam('code:%=%', this.queryCondition.code))
    }
    if (this.queryCondition.name) {
      filters.push(new FilterParam('name:%=%', this.queryCondition.name))
    }
    if (this.queryCondition.barcode) {
      filters.push(new FilterParam('barcode:%=%',this.queryCondition.barcode))
    }
    if (this.queryCondition.externalCode) {
      filters.push(new FilterParam('externalCode:%=%',this.queryCondition.externalCode))
    }
    if (this.queryCondition.supplier.id) {
      filters.push(new FilterParam('supplier:=',this.queryCondition.supplier.id))
    }

    this.$emit('setFilters', filters)
  }

  /**
   * 重置搜索条件
   */
  doReset() {
    let filters: FilterParam[] = []
    this.queryCondition = new ModelQueryCondition()
    this.$emit('resetFilters', filters)
  }

  /**
   * 展开与收起
   */
  doToggle() {
    this.queryCondition = new ModelQueryCondition()
  }

  getSupplierList() {
    let query: QueryParam = new QueryParam()
    SupplierApi.query(query).then((resp) => {
      this.supplierList = resp.data
    }).catch(error => {
      this.$message.error(error.message)
    })
  }
  doEnterSearch() {
    this.doSearch()
  }
}

