import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { FormValidator, NumberUtil, ObjectUtil } from 'fant'
import ThinSku from 'model/commons/ThinSku'
import Sku from 'model/basicdata/sku/Sku'
import Search from 'cmp/Search.vue'
import PurchaseReturnLine from 'model/purchasereturn/PurchaseReturnLine'
import MerchantConfig from 'model/framework/merchant/MerchantConfig'
import { State } from 'vuex-class'
import QueryParam from 'model/request/QueryParam'
import FilterParam from 'model/request/FilterParam'
import PurchaseReturn from 'model/purchasereturn/PurchaseReturn'
import ConstantMgr from 'mgr/ConstantMgr'
import SkuMunit from 'model/basicdata/sku/SkuMunit'
import SkuApi from 'http/basicdata/sku/SkuApi'


@Component({
  name: 'PurchaseReturnEditTable',
  components: {
    Search
  }
})
export default class PurchaseReturnEditTable extends Vue {
  @State('merchantConfig') merchantConfig: MerchantConfig
  @Prop()
  bill: PurchaseReturn
  @Prop()
  lines: PurchaseReturnLine[]
  @Prop()
  validator: FormValidator
  @Prop()
  isReturnFromPurchase: boolean
  @Prop()
  presentation: string
  $refs: any
  tooltip: any
  // 界面长度限制
  limits = ConstantMgr.limits.sku

  editLastRow() {
    this.$nextTick(() => {
      this.focusCell('name', this.lines.length - 1)
    })
  }

  getRowSku(sku: Sku) {
    if (!sku) {
      return new Sku()
    }
    return sku
  }

  setRowSku(sku: Sku, row: PurchaseReturnLine, rowIndex: number) {
    let item = this.lines.find((item, index) => {
      if (!item.sku) {
        return false
      }
      return item.sku.id === sku.id
        &&
        index !== rowIndex
    })
    if (!item) {
      let line: PurchaseReturnLine = this.buildPurchaseReturnLine(sku)
      Vue.set(row, 'id', line.id)
      Vue.set(row, 'sku', line.sku)
      Vue.set(row, 'taxExcPrice', line.taxExcPrice)
      Vue.set(row, 'price', line.price)
      Vue.set(row, 'qty', line.qty)
      Vue.set(row, 'taxExcAmount', line.taxExcAmount)
      Vue.set(row, 'amount', line.amount)
      Vue.set(row, 'taxRate', line.taxRate)
      Vue.set(row, 'taxAmount', line.taxAmount)
      Vue.set(row, 'realAmount', line.realAmount)
      this.focusCell('price', rowIndex)
      this.onLinesChanged()
    } else {
      let self = this as any
      this.tooltip = (self.$tooltip)(this.$refs.name[this.lines.indexOf(item)].$el, {
        trigger: 'manual',
        placement: 'top',
        content: '商品已存在',
        type: 'warning',
        autoClose: true
      })
      return
    }
  }

  taxAmountFormat(row: any, column: any, value: number) {
    return NumberUtil.format(value, '0.00')
  }

  onSkuClear(sku: Sku, row: PurchaseReturnLine, rowIndex: number) {
    let line = this.lines[rowIndex]
    line.sku = new ThinSku()
    line.qty = 0
    line.taxExcPrice = 0
    line.price = 0
    line.taxExcAmount = 0
    line.amount = 0
    line.taxRate = 0
    line.taxAmount = 0
    line.realAmount = 0
    this.focusCell('name', rowIndex)
    this.onLinesChanged()
  }

