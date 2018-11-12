import { Component, Vue } from 'vue-property-decorator'
import { FormValidator, Loading, ObjectUtil } from 'fant'
import Warehouse from 'model/basicdata/warehouses/Warehouse'
import BeginingInventory from 'model/inventory/begining/BeginingInventory'
import ThinSku from 'model/commons/ThinSku'
import Sku from 'model/basicdata/sku/Sku'
import QfSearch from 'cmp/Search.vue'
import InventoryBeginingApi from 'http/inventory/begining/InventoryBeginingApi'
import User from 'model/framework/user/User'
import Ucn from 'model/entity/Ucn'
import ConstantMgr from 'mgr/ConstantMgr'
import SaleLine from 'model/sale/SaleLine'

@Component({
  name: 'Edit',
  components: {
    QfSearch
  }
})
export default class Add extends Vue {
  user: User
  warehouse: Warehouse
  onConfirm: Function
  validator: FormValidator = new FormValidator()
  tooltip: any
  // isLastLine: boolean = false
  data: BeginingInventory[]
  $refs: {
    table: any,
    name: any
  }
  // 界面长度限制
  limits = ConstantMgr.limits.inventory


  mounted() {
    this.validator.push({
      sku: [{
        required: true, message: '商品不能为空！'
      }],
      qty: [{
        required: true, message: '库存不能为空！'
      }, {
        min: 0, message: '库存数必须大于0！'
      }, {
        max: 999999, message: '库存数不得大于999999！'
      }],
      price: [{
        required: true, message: '成本价不能为空！'
      }, {
        min: 0, message: '成本价不能小于0！'
      }, {
        max: 999999.99, message: '成本价不得大于999999.99！'
      }],
      amount: [{
        required: true, message: '成本金额不能为空！'
      }, {
        min: 0, message: '成本金额不能小于0！'
      }, {
        max: 999999999.99, message: '成本金额不得大于999999999.99！'
      }]
    })
    this.initData()
  }

  initData() {
    this.addEmptyLine()
    console.log(this.data)
  }


  isEmptyLine(line: SaleLine): boolean {
    return !line.sku || !line.sku.id
  }

  doCancel() {
    this.$emit('hide')
  }

  doConfirm() {
    if (this.data.length === 1) {
      this.$message.warning('至少添加一条期初库存信息')
      return false
    }
    this.data.splice(this.data.length - 1, 1)
    this.validator.validate(true).then(() => {
      let loading = Loading.show()
      InventoryBeginingApi.batchCreate(this.data).then((resp) => {
        this.onConfirm()
        this.$emit('hide')
        loading.hide()
        this.$message.success('成功' + resp.data.successCount + '条，失败' + resp.data.failCount + '条')
      }).catch((err) => {
        loading.hide()
        this.$message.error(err.message)
      })
    })

  }

  onRowChange(column: string, row: BeginingInventory) {
    if ('price' === column) {
      row.beginingCostPrice = Number(row.beginingCostPrice)
      row.beginingAmount = Number((row.beginingCostPrice * row.beginingQty).toFixed(2))
    } else if ('qty' === column) {
      row.beginingQty = Number(row.beginingQty)
      row.beginingAmount = Number((row.beginingCostPrice * row.beginingQty).toFixed(2))
      row.taxExcBeginingAmount = Number((row.taxExcBeginingCostPrice * row.beginingQty).toFixed(2))
    } else if ('amount' === column) {
      row.beginingAmount = Number(row.beginingAmount)
      row.beginingCostPrice = Number((row.beginingAmount / row.beginingQty).toFixed(4))
    } else if ('taxExcPrice' === column) {
      row.taxExcBeginingCostPrice = Number(row.taxExcBeginingCostPrice)
      row.taxExcBeginingAmount = Number((row.taxExcBeginingCostPrice * row.beginingQty).toFixed(2))
    } else if ('taxExcAmount' === column) {
      row.taxExcBeginingAmount = Number(row.taxExcBeginingAmount)
      row.taxExcBeginingCostPrice = Number((row.taxExcBeginingAmount / row.beginingQty).toFixed(4))
    }
  }



  /**
   * 设置行
   * @param {Sku} sku
   * @param {BeginingInventory} row
   * @param {number} rowIndex
   */
  setRowSku(sku: Sku, row: BeginingInventory, rowIndex: number) {
    let line: BeginingInventory = this.buildInventoryLine(sku)
    let item = this.data.find((item, index) => {
      if (!item.sku) {
        return false
      }
      return item.sku.id === sku.id && index !== rowIndex
    })
    if (!item) {
      Vue.set(row, 'id', line.id)
      Vue.set(row, 'sku', line.sku)
      Vue.set(row, 'beginingAmount', line.beginingAmount)
      Vue.set(row, 'beginingCostPrice', line.beginingCostPrice)
      Vue.set(row, 'beginingQty', line.beginingQty)
      Vue.set(row, 'warehouse', line.warehouse)
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

  /**
   * 添加一个空行
   */
  addEmptyLine() {
    let line = new BeginingInventory()
    line.sku = new Sku()
    line.id = ObjectUtil.uuid()
    this.data.push(line)
  }

  getWarehouse() {
    let ucn = new Ucn()
    if (!this.warehouse) {
      return ucn
    }
    ucn.name = this.warehouse.name
    ucn.id = this.warehouse.id
    ucn.code = this.warehouse.code
    return ucn
  }

  /**
   * 转换为新行
   * @param {Sku} sku
   */
  buildInventoryLine(sku: Sku) {
    let newInventoryLine: BeginingInventory = new BeginingInventory()
    newInventoryLine.id = ObjectUtil.uuid()
    newInventoryLine.merchant = this.user.merchant
    newInventoryLine.warehouse = this.getWarehouse()
    newInventoryLine.beginingQty = 0
    newInventoryLine.beginingCostPrice = 0
    newInventoryLine.beginingAmount = 0
    newInventoryLine.sku = new ThinSku()
    newInventoryLine.sku.id = sku.id
    newInventoryLine.sku.code = sku.code
    newInventoryLine.sku.barcode = sku.barcode
    newInventoryLine.sku.name = sku.name
    newInventoryLine.sku.munit = sku.munit
    newInventoryLine.sku.spec = sku.spec
    newInventoryLine.sku.category = sku.category
    return newInventoryLine
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
}
