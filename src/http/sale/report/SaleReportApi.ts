import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import SummaryResponse from 'model/response/SummaryResponse'
import PayBill from 'model/entity/PayBill'
import SaleBusinessReport from 'model/sale/report/SaleBusinessReport'
import SaleReportSummary from 'model/sale/report/SaleReportSummary'
import SaleSkuCustomerDailyReport from 'model/sale/report/SaleSkuCustomerDailyReport'
import SaleSkuDailyReport from 'model/sale/report/SaleSkuDailyReport'
import SaleSummary from 'model/sale/report/SaleSummary'

export default class SaleReportApi {
  /**
   * 销售报表-单据维度
   *
   */
  static business (body: QueryParam): Promise<SummaryResponse<SaleSkuDailyReport[], SaleSummary>> {
    return ApiClient.server().post(`{merchant}/report/sale/business`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 销售报表-具体单据列表
   *
   */
  static businessBills (body: QueryParam): Promise<SummaryResponse<SaleBusinessReport[], SaleSummary>> {
    return ApiClient.server().post(`{merchant}/report/sale/business/bills`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 销售报表-单据维度-导出EXCEL
   *
   */
  static exportBusinessList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/report/sale/business/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 销售报表-具体单据-导出EXCEL
   *
   */
  static exportBusinessListBySku (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/report/sale/business/bills/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 销售报表-客户维度-导出EXCEL
   *
   * @param groupBySku 是否在商品维度分组
   */
  static exportSaleList (groupBySku: boolean, body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/report/sale/customer/export`, body, {
      params: {
        groupBySku: groupBySku
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 销售报表-商品维度-导出EXCEL
   *
   */
  static exportSkuList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/report/sale/sku/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 销售报表-客户维度
   *
   * @param groupBySku 是否在商品维度分组
   */
  static queryGroupByCustomer (groupBySku: boolean, body: QueryParam): Promise<SummaryResponse<SaleSkuCustomerDailyReport[], SaleSummary>> {
    return ApiClient.server().post(`{merchant}/report/sale/customer`, body, {
      params: {
        groupBySku: groupBySku
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 销售报表-商品维度
   *
   */
  static queryGroupBySku (body: QueryParam): Promise<SummaryResponse<SaleSkuDailyReport[], SaleSummary>> {
    return ApiClient.server().post(`{merchant}/report/sale/sku`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 应收单据
   *
   */
  static receivableBills (body: QueryParam): Promise<Response<PayBill[]>> {
    return ApiClient.server().post(`{merchant}/report/sale/receivable/bills`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 报表-汇总
   *
   * @param startDate 开始时间，可以为空，格式：年年年年-月月-日日
   * @param endDate 结束时间，可以为空为空，格式：年年年年-月月-日日
   */
  static summary (startDate: string, endDate: string): Promise<Response<SaleReportSummary>> {
    return ApiClient.server().post(`{merchant}/report/sale/summary`, {}, {
      params: {
        startDate: startDate,
        endDate: endDate
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 报表-汇总
   *
   * @param startDate 开始时间，可以为空，格式：年年年年-月月-日日
   * @param endDate 结束时间，可以为空为空，格式：年年年年-月月-日日
   */
  static summaryHome (startDate: string, endDate: string): Promise<Response<SaleReportSummary>> {
    return ApiClient.server().post(`{merchant}/report/sale/summaryHome`, {}, {
      params: {
        startDate: startDate,
        endDate: endDate
      }
    }).then((res) => {
      return res.data
    })
  }

}
