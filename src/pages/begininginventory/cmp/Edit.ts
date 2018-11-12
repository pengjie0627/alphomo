import { Component, Vue } from 'vue-property-decorator'
import { FormValidator, Loading } from 'fant'
import Warehouse from 'model/basicdata/warehouses/Warehouse'
import BeginingInventory from 'model/inventory/begining/BeginingInventory'
import QfSearch from 'cmp/Search.vue'
import User from 'model/framework/user/User'
import InventoryBeginingApi from 'http/inventory/begining/InventoryBeginingApi'
import ConstantMgr from 'mgr/ConstantMgr'

@Component({
  name: 'Edit',
  components: {
    QfSearch
  }
})
export default class Edit extends Vue {
  user: User
  warehouse: Warehouse
  onConfirm: Function
  validator: FormValidator = new FormValidator()
  beginingInventory: BeginingInventory
  uuid: string
  // 界面长度限制
  limits = ConstantMgr.limits.inventory

  created() {
    let loading = Loading.show()
    if (this.uuid) {
      InventoryBeginingApi.detail(this.uuid).then((resp) => {
        this.beginingInventory = resp.data
        loading.hide()
      }).catch((err) => {
        loading.hide()
        this.$message.error(err.message)
      })
    }
  }


  mounted() {
    this.validator.push({
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
  }

  onRowChange(column: string) {
    if (this.beginingInventory.beginingCostPrice.toString() === '') {
      this.beginingInventory.beginingCostPrice = 0
    }
    if (this.beginingInventory.taxExcBeginingCostPrice.toString() === '') {
      this.beginingInventory.taxExcBeginingCostPrice = 0
    }
    if (this.beginingInventory.beginingAmount.toString() === '') {
      this.beginingInventory.beginingAmount = 0
    }
    if (this.beginingInventory.taxExcBeginingAmount.toString() === '') {
      this.beginingInventory.taxExcBeginingAmount = 0
    }
    if (this.beginingInventory.beginingQty.toString() === '') {
      this.beginingInventory.beginingQty = 0
    }
    if ('price' === column) {
      this.beginingInventory.beginingCostPrice = Number(this.beginingInventory.beginingCostPrice)
      this.beginingInventory.beginingAmount = Number((this.beginingInventory.beginingCostPrice * this.beginingInventory.beginingQty).toFixed(2))
    } else if ('qty' === column) {
      this.beginingInventory.beginingQty = Number(this.beginingInventory.beginingQty)
      this.beginingInventory.beginingAmount = Number((this.beginingInventory.beginingCostPrice * this.beginingInventory.beginingQty).toFixed(2))
      this.beginingInventory.taxExcBeginingAmount = Number((this.beginingInventory.taxExcBeginingCostPrice * this.beginingInventory.beginingQty).toFixed(2))
    } else if ('amount' === column) {
      this.beginingInventory.beginingAmount = Number(this.beginingInventory.beginingAmount)
      this.beginingInventory.beginingCostPrice = Number((this.beginingInventory.beginingAmount / this.beginingInventory.beginingQty).toFixed(6))
    } else if ('taxExcPrice' === column) {
      this.beginingInventory.taxExcBeginingCostPrice = Number(this.beginingInventory.taxExcBeginingCostPrice)
      this.beginingInventory.taxExcBeginingAmount = Number((this.beginingInventory.taxExcBeginingCostPrice * this.beginingInventory.beginingQty).toFixed(2))
    } else if ('taxExcAmount' === column) {
      this.beginingInventory.taxExcBeginingAmount = Number(this.beginingInventory.taxExcBeginingAmount)
      this.beginingInventory.taxExcBeginingCostPrice = Number((this.beginingInventory.taxExcBeginingAmount / this.beginingInventory.beginingQty).toFixed(6))
    }
  }


  doCancel() {
    this.$emit('hide')
  }

  doConfirm() {
    this.validator.validate(true).then(() => {
      let loading = Loading.show()
      InventoryBeginingApi.saveModify(this.beginingInventory!.id!, this.beginingInventory).then((resp) => {
        this.onConfirm()
        this.$emit('hide')
        loading.hide()
        this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
      }).catch(e => {
        loading.hide()
        this.$message.error(e.message)
      })
    })
  }


}
