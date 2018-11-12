import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { FormValidator, ObjectUtil } from 'fant'
import QfSearch from 'cmp/Search.vue'
import { State } from 'vuex-class'
import Sku from 'model/basicdata/sku/Sku'
import ThinSku from 'model/commons/ThinSku'
import User from 'model/framework/user/User'
import CheckInventoryLine from 'model/inventory/check/CheckInventoryLine'
import ConstantMgr from 'mgr/ConstantMgr'
import QueryParam from 'model/request/QueryParam'
import FilterParam from 'model/request/FilterParam'
import CheckInventory from 'model/inventory/check/CheckInventory'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  name: 'InventoryCheckEditTable',
  components: {
    QfSearch
  }
})
export default class InventoryCheckEditTable extends Vue {

  @State('user') user: User
  @Prop()
  bill: CheckInventory
  @Prop()
  lines: CheckInventoryLine[]
  @Prop()
  validator: FormValidator
  tooltip: any
  $refs: any
  limits = ConstantMgr.limits.inventory
  disabledCodeInput: boolean = true
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  /**
   * 选中数据
   * @param {InventoryTransferLine[]} value
   */
  selectionChange(value: CheckInventoryLine[]) {
    this.$emit('selectionChange', value)
  }

  /**
   * 是否是新行
   * @param {string} sku
   * @returns {boolean}
   */
  isEmptyLine(sku: CheckInventoryLine): boolean {
    return !sku.sku || !sku.sku.id

  }

  onLinesChanged() {
    this.$emit('linesChange')
  }

  isEqual(obj: CheckInventoryLine) {
    if (obj.paperQty.toString() === obj.qty.toString()) {
      this.$message.warning('实盘数量不能与账面数量一致')
    }
  }

  /**
   * 添加一个空行
   */
  addEmptyLine() {
    let line = new CheckInventoryLine()
    line.sku = new Sku()
    line.id = ObjectUtil.uuid()
    this.lines.push(line)
  }


  editLastRow() {
    this.$nextTick(() => {
      this.focusCell('name', this.lines.length - 1)
    })
  }

  focusCell(column: string, rowIndex: number) {
    if (rowIndex >= this.lines.length || rowIndex < 0) {
      return
    }
    this.$nextTick(() => {
      this.$refs[column][rowIndex].focus()
      this.$forceUpdate()
    })
  }
  onTablekeyDown(event: any, rowIndex: number, colIndex: number, row: CheckInventoryLine, column: any) {
    // 回车事件
    if (event.keyCode === 13) {
      if (column.property === 'name') {
        if (!this.isEmptyLine(row)) {
          this.focusCell('qty', rowIndex)
        } else {
          this.focusCell('name', rowIndex)
        }
        let item = this.lines.find(item => (this.isEmptyLine(item)))
        if (!item && rowIndex === this.lines.length - 1) {
          this.addEmptyLine()
        }
      } else if (column.property === 'qty') {
        this.focusCell('remark', rowIndex)
      } else if (column.property === 'costPrice') {
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
    let newInventoryLine: CheckInventoryLine = new CheckInventoryLine()
    newInventoryLine.id = ObjectUtil.uuid()
    newInventoryLine.merchant = this.user.merchant
    newInventoryLine.sku = new ThinSku()
    newInventoryLine.sku.id = sku.id
    newInventoryLine.sku.code = sku.code
    newInventoryLine.sku.barcode = sku.barcode
    newInventoryLine.sku.name = sku.name
    newInventoryLine.sku.munit = sku.munit
    newInventoryLine.sku.spec = sku.spec
    newInventoryLine.sku.category = sku.category
    newInventoryLine.qty = 0
    newInventoryLine.paperQty = sku.inventory
    return newInventoryLine
  }

  /**
   * 设置行
   * @param {Sku} sku
   * @param {InventoryTransferLine} row
   * @param {number} rowIndex
   */
  setRowSku(sku: Sku, row: CheckInventoryLine, rowIndex: number) {
    let line: CheckInventoryLine = this.buildInventoryLine(sku)
    let item = this.lines.find((item, index) => {
      if (!item.sku) {
        return false
      }
      return item.sku.id === sku.id && index !== rowIndex
    })
    if (!item) {
      Vue.set(row, 'id', line.id)
      Vue.set(row, 'sku', line.sku)
      Vue.set(row, 'qty', line.qty)
      Vue.set(row, 'paperQty', line.paperQty)
      Vue.set(row, 'remark', line.remark)
      this.focusCell('qty', rowIndex)
      if (rowIndex === this.lines.length - 1) {
        this.addEmptyLine()
      }
    } else {
      let self: any = this
      this.tooltip = (self.$tooltip)(this.$refs.name[this.lines.indexOf(item)].$el, {
        trigger: 'manual',
        placement: 'top',
        content: '商品已存在',
        type: 'warning',
        autoClose: true
      })
    }
  }

  addSkus(skus: Array<Sku>) {
    if (skus === null || skus.length <= 0) {
      return
    }
    let setLastLine: boolean = false
    skus.forEach(sku => {
      let line: CheckInventoryLine = this.buildInventoryLine(sku)
      let lastLine: CheckInventoryLine = this.lines[this.lines.length - 1]
      if (!setLastLine && this.isEmptyLine(lastLine)) {
        lastLine.id = line.id
        lastLine.sku = line.sku
        lastLine.paperQty = line.paperQty
        lastLine.remark = ''
        // line.id = ObjectUtil.uuid()
        lastLine.merchant = this.user.merchant
        lastLine.qty = 1
        lastLine.amount = (1 - Number(line.paperQty)) * Number(line.costPrice)
        lastLine.merchant = this.user.merchant
      } else {
        this.lines.splice(this.lines.length, 0, line)
      }
    })
    this.addEmptyLine()
  }

  getAllSkuIds(): string[] {
    let ids: string[] = []
    this.lines.forEach(line => {
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
      if (index === 1 || index === 2 || index === 3 || index === 7) {
        return
      }
      const values = data.map((item: any) => Number(item[column.property]))
      if (!values.every((value: any) => isNaN(value))) {
        sums[index] = values.reduce((prev: any, curr: any) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            if (index === 5 || index === 6) {
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
    this.bill && this.bill.warehouse && filters.push(new FilterParam('warehouseUuid:=', this.bill.warehouse.id))
    this.skuLineQueryParam.filters = filters
  }

  filterColor(value: string, positiveColor: string, negativeColor: string) {
    if (value && Number(value) > 0) {
      return 'color:' + positiveColor
    }
    if (value && Number(value) < 0) {
      return 'color:' + negativeColor
    }
  }
  priceFormatter(row: any, column: any, value: string) {
    if (value && Number(value) !== 0) {
      return Number(value).toFixed(2)
    } else {
      return '0.00'
    }
  }

  onRowChange(row: any) {
    row.amount = row.costPrice * (row.qty - row.paperQty)
  }

}


