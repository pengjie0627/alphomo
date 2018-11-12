import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import InInventoryLine from 'model/inventory/in/InInventoryLine'
import InInventory from 'model/inventory/in/InInventory'
import CommonUtil from 'util/CommonUtil'


@Component({
  components: {}
})
export default class InventoryInEditTable extends Vue {
  @Prop() data: InInventoryLine[]
  @Prop() isDisabled: boolean

  // 是否需要缓存
  cache: boolean = true
  // 缓存数据
  cacheData: InInventoryLine[] = []

  @Watch('data', { deep: true })
  watchData(val: InInventoryLine[]) {
    this.data = val
    if (val && val.length && this.cache) {
      this.cache = false
      this.cacheData = CommonUtil.copy(val)
    }
    if (val && val.length) {
      if (val.length !== this.cacheData.length) {
        // todo
        this.cacheData = this.cacheData.filter((value, index) => {
          let isExist = val.some((item) => {
            return item.id === value.id
          })
          return isExist
        })
      }
    }
  }

  @Watch('isDisabled', { deep: true })
  watchSource(val: boolean) {
    this.isDisabled = val
  }

  created() {
    this.watchData(this.data)
    this.watchSource(this.isDisabled)
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
      if (index === 1 || index === 2 || index === 3 || index === 4 || index === 6) {
        return
      }
      const values = data.map((item: any) => Number(item[column.property]))
      if (!values.every((value: any) => isNaN(value))) {
        sums[index] = values.reduce((prev: any, curr: any) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            if (index === 5) {
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
   * 表格选择
   * @param val
   */
  doSelectionChange(val: InInventory[]) {
    this.$emit('selectData', val)
  }

  /**
   * 检查输入的最大值
   * @param {number} index
   */
  doCheckMax(index: number) {
    if (this.data[index].qty > this.cacheData[index].qty) {
      this.data[index].qty = Number(CommonUtil.copy(this.cacheData[index].qty))
    }
    if (!this.data[index].qty) {
      this.data[index].qty = 0
    }
  }
}
