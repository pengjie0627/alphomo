import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import SummaryResponse from 'model/response/SummaryResponse'
import InventoryDailyReport from 'model/inventory/report/InventoryDailyReport'
import InventoryDailyReportSummary from 'model/inventory/report/InventoryDailyReportSummary'
import InventoryReportSummary from 'model/inventory/report/InventoryReportSummary'

export default class InventoryReportApi {
  /**
   * 导出
   *
   */
  static export (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/inventory/report/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * SKU导出
   *
   */
  static exportBySku (sku: string, body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/inventory/report/${sku}/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 库存报表-查询&汇总
   *
   */
  static query (body: QueryParam): Promise<SummaryResponse<InventoryDailyReport[], InventoryDailyReportSummary>> {
    return ApiClient.server().post(`{merchant}/inventory/report/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 库存报表-查询&汇总
   *
   */
  static queryHome (body: QueryParam): Promise<SummaryResponse<InventoryDailyReport[], InventoryDailyReportSummary>> {
    return ApiClient.server().post(`{merchant}/inventory/report/queryHome`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 库存报表-指定商品SKU查询
   *
   */
  static querySku (sku: string, body: QueryParam): Promise<Response<InventoryDailyReport[]>> {
    return ApiClient.server().post(`{merchant}/inventory/report/${sku}/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 按指定日期汇总
   *
   * @param startDate 开始时间，可以为空，格式：年年年年-月月-日日
   * @param endDate 结束时间，可以为空，格式：年年年年-月月-日日
   */
  static total (startDate: string, endDate: string): Promise<Response<InventoryReportSummary>> {
    return ApiClient.server().get(`{merchant}/inventory/report/total`, {
      params: {
        startDate: startDate,
        endDate: endDate
      }
    }).then((res) => {
      return res.data
    })
  }

}
