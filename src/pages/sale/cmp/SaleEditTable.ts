import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import SaleLine from 'model/sale/SaleLine.ts'
import { FormValidator, NumberUtil, ObjectUtil } from 'fant'
import ThinSku from 'model/commons/ThinSku'
import Sku from 'model/basicdata/sku/Sku'
import Search from 'cmp/Search.vue'
import { State } from 'vuex-class'
import MerchantConfig from 'model/framework/merchant/MerchantConfig'
import QueryParam from 'model/request/QueryParam'
import Sale from 'model/sale/Sale'
import FilterParam from 'model/request/FilterParam'
import ConstantMgr from 'mgr/ConstantMgr'
import SkuMunit from 'model/basicdata/sku/SkuMunit'
import SkuApi from 'http/basicdata/sku/SkuApi'
import { sessionStorage } from 'mgr/BrowserMgr.js'
@Component({
  name: 'SaleEditTable',
  components: {
    Search
  }
})
export default class SaleEditTable extends Vue {
  @State('merchantConfig') merchantConfig: MerchantConfig
  @Prop()
  bill: Sale
  @Prop()
  lines: SaleLine[]
  @Prop()
  validator: FormValidator
  @Prop()
  presentation: string
  queryParam: QueryParam
  $refs: any
  tooltip: any
  customId = ''
  // 界面长度限制
  limits = ConstantMgr.limits.sku
  autoCreate: boolean = true
  get getCustomId() {
    return sessionStorage.getItem('customer')
  }

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
  onNoCustom() {
    this.$message.error('请先选择客户')
  }

