import SaleSkuDailyReport from 'model/sale/report/SaleSkuDailyReport'
import Ucn from 'model/entity/Ucn'

export default class SaleSkuCustomerDailyReport extends SaleSkuDailyReport {
  customer: Nullable<Ucn>
  saleRate: number = 0
}
