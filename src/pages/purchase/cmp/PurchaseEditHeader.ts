import { Component, Prop, Vue } from 'vue-property-decorator'
import Purchase from 'model/purchase/Purchase.js'
import { FormValidator } from 'fant'
import Warehouse from 'model/basicdata/warehouses/Warehouse'
import Ucn from 'model/entity/Ucn'
import Search from 'cmp/Search.vue'
import User from 'model/framework/user/User'
import Supplier from 'model/basicdata/supplier/Supplier'

@Component({
  name: 'PurchaseEditHeader',
  components: {
    Search
  }
})
export default class PurchaseEditHeader extends Vue {

  @Prop()
  bill: Purchase
  @Prop()
  presentation: string
  @Prop()
  validator: FormValidator
  @Prop()
  warehouses: Warehouse[]

  setSupplier(supplier: Supplier) {
    if (!supplier) {
      return new Ucn()
    }
    let m = new Ucn()
    m.id = supplier.id
    m.name = supplier.name
    m.code = supplier.code
    this.bill.supplier = m
  }

  onSupplierClear() {
    this.bill.supplier = null
  }

  setManager(manager: User) {
    let m = new Ucn()
    m.id = manager.id
    m.name = manager.name
    this.bill.manager = m
  }

  setWarehouse() {
    let m = new Ucn()
    m.id = this.bill.warehouse!.id
    m.code = this.bill.warehouse!.code
    m.name = this.bill.warehouse!.name
    this.bill.warehouse = m
  }

  onManagerClear() {
    this.bill.manager = null
  }
}
