import Entity from 'model/entity/Entity'
import Ucn from 'model/entity/Ucn'

export default class AbstractStatementLine extends Entity {
  merchant: Nullable<string>
  billUuid: Nullable<string>
  billNum: Nullable<string>
  billType: Nullable<string>
  billBusinessDate: Nullable<Date>
  billManager: Nullable<Ucn>
}
