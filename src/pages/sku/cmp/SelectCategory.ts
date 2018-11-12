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
export default class SelectCategory extends Vue {
  skuCategoryList: SkuCategory[] = []
  onConfirm: Function
  defaultProps = {
    children: 'children',
    label: 'name'
  }

  mounted() {
    this.getList()
  }


  getList() {
    SkuCategoryApi.getByMerchant().then((resp) => {
      this.skuCategoryList = resp.data
    })
  }

  doCancel() {
    this.$emit('hide')
  }

  /**
   * 选择商品分类
   */
  onSelectSkuCategory(data: SkuCategory) {
    this.onConfirm(data)
    this.$emit('hide')
  }

}

