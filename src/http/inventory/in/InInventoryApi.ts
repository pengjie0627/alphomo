import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import InInventory from 'model/inventory/in/InInventory'

export default class InInventoryApi {
  /**
   * 确认入库
   *
   */
  static audit (body: InInventory): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/inventory/in/audit`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 批量入库
   *
   */
  static batchAudit (uuids: string[]): Promise<Response<string[]>> {
    return ApiClient.server().post(`{merchant}/inventory/in/batch_audit`, {}, {
      params: {
        uuids: uuids
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 详情
   *
   */
  static detail (uuid: string): Promise<Response<InInventory>> {
    return ApiClient.server().post(`{merchant}/inventory/in/${uuid}/detail`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 入库单-导出
   *
   */
  static export (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/inventory/in/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 下一单
   *
   */
  static next (body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`{merchant}/inventory/in/next`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 上一单
   *
   */
  static prev (body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`{merchant}/inventory/in/prev`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 入库单-查询
   *
   */
  static query (body: QueryParam): Promise<Response<InInventory[]>> {
    return ApiClient.server().post(`{merchant}/inventory/in/query`, body).then((res) => {
      return res.data
    })
  }

}
