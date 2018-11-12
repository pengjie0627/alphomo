import { Component, Vue } from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import PageHeader from 'cmp/PageHeader.vue'
import SkuCategoryApi from 'http/basicdata/sku/SkuCategoryApi'
import SkuCategory from 'model/basicdata/sku/SkuCategory'


@Component({
  name: 'SupplierSearch',
  components: {
    QueryCondition,
    PageHeader
  }
})
export default class SkuCategoryList extends Vue {
  skuCategoryList: SkuCategory[] = []
  defaultProps = {
    children: 'children',
    label: 'name'
  }
  // 面包屑菜单
  menu = [{
    name: '商品分类',
    url: '/skuCategoryList'
  }]
  data = [{
    id: 1,
    label: '一级 1',
    code: '001',
    children: [{
      id: 4,
      label: '二级 1-1',
      children: [{
        id: 9,
        label: '三级 1-1-1'
      }, {
        id: 10,
        label: '三级 1-1-2'
      }]
    }]
  }, {
    id: 3,
    label: '一级 3',
    children: []
  }]

  mounted() {
    // this.getList()
  }


  getList() {
    // SkuCategoryApi.getByMerchant().then((resp) => {
    //   this.skuCategoryList = resp.data
    // })
    SkuCategoryApi.getByCategory('').then(resp => {
      if (resp.success) {
        this.skuCategoryList = resp.data
      }
    })
  }

  /**
   * 选择商品分类
   */
  onSelectSkuCategory(data: SkuCategory) {
    console.log(data.code)
    // let filter: FilterParam = new FilterParam('categoryCode:=', data.code)
    // this.addFilter(filter)
    // this.query()
    this.$emit('getCategory', data)
  }

  goManagerCategory() {
    this.$router.push('/skuCategoryList')
  }

  loadNode1(node: any, resolve: any) {
    if (node.level === 0) {
      SkuCategoryApi.getByCategory('').then(resp => {
        if (resp.success) {
          // this.skuCategoryList = resp.data
          return resolve(resp.data)
        }
      })
    }
    if (node.level >= 1) {
      SkuCategoryApi.getByCategory(node.data.code).then(resp => {
        if (resp.success) {
          // this.skuCategoryList = resp.data
          return resolve(resp.data)
        }
      })
    }

    // setTimeout(() => {
    //   const data = [{
    //     name: 'leaf',
    //     leaf: true
    //   }, {
    //     name: 'zone'
    //   }]
    //   resolve(data)
    // }, 500)
  }
}

