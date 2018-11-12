import { Component, Prop, Vue } from 'vue-property-decorator'
import ChargeLine from 'model/charge/ChargeLine'
import Charge from 'model/charge/Charge'
import QueryParam from 'model/request/QueryParam'
import Search from 'cmp/Search.vue'
import AccountCategory from 'model/basicdata/accountcategory/AccountCategory'
import Ucn from 'model/entity/Ucn'
import { FormValidator, ObjectUtil } from 'fant'
@Component({
  name: 'ChargeAddTable',
  components: {
    Search
  }
})
export default class ChargeAddTable extends Vue {
  @Prop()
  bill: Charge
  @Prop()
  lines: ChargeLine[]
  $refs: any
  queryParam: QueryParam
  tooltip: any
  @Prop()
  tableValidator: FormValidator
  editLastRow() {
    this.$nextTick(() => {
      this.focusCell('accountCategory', this.lines.length - 1)
    })
  }
  get billAmount() {
    if (this.bill.amount) {
      return this.fmtThumb(this.bill.amount.toString())
    } else {
      return 0.00
    }
  }
  getRowAccount(account: AccountCategory) {
    if (!account) {
      return new AccountCategory() // null
    }
    return account
  }
  setRowChargeLine(account: AccountCategory, row: ChargeLine, rowIndex: number) {
    // let contain = this.lines.find((item, index) => {
    //   if (!item.accountCategory) {
    //     return false
    //   }
    //   return item.accountCategory!.id === account.id
    // })

    // if (!contain) {
    let line: ChargeLine = this.createChargeLine(account)
    Vue.set(row, 'id', line.id)
    Vue.set(row, 'accountCategory', line.accountCategory)
    this.focusCell('amount', rowIndex)
    if (rowIndex === this.lines.length - 1) {
      this.addEmptyLine()
    }
    this.onLinesChanged()
    // } else {
    //   let self = this as any
    //   this.tooltip = (self.$tooltip)(this.$refs.accountCategory[this.lines.indexOf(contain)].$el, {
    //     trigger: 'manual',
    //     placement: 'top',
    //     content: '科目已存在',
    //     type: 'warning',
    //     autoClose: true
    //   })
    //   return
    // }
  }
  createChargeLine(account: AccountCategory): ChargeLine {
    let line = new ChargeLine()
    line.id = ObjectUtil.uuid()
    let ucn = new Ucn()
    ucn.code = account.code
    ucn.name = account.name
    ucn.id = account.id
    line.accountCategory = ucn
    return line
  }
  focusCell(column: string, rowIndex: number) {
    if (rowIndex >= this.lines.length || rowIndex < 0) {
      return
    }
    this.$nextTick(() => {
      this.$refs[column][rowIndex].focus()
    })
  }
  onChargeLineClear(account: AccountCategory, row: ChargeLine, rowIndex: number) {
    let line = this.lines[rowIndex]
    line.accountCategory = new AccountCategory()
    line.amount = 0
  }
  onTableKeyDown(event: any, rowIndex: number, colIndex: number, row: ChargeLine, colunm: any) {
    // 回车事件
    if (event.keyCode === 13) {
      if (colunm.property === 'accountCategory') {
        if (!this.isEmptyLine(row)) {
          this.focusCell('amount', rowIndex)
        } else {
          this.focusCell('accountCategory', rowIndex)
        }
        let item = this.lines.find(item => (this.isEmptyLine(item)))
        if (!item) {
          this.addEmptyLine()
        }
      } else if (colunm.property === 'amount') {
        this.focusCell('amountUpper', rowIndex)
      } else if (colunm.property === 'amountUpper') {
        let item = this.lines.find(item => (this.isEmptyLine(item)))
        if (!item) {
          this.addEmptyLine()
        }
        this.focusCell('accountCategory', rowIndex + 1)
      }
    } else if (event.keyCode === 38) {
      this.focusCell(colunm.property, rowIndex - 1)
    } else if (event.keyCode === 40) {
      this.focusCell(colunm.property, rowIndex + 1)
    }
  }
  onRowChange(column: string, row: ChargeLine) {
    row.amount = Number(Number(row.amount).toFixed(2))
    this.onLinesChanged()
  }
  isEmptyLine(line: ChargeLine): boolean {
    return !line.accountCategory || !line.accountCategory.id
  }
  addEmptyLine() {
    let empty = new ChargeLine()
    empty.id = ObjectUtil.uuid()
    this.lines.push(empty)
  }
  removeLine(rowIndex: number, row: ChargeLine) {
    this.lines.splice(rowIndex, 1)
    this.onLinesChanged()
  }
  onLinesChanged() {
    if (this.lines.length <= 0) {
      this.addEmptyLine()
    }
    let amount: number = 0
    this.bill.lines.forEach(line => {
      amount += Number(line.amount)
    })
    this.bill.amount = amount
    this.$emit('linesChange')
  }
  /**
   * 千分位
   * @param value
   * @returns {string}
   */
  private fmtThumb(value: string) {
    if (!value) return '0.00'
    let intPart = value.split('.')[0] // 之前的处理方式会四舍五入
    let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三let
    let floatPart = '.00' // 预定义小数部分
    let value2Array = value.split('.')

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
