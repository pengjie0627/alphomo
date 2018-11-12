import { Component, Prop, Vue } from 'vue-property-decorator'
import SaleReturn from 'model/salereturn/SaleReturn.js'
import { FormValidator } from 'fant'
import Warehouse from 'model/basicdata/warehouses/Warehouse'
import Ucn from 'model/entity/Ucn'
import Search from 'cmp/Search.vue'
import Customer from 'model/basicdata/customer/Customer'
import User from 'model/framework/user/User'

@Component({
  name: 'SaleReturnEditHeader',
  components: {
    Search
  }
})
export default class SaleReturnEditHeader extends Vue {

  @Prop()
  bill: SaleReturn
  @Prop()
  presentation: string
  @Prop()
  validator: FormValidator
  @Prop()
  warehouses: Warehouse[]
  @Prop()
  isReturnFromSale: boolean = false

  setCustomer(customer: Customer) {
    if (!customer) {
      this.bill.customer = null
      return
    }
    let ucn = new Ucn()
    ucn.id = customer.id
    ucn.code = customer.code
    ucn.name = customer.name
    this.bill.customer = ucn
  }

  onCustomerClear() {
    this.bill.customer = null
  }

  setManager(manager: User) {
    if (!manager) {
      this.bill.manager = null
      return
    }
    let ucn = new Ucn()
    ucn.id = manager.id
    ucn.code = manager.mobile
    ucn.name = manager.name
    this.bill.manager = ucn
  }

  onManagerClear() {
    this.bill.manager = null
  }

  onWarehouseChange(warehouse: Warehouse) {
    if (!warehouse) {
      this.bill.warehouse = null
      return
    }
    let ucn = new Ucn()
    ucn.id = warehouse.id
    ucn.code = warehouse.code
    ucn.name = warehouse.name
    this.bill.warehouse = ucn
  }
}
