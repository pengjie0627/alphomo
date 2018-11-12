import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import OutInventory from 'model/inventory/out/OutInventory'

export default class OutInventoryApi {
  /**
   * 确认出库
   *
   */
  static audit (body: OutInventory): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/inventory/out/audit`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 批量出库
   *
   */
  static batchAudit (): Promise<Response<string[]>> {
    return ApiClient.server().post(`{merchant}/inventory/out/batch_audit`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 详情
   *
   */
  static detail (uuid: string): Promise<Response<OutInventory>> {
    return ApiClient.server().post(`{merchant}/inventory/out/${uuid}/detail`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 导出
   *
   */
  static export (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/inventory/out/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 下一单
   *
   */
  static next (body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`{merchant}/inventory/out/next`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 上一单
   *
   */
  static prev (body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`{merchant}/inventory/out/prev`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 出库单-查询
   *
   */
  static query (body: QueryParam): Promise<Response<OutInventory[]>> {
    return ApiClient.server().post(`{merchant}/inventory/out/query`, body).then((res) => {
      return res.data
    })
  }

}
