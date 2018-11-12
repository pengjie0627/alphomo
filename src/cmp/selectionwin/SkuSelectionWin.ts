import { Component, Vue } from 'vue-property-decorator'
import SkuApi from 'http/basicdata/sku/SkuApi'
import QueryParam from 'model/request/QueryParam'
import { Loading } from 'fant'
import Sku from 'model/basicdata/sku/Sku'
import FilterParam from 'model/request/FilterParam'
import SkuCategoryApi from 'http/basicdata/sku/SkuCategoryApi'
import SkuCategory from 'model/basicdata/sku/SkuCategory'

@Component({
  name: 'SingleSelectionWin',
  components: {}
})
export default class SkuSelectionWin extends Vue {
  title: string = '选择商品'
  multiple: boolean = false
  warehouse: any
  supplier: any
  width: number = 500
  height: number = 400
  pageSize: number = 10
  currPage: number = 1
  customId = ''
  columns: Array<any> = [{
    id: '001',
    label: '编码',
    prop: 'code'
  }, {
    label: '名称',
    prop: 'name'
  }, {
    label: '库存',
    prop: 'inventory',
    align: 'right'
  }]
  callback: Function
  excludes: string[] = []

  datas: Array<Sku> = []
  totalCount: number = 0
  selected: Array<Sku> = []
  keyword: string = ''
  queryParam: QueryParam = new QueryParam()
  $refs: {
    table: any
  }
  categorys: Array<SkuCategory> = []
  defaultProps = {
    children: 'children',
    label: 'name'
  }

  mounted() {
    SkuCategoryApi.getByMerchant().then((resp) => {
      this.categorys = resp.data
    })
    this.queryParam.limit = 10
    if (this.customId) {
      this.queryParam.filters.push({ property: 'customer:=', value: this.customId })
    }
    if (this.warehouse) {
      this.queryParam.filters.push({ property: 'warehouseUuid:=', value: this.warehouse!.id })
    }
    if (this.supplier) {
      this.queryParam.filters.push({ property: 'supplier:=', value: this.supplier!.id })
    }
    if (this.excludes !== null && this.excludes.length > 0) {
      let filter: FilterParam = new FilterParam('uuid:notIn', this.excludes)
      this.addFilter(filter, true)
    }

    this.query()
  }

  query() {
    let loading = Loading.show({
      msg: '查询中'
    })
    SkuApi.query(this.queryParam).then((resp) => {
      loading.hide()
      if (resp.data) {
        this.datas = resp.data
        this.totalCount = resp.total
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
    })
  }

  onCancel() {
    this.$emit('hide')
  }

  onConfirm() {
    if (this.callback) {
      this.callback(this.selected)
    }
    this.$emit('hide')
  }

  onSearch() {
    let filter: FilterParam = new FilterParam('keyword:%=%', this.keyword)
    this.addFilter(filter)
    this.queryParam.start = 0
    this.currPage = 1
    this.query()
  }

  addFilter(filter: FilterParam, cover: boolean = true) {
    if (filter) {
      if (cover) {
        for (let i = this.queryParam.filters.length - 1; i >= 0; i--) {
          let f = this.queryParam.filters[i]
          if (f.property === filter.property) {
            this.queryParam.filters.splice(i, 1)
          }
        }
      }
      this.queryParam.filters.push(filter)
    }
  }

  onSelectionChange(selected: Sku[]) {
    this.selected = selected
  }

  onCurrentChange(currentRow: Sku, oldCurrentRow: Sku) {
    this.selected = []
    this.selected.push(currentRow)
  }

  onSortChange() {
    // do nothing
  }

  onPageChange(start: number) {
    this.queryParam.start = (start / (this.queryParam.limit - 1) - 1) * this.queryParam.limit
    this.query()
  }

  onClick(row: Sku, event: any) {
    if (this.multiple) {
      this.$refs.table.toggleRowSelection(row)
    }
  }

  onDbClick(row: any, event: any) {
    if (!this.multiple) {
      this.onConfirm()
    }
  }

  dialogStyle() {
    return {
      width: this.width + 'px',
      height: this.height + 'px'
    }
  }

  /**
   * 选择商品分类
   */
  onSelectSkuCategory(data: SkuCategory) {
    console.log(data)
    let filter: FilterParam = new FilterParam('categoryUuid:=', data.id)
    this.addFilter(filter)
    this.query()
  }
  loadNode1(node: any, resolve: any) {
    if (node.level === 0) {
      SkuCategoryApi.getByCategory('').then(resp => {
        if (resp.success) {
          return resolve(resp.data)
        }
      })
    }
    if (node.level >= 1) {
      SkuCategoryApi.getByCategory(node.data.code).then(resp => {
        if (resp.success) {
          return resolve(resp.data)
        }
      })
    }
  }

}
