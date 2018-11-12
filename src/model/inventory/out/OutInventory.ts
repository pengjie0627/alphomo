import AbstractInventoryBill from 'model/inventory/AbstractInventoryBill'
import OutInventoryLine from 'model/inventory/out/OutInventoryLine'
import ThinLogistics from 'model/inventory/out/ThinLogistics'

export default class OutInventory extends AbstractInventoryBill {
  externalBillNum: Nullable<string>
  lines: OutInventoryLine[] = []
  thinLogistics: Nullable<ThinLogistics>
}
