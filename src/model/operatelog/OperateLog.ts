import Entity from 'model/entity/Entity'

export default class OperateLog extends Entity {
  merchant: Nullable<string>
  operateTime: Nullable<Date>
  operator: Nullable<string>
  operate: Nullable<string>
  entity: Nullable<string>
  entityType: Nullable<string>
  newStatus: Nullable<string>
  oldStatus: Nullable<string>
  description: Nullable<string>
  extraParameters: any
}
