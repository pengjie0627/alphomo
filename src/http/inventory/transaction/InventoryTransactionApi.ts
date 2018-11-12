import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import InventoryTransaction from 'model/inventory/transaction/InventoryTransaction'
import InventoryTransactionSummary from 'model/inventory/transaction/InventoryTransactionSummary'

export default class InventoryTransactionApi {
  /**
   * 导出
   *
   */
  static export (sku: string, body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/inventory/transaction/${sku}/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 库存流水-查询
   *
   */
  static query (sku: string, body: QueryParam): Promise<Response<InventoryTransaction[]>> {
    return ApiClient.server().post(`{merchant}/inventory/transaction/${sku}/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 汇总
   *
   * @param startDate 开始时间，可以为空，格式：年年年年-月月-日日
   * @param endDate 结束时间，可以为空，格式：年年年年-月月-日日
   * @param warehouse 库存ID，可以为空，为空查询全部
   */
  static summary (sku: string, startDate: string, endDate: string, warehouse: string): Promise<Response<InventoryTransactionSummary>> {
    return ApiClient.server().get(`{merchant}/inventory/transaction/${sku}/summary`, {
      params: {
        startDate: startDate,
        endDate: endDate,
        warehouse: warehouse
      }
    }).then((res) => {
      return res.data
    })
  }

}
