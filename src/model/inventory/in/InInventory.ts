import AbstractInventoryBill from 'model/inventory/AbstractInventoryBill'
import InInventoryLine from 'model/inventory/in/InInventoryLine'

export default class InInventory extends AbstractInventoryBill {
  externalBillNum: Nullable<string>
  lines: InInventoryLine[] = []
}
