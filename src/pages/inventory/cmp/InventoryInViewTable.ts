import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import InInventoryLine from 'model/inventory/in/InInventoryLine'


@Component({
  components: {}
})
export default class InventoryInViewTable extends Vue {
  @Prop() data: InInventoryLine[]

  @Watch('data', { deep: true })
  watchData(val: InInventoryLine[]) {
    this.data = val
  }

  created() {
    this.watchData(this.data)
  }

  /**
   * 数量列过滤器
   * @param row
   * @param column
   * @param {string} value
   */
  qtyFormatter(row: any, column: any, value: string) {
    if (+value) {
      return +value >>> 0
    } else {
      return 0
    }
  }

  /**
   * 合计方法
   * @param param
   * @returns {any}
   */
  getSummaries(param: any) {
    const { columns, data } = param
    const sums: any = []
    columns.forEach((column: any, index: any) => {
      if (index === 0) {
        sums[index] = '合计'
        return
      }
      if (index === 1 || index === 2 || index === 3 || index === 5) {
        return
      }
      const values = data.map((item: any) => Number(item[column.property]))
      if (!values.every((value: any) => isNaN(value))) {
        sums[index] = values.reduce((prev: any, curr: any) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            if (index === 4) {
              return (+prev >>> 0) + (+curr >>> 0)
            } else {
              return ''
            }
          } else {
            return prev
          }
        }, 0)
      } else {
        sums[index] = ''
      }
    })
    return sums
  }

  /**
   * 跳转到详情
   * @param {string} id
   */
  doGoDetail(id: string) {
    this.$router.push({ name: 'saleView', query: { id: id } })
  }
}
