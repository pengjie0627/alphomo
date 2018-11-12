import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import Payable from 'model/statement/payable/Payable'
import PayableReport from 'model/statement/payable/PayableReport'
import PayableReportSummary from 'model/statement/payable/PayableReportSummary'
import PayableReportTotal from 'model/statement/payable/PayableReportTotal'
import PayableSummary from 'model/statement/payable/PayableSummary'

export default class PayableReportApi {
  /**
   * 应付对账-导出
   *
   */
  static export (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/statement/payable/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 应付对账明细-业务对账-导出
   *
   */
  static exportBill (supplier: string, body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/statement/payable/bill/${supplier}/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 应收对账-列表
   *
   */
  static query (body: QueryParam): Promise<Response<PayableReport[]>> {
    return ApiClient.server().post(`{merchant}/statement/payable/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 应付对账明细-业务对账-列表
   *
   */
  static queryBill (supplier: string, body: QueryParam): Promise<Response<Payable[]>> {
    return ApiClient.server().post(`{merchant}/statement/payable/bill/${supplier}/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 应付对账明细-业务对账-查询汇总
   *
   */
  static queryBillSummary (supplier: string, body: QueryParam): Promise<Response<PayableSummary>> {
    return ApiClient.server().post(`{merchant}/statement/payable/bill/${supplier}/summary`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 应付对账-查询汇总
   *
   */
  static querySummary (body: QueryParam): Promise<Response<PayableReportSummary>> {
    return ApiClient.server().post(`{merchant}/statement/payable/summary`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 应付对账-商户
   *
   */
  static total (): Promise<Response<PayableReportTotal>> {
    return ApiClient.server().post(`{merchant}/statement/payable/total`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 应付对账-供应商
   *
   */
  static totalBySupplier (supplier: string): Promise<Response<PayableReportTotal>> {
    return ApiClient.server().post(`{merchant}/statement/payable/${supplier}/total`, {}).then((res) => {
      return res.data
    })
  }

}