  setRowSku(sku: Sku, row: SaleLine, rowIndex: number) {
    let item = this.lines.find((item, index) => {
      if (!item.sku) {
        return false
      }
      return item.sku.id === sku.id
        &&
        index !== rowIndex
    })
    if (!item) {
      let line: SaleLine = this.buildSaleLine(sku)
      Vue.set(row, 'id', line.id)
      Vue.set(row, 'sku', line.sku)
      Vue.set(row, 'price', line.price)
      Vue.set(row, 'taxExcPrice', line.taxExcPrice)
      Vue.set(row, 'qty', line.qty)
      Vue.set(row, 'amount', line.amount)
      Vue.set(row, 'taxExcAmount', line.taxExcAmount)
      Vue.set(row, 'taxRate', line.taxRate)
      Vue.set(row, 'taxAmount', line.taxAmount)
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

  onSkuClear(sku: Sku, row: SaleLine, rowIndex: number) {
    let line = this.lines[rowIndex]
    line.sku = new ThinSku()
    line.qty = 0
    line.taxExcPrice = 0
    line.price = 0
    line.taxExcAmount = 0
    line.amount = 0
    line.taxRate = 0
    line.taxAmount = 0
    this.onLinesChanged()
  }

  isEmptyLine(line: SaleLine): boolean {
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
  munitSelectChange(munit: string, line: SaleLine, sku: ThinSku) {
    let index = (sku as any).skuMunitList.map((m: any) => {
      return m.name
    }).indexOf(munit)
    let time0 = line.sku!.times || 1
    let times = (sku as any).skuMunitList[index].times / time0
    line.price = line.price * times
    line.sku!.times = (sku as any).skuMunitList[index].times
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

  onTableKeyDown(event: any, rowIndex: number, colIndex: number, row: SaleLine, column: any) {
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
        if (this.merchantConfig.enableOutputTaxRateSupport) {
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

  onRowChange(column: string, row: SaleLine) {
    if ('price' === column) {
      row.price = Number(row.price)
      row.taxExcPrice = Number((row.price / (1 + row.taxRate / 100)).toFixed(2))
      row.amount = Number((row.price * row.qty).toFixed(2))
      row.taxExcAmount = Number((row.taxExcPrice * row.qty).toFixed(2))
      row.taxAmount = Number((row.taxExcAmount * row.taxRate / 100).toFixed(2))
    } else if ('taxExcPrice' === column) {
      row.taxExcPrice = Number(row.taxExcPrice)
      row.price = Number((row.taxExcPrice * (1 + row.taxRate / 100)).toFixed(2))
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
      row.price = Number((row.amount / row.qty).toFixed(4))
      row.taxExcPrice = Number((row.price / (1 + row.taxRate / 100)).toFixed(2))
      row.taxExcAmount = Number((row.taxExcPrice * row.qty).toFixed(2))
      row.taxAmount = Number((row.taxExcAmount * row.taxRate / 100).toFixed(2))
    } else if ('taxExcAmount' === column) {
      row.taxExcAmount = Number(row.taxExcAmount)
      row.taxExcPrice = Number((row.taxExcAmount / row.qty).toFixed(4))
      row.price = Number((row.taxExcPrice * (1 + row.taxRate / 100)).toFixed(2))
      row.amount = Number((row.price * row.qty).toFixed(2))
      row.taxAmount = Number((row.taxExcAmount * row.taxRate / 100).toFixed(2))
    } else if ('taxRate' === column) {
      row.taxRate = Number(row.taxRate)
      row.price = Number(((1 + row.taxRate / 100) * row.taxExcPrice).toFixed(2))
      row.amount = Number((row.price * row.qty).toFixed(2))
      row.taxAmount = Number((row.taxExcAmount * row.taxRate / 100).toFixed(2))
    }
    this.onLinesChanged()
  }

  addSkus(skus: Array<Sku>) {
    if (skus === null || skus.length <= 0) {
      return
    }
    let setLastLine: boolean = false
    skus.forEach(sku => {
      let line: SaleLine = this.buildSaleLine(sku, false)
      let lastLine: SaleLine = this.lines[this.lines.length - 1]
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
      } else {
        this.lines.splice(this.lines.length, 0, line)
      }
    })
    this.addEmptyLine()
    this.onLinesChanged()
  }

  doSelectMunitList(row: SaleLine) {
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

  addEmptyLine() {
    let empty = new SaleLine()
    empty.id = ObjectUtil.uuid()
    this.lines.push(empty)
  }

  removeLines(selected: SaleLine[]) {
    if (selected === null || selected.length <= 0) {
      return
    }
    let lines: Array<SaleLine> = this.lines
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

  freeTaxRate(selected: SaleLine[]) {
    if (selected === null || selected.length <= 0) {
      return
    }
    let lines: Array<SaleLine> = this.lines
    let freeTax: Set<string> = new Set()
    selected.forEach(s => {
      freeTax.add(s.id!)
    })
    for (let i: number = lines.length - 1; i >= 0; i--) {
      if (freeTax.has(lines[i].id!)) {
        lines[i].taxRate = 0
        lines[i].taxAmount = 0
        lines[i].amount = lines[i].taxExcAmount
        lines[i].price = lines[i].taxExcPrice
      }
    }
    this.onLinesChanged()
  }

  onLinesChanged() {
    this.$emit('linesChange')
  }

  buildSaleLine(sku: Sku, isAdd: boolean = true): SaleLine {
    let line: SaleLine = new SaleLine()
    line.id = ObjectUtil.uuid()
    line.sku = new ThinSku()
    line.sku.id = sku.id
    line.sku.code = sku.code
    line.sku.barcode = sku.barcode
    line.sku.name = sku.name
    line.sku.munit = sku.munit
    line.sku.spec = sku.spec
    line.sku.category = sku.category
    line.price = Number(sku.wholePrice)
    line.qty = 1
    line.amount = Number((line.price * line.qty).toFixed(2))
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
    if (this.merchantConfig.enableOutputTaxRateSupport) {
      line.taxRate = Number(sku.outputTaxRate)
    } else {
      line.taxRate = 0
    }
    line.taxExcPrice = Number(line.price / (1 + line.taxRate / 100))
    line.taxExcAmount = Number((line.taxExcPrice * line.qty).toFixed(2))
    line.taxAmount = Number((line.taxRate * line.taxExcAmount / 100).toFixed(2))
    return line
  }

  taxAmountFormat(row: any, column: any, value: number) {
    return NumberUtil.format(value, '0.00')
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

  skuLineQueryParam: QueryParam = new QueryParam()

  @Watch('bill', { deep: true })
  getQueryParam() {
    let filters: FilterParam[] = []
    this.bill && this.bill.warehouse && filters.push(new FilterParam('warehouseUuid:=', this.bill.warehouse.id))
    filters.push(new FilterParam('customer:=', sessionStorage.getItem('customer')))
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
