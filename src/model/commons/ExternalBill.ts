import Entity from 'model/entity/Entity'

export default class ExternalBill extends Entity {
  billNum: Nullable<string>
  billType: Nullable<string>
  source: Nullable<string>
  billName: Nullable<string>
}
