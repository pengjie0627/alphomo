import StandardEntity from 'model/entity/StandardEntity'
import PrintConfig from 'model/print/PrintConfig'

export default class PrintTemplate extends StandardEntity {
  merchant: Nullable<string>
  type: Nullable<string>
  template: Nullable<string>
  status: number = 0
  config: Nullable<PrintConfig>
  name: Nullable<string>
}
