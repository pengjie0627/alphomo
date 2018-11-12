import { Vue, Component, Prop } from 'vue-property-decorator'
import InventoryTransferLine from 'model/inventory/transfer/InventoryTransferLine'

@Component({
  components: {}
})
export default class InventoryTransferViewTable extends Vue {
  @Prop() data: InventoryTransferLine

  /**
   * 汇总
   * @param params
   * @returns {any[]}
   */
  getSummary(params: any) {
    let { columns, data } = params
    let sums: any[] = []
    columns.forEach((column: any, index: any) => {
      if (index === 0) {
        sums[index] = '合计'
        return
      }
      if (index === 1 || index === 2 || index === 3 || index === 5 || index === 6) {
        return
      }
      const values = data.map((item: any) => Number(item[column.property]))
      if (!values.every((value: any) => isNaN(value))) {
        sums[index] = values.reduce((prev: any, curr: any) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            if (index === 4) {
              return prev + curr
            } else {
              return prev + curr
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
}
