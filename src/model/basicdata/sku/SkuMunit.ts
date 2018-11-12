import StandardEntity from 'model/entity/StandardEntity'

export default class SkuMunit extends StandardEntity {
  name: Nullable<string>
  times: number = 0
  qpc: Nullable<string>
}
