import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import CheckInventoryLine from 'model/inventory/check/CheckInventoryLine'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  components: {}
})
export default class InventoryCheckViewTable extends Vue {
  @Prop() data: CheckInventoryLine[]
  @Prop() skuType: string
  qtyLine: Array<string> = []
  lines: CheckInventoryLine[] = []
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  beforeMount() {
    this.watchSkuType(this.skuType)
    this.watchData(this.data)

  }

  @Watch('skuType')
  watchSkuType(value: string) {
    if (value) {
      this.skuType = value
      this.doSearchSkuLine()
    }
  }

  @Watch('data')
  watchData(value: Array<CheckInventoryLine>) {
    if (value) {
      this.data = value
      if (this.data) {
        this.data.forEach((item) => {
          if (item.paperQty !== item.qty) {
            item.balanceQty = item.qty - item.paperQty
          } else {
            item.balanceQty = 0
          }
        })
      }
      this.doSearchSkuLine()
    }
  }

  /**
   * 获取商品行
   */
  doSearchSkuLine() {
    if (this.skuType === '盘盈商品') {
      this.lines = []
      this.data.forEach((item, index) => {
        if (item.paperQty < item.qty) {
          this.lines.push(item)
        }
      })
    } else if (this.skuType === '盘亏商品') {
      this.lines = []
      this.data.forEach((item, index) => {
        if (item.paperQty > item.qty) {
          this.lines.push(item)
        }
      })
    } else {
      this.lines = this.data
    }
  }

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
      if (index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 6 || index === 7 || index === 9) {
        return
      }
      const values = data.map((item: any) => Number(item[column.property]))
      if (!values.every((value: any) => isNaN(value))) {
        sums[index] = values.reduce((prev: any, curr: any) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            return (prev + curr)
          } else {
            return prev
          }
        }, 0)
        if (index === 7) {
          if (PermissionMgr.hasOptionPermission('price.costPrice')) {
            sums[index] = this.fmtThumb(sums[index].toString())
          } else {
            sums[index] = ''
          }
        }
      } else {
        sums[index] = ''
      }
    })
    return sums
  }

  /**
   * 千分位
   * @param value
   * @returns {string}
   */
  private fmtThumb(value: string) {
    if (!value) return '0.00'
    let value2Array = value.split('.')
    let intPart = ''
    intPart = value2Array[0] // 获取整数部分
    let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三let
    let floatPart = '.00' // 预定义小数部分
    // =2表示数据有小数位
    if (value2Array.length === 2) {
      let floatStr = '0.' + value2Array[1]
      floatPart = Number(floatStr).toFixed(2).toString() // 拿到小数部分
      if (floatPart.length === 1) { // 补0,实际上用不着
        return intPartFormat + '.' + floatPart.substring(2, floatPart.length) + '0'
      } else {
        return intPartFormat + '.' + floatPart.substring(2, floatPart.length)
      }
    } else {
      return intPartFormat + floatPart
    }
  }

}
InventoryCheckViewTable.filter('price', (value: string) => {
  if (value && Number(value) !== 0) {
    return Number(value).toFixed(2)
  } else {
    return '0.00'
  }
})
