import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import StatementReport from 'model/statement/StatementReport'
import StatementSummary from 'model/statement/StatementSummary'

export default class StatementReportApi {
  /**
   * 导出
   *
   */
  static export (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/statement/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 收支流水-列表
   *
   */
  static query (body: QueryParam): Promise<Response<StatementReport[]>> {
    return ApiClient.server().post(`{merchant}/statement/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 收支流水-汇总
   *
   */
  static summary (body: QueryParam): Promise<Response<StatementSummary>> {
    return ApiClient.server().post(`{merchant}/statement/summary`, body).then((res) => {
      return res.data
    })
  }

}
