import PurchaseSkuDailyReport from 'model/purchase/report/PurchaseSkuDailyReport'
import Ucn from 'model/entity/Ucn'

export default class PurchaseSkuSupplierDailyReport extends PurchaseSkuDailyReport {
  supplier: Nullable<Ucn>
}