  isEmptyLine(line: PurchaseReturnLine): boolean {
    return !line.sku || !line.sku.id
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

  focusCell(column: string, rowIndex: number) {
    if (rowIndex >= this.lines.length || rowIndex < 0) {
      return
    }
    this.$nextTick(() => {
      this.$refs[column][rowIndex].focus()
    })
  }

  // 选择单位 更改单价
  munitSelectChange(munit: string, line: PurchaseReturnLine, sku: ThinSku) {
    let index = sku.skuMunitList.map((m) => {
      return m.name
    }).indexOf(munit)
    let time0 = line.sku!.times || 1
    let times = sku.skuMunitList[index].times / time0
    line.price = line.price * times
    line.sku!.times = sku.skuMunitList[index].times
    this.lines.forEach((a, index) => {
      if (a.id === line.id) {
        Vue.set(this.lines, index, line)
      }
    })
    this.onRowChange('price', line)
  }

  selectionChange() {
    this.$emit('selectionChange', arguments[0])
  }

  sortChange() {
    // do nothing
  }

  doSelectMunitList(row: PurchaseReturnLine) {
    // if (this.presentation === 'create') {
    //   return
    // }
    let param = new QueryParam()
    param.start = 0
    param.limit = 10
    param.filters = [{ 'property': 'keyword:%=%', 'value': row.sku!.name || '' }]
    param.filters = [{ 'property': 'keyword:%=%', 'value': row.sku!.code || '' }]
    SkuApi.query(param).then((resp) => {
      if (resp.data) {
        let munit = new SkuMunit()
        munit.name = resp.data[0].munit
        munit.times = 1
        this.lines.forEach((item, index) => {
          if (item.sku) {
            if (item.sku!.id === resp.data[0].id) {
              let line = item
              item.sku!.skuMunitList.push(munit)
              item.sku!.skuMunitList = item.sku!.skuMunitList.concat(resp.data[0].skuMunitList)
              item.sku!.skuMunitList.forEach((m, index) => {
                if (m.name === item.sku!.munit) {
                  item.sku!.times = m.times
                }
              })
              this.lines.splice(index, 1, line)
            }
          }
        })
      }
    }).catch(e => {
      this.$message.error(e.message)
    })
  }

  onTableKeyDown(event: any, rowIndex: number, colIndex: number, row: PurchaseReturnLine, column: any) {
    // 回车事件
    if (event.keyCode === 13) {
      if (column.property === 'name') {
        if (!this.isEmptyLine(row)) {
          this.focusCell('price', rowIndex)
        } else {
          this.focusCell('name', rowIndex)
        }
        let item = this.lines.find(item => (this.isEmptyLine(item)))
        if (!item) {
          this.addEmptyLine()
        }
      } else if (column.property === 'price') {
        this.focusCell('qty', rowIndex)
      } else if (column.property === 'qty') {
        if (row.qty <= 0) {
          this.focusCell('qty', rowIndex)
        } else {
          this.focusCell('amount', rowIndex)
        }
      } else if (column.property === 'amount') {
        if (this.merchantConfig.enableInputTaxRateSupport) {
          this.focusCell('taxRate', rowIndex)
        } else {
          let item = this.lines.find(item => (this.isEmptyLine(item)))
          if (!item) {
            this.addEmptyLine()
          }
          this.focusCell('name', rowIndex + 1)
        }
      } else if (column.property === 'taxRate') {
        let item = this.lines.find(item => (this.isEmptyLine(item)))
        if (!item) {
          this.addEmptyLine()
        }
        this.focusCell('name', rowIndex + 1)
      }
    } else if (event.keyCode === 38) {
      this.focusCell(column.property, rowIndex - 1)
    } else if (event.keyCode === 40) {
      this.focusCell(column.property, rowIndex + 1)
    }
  }

  onRowChange(column: string, row: PurchaseReturnLine) {
    if ('price' === column) {
      row.price = Number(row.price)
      row.taxExcPrice = Number((row.price / (1 + row.taxRate / 100)).toFixed(this.merchantConfig.purchasePriceBit))
      row.amount = Number((row.price * row.qty).toFixed(2))
      row.taxExcAmount = Number((row.taxExcPrice * row.qty).toFixed(2))
      row.taxAmount = Number((row.taxExcAmount * row.taxRate / 100).toFixed(2))
    } else if ('taxExcPrice' === column) {
      row.taxExcPrice = Number(row.taxExcPrice)
      row.price = Number((row.taxExcPrice * (1 + row.taxRate / 100)).toFixed(this.merchantConfig.purchasePriceBit))
      row.amount = Number((row.price * row.qty).toFixed(2))
      row.taxExcAmount = Number((row.taxExcPrice * row.qty).toFixed(2))
      row.taxAmount = Number((row.taxExcAmount * row.taxRate / 100).toFixed(2))
    } else if ('qty' === column) {
      row.qty = Number(row.qty)
      row.amount = Number((row.price * row.qty).toFixed(2))
      row.taxExcAmount = Number((row.taxExcPrice * row.qty).toFixed(2))
      row.taxAmount = Number((row.taxExcAmount * row.taxRate / 100).toFixed(2))
    } else if ('amount' === column) {
      row.amount = Number(row.amount)
      row.price = Number((row.amount / row.qty).toFixed(this.merchantConfig.purchasePriceBit))
      row.taxExcPrice = Number((row.price / (1 + row.taxRate / 100)).toFixed(this.merchantConfig.purchasePriceBit))
      row.taxExcAmount = Number((row.taxExcPrice * row.qty).toFixed(2))
      row.taxAmount = Number((row.taxExcAmount * row.taxRate / 100).toFixed(2))
    } else if ('taxExcAmount' === column) {
      row.taxExcAmount = Number(row.taxExcAmount)
      row.taxExcPrice = Number((row.taxExcAmount / row.qty).toFixed(this.merchantConfig.purchasePriceBit))
      row.price = Number((row.taxExcPrice * (1 + row.taxRate / 100)).toFixed(this.merchantConfig.purchasePriceBit))
      row.amount = Number((row.price * row.qty).toFixed(2))
      row.taxAmount = Number((row.taxExcAmount * row.taxRate / 100).toFixed(2))
    } else if ('taxRate' === column) {
      row.taxRate = Number(row.taxRate)
      row.price = Number(((1 + row.taxRate / 100) * row.taxExcPrice).toFixed(this.merchantConfig.purchasePriceBit))
      row.amount = Number((row.price * row.qty).toFixed(2))
      row.taxAmount = Number((row.taxExcAmount * row.taxRate / 100).toFixed(2))
    }
    row.realAmount = row.amount
    this.onLinesChanged()
  }

  addSkus(skus: Array<Sku>) {
    if (skus === null || skus.length <= 0) {
      return
    }
    let setLastLine: boolean = false
    skus.forEach(sku => {
      let line: PurchaseReturnLine = this.buildPurchaseReturnLine(sku, false)
      let lastLine: PurchaseReturnLine = this.lines[this.lines.length - 1]
      if (!setLastLine && this.isEmptyLine(lastLine)) {
        setLastLine = true
        lastLine.id = line.id
        lastLine.sku = line.sku
        lastLine.taxExcPrice = line.taxExcPrice
        lastLine.price = line.price
        lastLine.qty = line.qty
        lastLine.taxExcAmount = line.taxExcAmount
        lastLine.amount = line.amount
        lastLine.taxRate = line.taxRate
        lastLine.taxAmount = line.taxAmount
        lastLine.realAmount = line.amount
      } else {
        this.lines.splice(this.lines.length, 0, line)
      }
    })
    this.addEmptyLine()
    this.onLinesChanged()
  }

  addEmptyLine() {
    if (this.isReturnFromPurchase) {
      return
    }
    let empty = new PurchaseReturnLine()
    empty.id = ObjectUtil.uuid()
    this.lines.push(empty)
  }

  removeLines(selected: PurchaseReturnLine[]) {
    if (selected === null || selected.length <= 0) {
      return
    }
    let lines: Array<PurchaseReturnLine> = this.lines
    let removeIds: Set<string> = new Set()
    selected.forEach(s => {
      removeIds.add(s.id!)
    })
    for (let i: number = lines.length - 1; i >= 0; i--) {
      if (removeIds.has(lines[i].id!)) {
        lines.splice(i, 1)
      }
    }
    this.onLinesChanged()
  }

  freeTaxRate(selected: PurchaseReturnLine[]) {
    if (selected === null || selected.length <= 0) {
      return
    }
    let lines: Array<PurchaseReturnLine> = this.lines
    let freeTax: Set<string> = new Set()
    selected.forEach(s => {
      freeTax.add(s.id!)
    })
    for (let i: number = lines.length - 1; i >= 0; i--) {
      if (freeTax.has(lines[i].id!)) {
        lines[i].taxRate = 0
        lines[i].taxAmount = 0
        lines[i].realAmount = lines[i].amount
        lines[i].amount = lines[i].taxExcAmount
        lines[i].price = lines[i].taxExcPrice
      }
    }
    this.onLinesChanged()
  }

  onLinesChanged() {
    this.$emit('linesChange')
  }

  buildPurchaseReturnLine(sku: Sku, isAdd: boolean = true): PurchaseReturnLine {
    let line: PurchaseReturnLine = new PurchaseReturnLine()
    line.id = ObjectUtil.uuid()
    line.sku = new ThinSku()
    line.sku.id = sku.id
    line.sku.code = sku.code
    line.sku.spec = sku.spec
    line.sku.barcode = sku.barcode
    line.sku.name = sku.name
    line.sku.munit = sku.munit
    line.sku.category = sku.category
    line.price = sku.refPurchasePrice
    line.qty = 1
    line.amount = line.price * line.qty
    if (sku.skuMunitList.length > 0 && isAdd) {
      line.sku.skuMunitList = []
      let munit = new SkuMunit()
      munit.name = sku.munit
      munit.times = 1
      line.sku.skuMunitList.push(munit || '')
      line.sku.skuMunitList = line.sku.skuMunitList.concat(sku.skuMunitList)  // 单位列表
      line.sku.times = 1
    } else {
      line.sku.skuMunitList = []
    }
    if (this.merchantConfig.enableInputTaxRateSupport) {
      line.taxRate = Number(sku.inputTaxRate)
    } else {
      line.taxRate = 0
    }
    line.taxExcPrice = Number(line.price / (1 + line.taxRate / 100))
    line.taxExcAmount = Number((line.taxExcPrice * line.qty).toFixed(2))
    line.taxAmount = Number((line.taxRate * line.taxExcAmount / 100).toFixed(2))
    line.realAmount = line.amount
    return line
  }

  getSummaries(param: any) {
    const columns: Array<any> = param.columns
    const sums: Array<any> = []
    const data: Array<any> = param.data
    if (!data || data.length <= 0) {
      return sums
    }
    columns.forEach((column: any, index: number) => {
      if (index === 0) {
        sums[index] = '合计'
        return
      }
      if (!column.property || (column.property !== 'qty' && column.property !== 'amount' && column.property !== 'taxAmount' && column.property !== 'taxExcAmount')) {
        return sums
      }
      const values: Array<number> = data.map(item => Number(item[column.property]))
      if (!values.every(value => isNaN(value))) {
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)
        // if (column.property === 'qty') {
        //   sums[index] = NumberUtil.format(sums[index], '0.000')
        // } else {
        //   sums[index] = NumberUtil.format(sums[index], '0.00')
        // }
        if (column.property === 'amount' || column.property === 'taxAmount' || column.property === 'taxExcAmount') {
          // sums[index] = this.fmtThumb(sums[index].toString())
          sums[index] = NumberUtil.format(sums[index], '##,##0.00')
        } else {
          if (column.property !== 'qty') {
            sums[index] = NumberUtil.format(sums[index], '0.00')
          } else {
            sums[index] = NumberUtil.format(sums[index], '0')
          }
        }
        // sums[index] += ' 元'
      }
    })

    return sums
  }

