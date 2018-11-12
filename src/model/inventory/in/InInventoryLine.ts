import AbstractInventoryBillLine from 'model/inventory/AbstractInventoryBillLine'

export default class InInventoryLine extends AbstractInventoryBillLine {
  inInventory: Nullable<string>
}
