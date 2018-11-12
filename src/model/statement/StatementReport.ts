export default class StatementReport {
  id: Nullable<string>
  billNum: Nullable<string>
  billType: Nullable<string>
  businessDate: Nullable<Date>
  merchant: Nullable<string>
  csId: Nullable<string>
  csName: Nullable<string>
  receivedAmount: number = 0
  paidAmount: number = 0
}
