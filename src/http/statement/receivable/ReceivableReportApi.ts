import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import Receivable from 'model/statement/receivable/Receivable'
import ReceivableReport from 'model/statement/receivable/ReceivableReport'
import ReceivableReportSummary from 'model/statement/receivable/ReceivableReportSummary'
import ReceivableReportTotal from 'model/statement/receivable/ReceivableReportTotal'
import ReceivableSummary from 'model/statement/receivable/ReceivableSummary'

export default class ReceivableReportApi {
  /**
   * 应收对账-导出
   *
   */
  static export (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/statement/receivable/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 应收对账明细-业务对账-导出
   *
   */
  static exportBill (customer: string, body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/statement/receivable/bill/${customer}/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 应收对账-列表
   *
   */
  static query (body: QueryParam): Promise<Response<ReceivableReport[]>> {
    return ApiClient.server().post(`{merchant}/statement/receivable/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 应收对账明细-业务对账-列表
   *
   */
  static queryBill (customer: string, body: QueryParam): Promise<Response<Receivable[]>> {
    return ApiClient.server().post(`{merchant}/statement/receivable/bill/${customer}/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 应收对账-查询汇总
   *
   */
  static summary (body: QueryParam): Promise<Response<ReceivableReportSummary>> {
    return ApiClient.server().post(`{merchant}/statement/receivable/summary`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 应收对账明细-业务对账-查询汇总
   *
   */
  static summaryBill (customer: string, body: QueryParam): Promise<Response<ReceivableSummary>> {
    return ApiClient.server().post(`{merchant}/statement/receivable/bill/${customer}/summary`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 应收对账-商户
   *
   */
  static total (): Promise<Response<ReceivableReportTotal>> {
    return ApiClient.server().post(`{merchant}/statement/receivable/total`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 应收对账-客户
   *
   */
  static totalByCustomer (customer: string): Promise<Response<ReceivableReportTotal>> {
    return ApiClient.server().post(`{merchant}/statement/receivable/${customer}/total`, {}).then((res) => {
      return res.data
    })
  }

}
