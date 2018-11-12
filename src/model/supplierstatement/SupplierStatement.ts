import StandardEntity from 'model/entity/StandardEntity'
import Ucn from 'model/entity/Ucn'
import OssResult from 'model/image/OssResult'
import Invoice from 'model/invoice/Invoice'
import SupplierStatementLine from 'model/supplierstatement/SupplierStatementLine'

export default class SupplierStatement extends StandardEntity {
  // 商户
  merchant: Nullable<string>
  // 供应商
  supplier: Nullable<Ucn>
  // 经办人
  manager: Nullable<Ucn>
  // 单号
  billNum: Nullable<string>
  // 业务日期
  businessDate: Nullable<Date>
  // 实际结算
  amount: number = 0
  // 优惠金额
  discountAmount: number = 0
  // 结算金额
  settleAmount: number = 0
  // 状态
  status: Nullable<string>
  // 付款状态
  payStatus: Nullable<string>
  // 是否开票
  isInvoice: boolean = false
  // 备注
  remark: Nullable<string>
  // 图片列表
  images: OssResult[] = []
  // 付款单行
  lines: SupplierStatementLine[] = []
  // 发票
  invoices: Invoice[] = []
}
