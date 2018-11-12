import AbstractInventoryBillLine from 'model/inventory/AbstractInventoryBillLine'

export default class OutInventoryLine extends AbstractInventoryBillLine {
  outInventory: Nullable<string>
}