  /**
   * 表格过滤器： 退货额
   * @param row
   * @param column
   * @param {string} value
   * @returns {string}
   */
  priceFormatter(row: any, column: any, value: string) {
    if (value && Number(value) !== 0) {
      return Number(value).toFixed(2)
    } else {
      return '0'
    }
  }

  amountFormat(row: any, column: any, value: number) {
    return NumberUtil.format(value, '0.00')
  }

  skuLineQueryParam: QueryParam = new QueryParam()

  @Watch('bill', { deep: true })
  getQueryParam() {
    let filters: FilterParam[] = []
    this.bill && this.bill.warehouse && filters.push(new FilterParam('warehouseUuid:=', this.bill.warehouse.id))
    this.bill && this.bill.supplier && filters.push(new FilterParam('supplier:=', this.bill.supplier.id))
    this.skuLineQueryParam.filters = filters
  }

  // /**
  //  * 千分位
  //  * @param value
  //  * @returns {string}
  //  */
  // private fmtThumb(value: string) {
  //   if (!value) return '0.00'
  //   let value2Array = value.split('.')
  //   let intPart = ''
  //   intPart = value2Array[0] // 获取整数部分
  //   let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三let
  //   let floatPart = '.00' // 预定义小数部分
  //   // =2表示数据有小数位
  //   if (value2Array.length === 2) {
  //     let floatStr = '0.' + value2Array[1]
  //     floatPart = Number(floatStr).toFixed(2).toString() // 拿到小数部分
  //     if (floatPart.length === 1) { // 补0,实际上用不着
  //       return intPartFormat + '.' + floatPart.substring(2, floatPart.length) + '0'
  //     } else {
  //       return intPartFormat + '.' + floatPart.substring(2, floatPart.length)
  //     }
  //   } else {
  //     return intPartFormat + floatPart
  //   }
  // }
}
