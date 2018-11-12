import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { FormValidator, ObjectUtil } from 'fant'
import QfSearch from 'cmp/Search.vue'
import { State } from 'vuex-class'
import InventoryTransferLine from 'model/inventory/transfer/InventoryTransferLine'
import Sku from 'model/basicdata/sku/Sku'
import ThinSku from 'model/commons/ThinSku'
import User from 'model/framework/user/User'
import ConstantMgr from 'mgr/ConstantMgr'
import InventoryTransfer from 'model/inventory/transfer/InventoryTransfer'
import QueryParam from 'model/request/QueryParam'
import FilterParam from 'model/request/FilterParam'

@Component({
  name: 'InventoryTransferEditTable',
  components: {
    QfSearch
  }
})
export default class InventoryTransferEditTable extends Vue {

  @State('user') user: User
  @Prop()
  bill: InventoryTransfer
  @Prop()
  data: InventoryTransferLine[]
  @Prop()
  validator: FormValidator
  tooltip: any
  limits = ConstantMgr.limits.inventory

  $refs: any

  onTablekeyDown(event: any, rowIndex: number, colIndex: number, row: InventoryTransferLine, column: any) {
    // 回车事件
    if (event.keyCode === 13) {
      if (column.property === 'name') {
        if (!this.isEmptyLine(row)) {
          this.focusCell('qty', rowIndex)
        } else {
          this.focusCell('name', rowIndex)
        }
        let item = this.data.find(item => (this.isEmptyLine(item)))
        if (!item && rowIndex === this.data.length - 1) {
          this.addEmptyLine()
        }
      } else if (column.property === 'qty') {
        this.focusCell('remark', rowIndex)
      } else if (column.property === 'remark') {
        this.focusCell('name', rowIndex + 1)
      }
    } else if (event.keyCode === 38) {
      this.focusCell(column.property, rowIndex - 1)
    } else if (event.keyCode === 40) {
      this.focusCell(column.property, rowIndex + 1)
    }
  }

  /**
   * 是否是新行
   * @param {string} sku
   * @returns {boolean}
   */
  isEmptyLine(sku: InventoryTransferLine): boolean {
    return !sku.sku || !sku.sku.id
  }
  focusCell(column: string, rowIndex: number) {
    if (rowIndex >= this.data.length || rowIndex < 0) {
      return
    }
    this.$nextTick(() => {
      this.$refs[column][rowIndex].focus()
    })
  }

  /**
   * 选中数据
   * @param {InventoryTransferLine[]} value
   */
  selectionChange(value: InventoryTransferLine[]) {
    this.$emit('selectionChange', value)
  }

  /**
   * 是否是新行
   * @param {string} sku
   * @returns {boolean}
   */
  onDisabled(sku: ThinSku): boolean {
    return !sku || !sku.id
  }

  /**
   * 添加一个空行
   */
  addEmptyLine() {
    let line = new InventoryTransferLine()
    line.sku = new Sku()
    line.id = ObjectUtil.uuid()
    this.data.push(line)
  }

  /**
   * 转换商品的数据
   * @param {Sku} sku
   */
  getSearchValue(sku: Sku) {
    if (!sku) {
      return new Sku()
    }
    return sku
  }

  /**
   * 转换为新行
   * @param {Sku} sku
   */
  buildInventoryLine(sku: Sku) {
    let newInventoryLine: InventoryTransferLine = new InventoryTransferLine()
    newInventoryLine.id = ObjectUtil.uuid()
    newInventoryLine.merchant = this.user.merchant
    newInventoryLine.inventoryTransfer = ''
    newInventoryLine.sku = new ThinSku()
    newInventoryLine.sku.id = sku.id
    newInventoryLine.sku.code = sku.code
    newInventoryLine.sku.barcode = sku.barcode
    newInventoryLine.sku.name = sku.name
    newInventoryLine.sku.munit = sku.munit
    newInventoryLine.sku.spec = sku.spec
    newInventoryLine.sku.category = sku.category
    newInventoryLine.qty = 1
    return newInventoryLine
  }

  /**
   * 设置行
   * @param {Sku} sku
   * @param {InventoryTransferLine} row
   * @param {number} rowIndex
   */
  setRowSku(sku: Sku, row: InventoryTransferLine, rowIndex: number) {
    let line: InventoryTransferLine = this.buildInventoryLine(sku)
    let item = this.data.find((item, index) => {
      if (!item.sku) {
        return false
      }
      return item.sku.id === sku.id && index !== rowIndex
    })
    if (!item) {
      Vue.set(row, 'id', line.id)
      Vue.set(row, 'sku', line.sku)
      Vue.set(row, 'qty', line.qty)
      Vue.set(row, 'remark', line.remark)
      this.focusCell('qty', rowIndex)
      if (rowIndex === this.data.length - 1) {
        this.addEmptyLine()
      }
    } else {
      let self: any = this
      this.tooltip = (self.$tooltip)(this.$refs.name[this.data.indexOf(item)].$el, {
        trigger: 'manual',
        placement: 'top',
        content: '商品已存在',
        type: 'warning',
        autoClose: true
      })
    }
  }

  editLastRow() {
    this.$nextTick(() => {
      this.focusCell('name', this.data.length - 1)
    })
  }

  addSkus(skus: Array<Sku>) {
    if (skus === null || skus.length <= 0) {
      return
    }
    let setLastLine: boolean = false
    skus.forEach(sku => {
      let line: InventoryTransferLine = this.buildInventoryLine(sku)
      let lastLine: InventoryTransferLine = this.data[this.data.length - 1]
      if (!setLastLine && this.isEmptyLine(lastLine)) {
        lastLine.id = line.id
        lastLine.sku = line.sku
        lastLine.remark = ''
        // line.id = ObjectUtil.uuid()
        lastLine.qty = 1
        lastLine.merchant = this.user.merchant
        lastLine.inventoryTransfer = ''
      } else {
        this.data.splice(this.data.length, 0, line)
      }
    })
    this.addEmptyLine()
  }

  getAllSkuIds(): string[] {
    let ids: string[] = []
    this.data.forEach(line => {
      if (!this.isEmptyLine(line)) {
        ids.push(line.sku!.id!)
      }
    })
    return ids
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
      if (index === 1 || index === 2 || index === 3 || index === 4 || index === 6) {
        return
      }
      const values = data.map((item: any) => Number(item[column.property]))
      if (!values.every((value: any) => isNaN(value))) {
        sums[index] = values.reduce((prev: any, curr: any) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            if (index === 5) {
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

  skuLineQueryParam: QueryParam = new QueryParam()

  @Watch('bill', { deep: true })
  getQueryParam() {
    let filters: FilterParam[] = []
    this.bill && this.bill.outWarehouse && filters.push(new FilterParam('warehouseUuid:=', this.bill.outWarehouse.id))
    this.skuLineQueryParam.filters = filters
  }
}


