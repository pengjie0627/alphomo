import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import SummaryResponse from 'model/response/SummaryResponse'
import PurchaseBusinessReport from 'model/purchase/report/PurchaseBusinessReport'
import PurchaseReportSummary from 'model/purchase/report/PurchaseReportSummary'
import PurchaseSkuDailyReport from 'model/purchase/report/PurchaseSkuDailyReport'
import PurchaseSkuSupplierDailyReport from 'model/purchase/report/PurchaseSkuSupplierDailyReport'
import PurchaseSummary from 'model/purchase/report/PurchaseSummary'

export default class PurchaseReportApi {
  /**
   * 进货报表-单据
   *
   */
  static business (body: QueryParam): Promise<SummaryResponse<PurchaseSkuDailyReport[], PurchaseSummary>> {
    return ApiClient.server().post(`{merchant}/report/purchase/business`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 进货报表-具体单据列表
   *
   */
  static businessBills (body: QueryParam): Promise<SummaryResponse<PurchaseBusinessReport[], PurchaseSummary>> {
    return ApiClient.server().post(`{merchant}/report/purchase/business/bills`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 导出进货报表-单据维度excel
   *
   */
  static exportBillReportList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/report/purchase/business/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 导出进货报表-单据维度-单据流水excel
   *
   */
  static exportBusinessBillList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/report/purchase/business/bills/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 导出进货报表-供应商维度excel
   *
   * @param groupBySku 是否在商品维度分组
   */
  static exportPurchaseList (groupBySku: boolean, body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/report/purchase/supplier/export`, body, {
      params: {
        groupBySku: groupBySku
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 导出进货详情-商品维度-按单据excel
   *
   */
  static exportSkuBillExport (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/report/purchase/sku/bill/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 导出进货报表-商品维度excel
   *
   */
  static exportSkuList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/report/purchase/sku/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 导出进货详情-商品维度-按供应商excel
   *
   * @param groupBySku 是否在商品维度分组
   */
  static exportSkuSupplierExport (groupBySku: boolean, body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/report/purchase/sku/supplier/export`, body, {
      params: {
        groupBySku: groupBySku
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 导出进货报表-供应商维度-按单据excel
   *
   */
  static exportSupplierBillList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/report/purchase/supplier/bills/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 导出进货报表-供应商维度-按商品excel
   *
   */
  static exportSupplierSkuList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/report/purchase/supplier/sku/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 报表-汇总
   *
   */
  static getSummary (body: QueryParam): Promise<Response<PurchaseReportSummary>> {
    return ApiClient.server().post(`{merchant}/report/purchase/summary`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 报表-商品维度查询
   *
   */
  static querySku (body: QueryParam): Promise<SummaryResponse<PurchaseSkuDailyReport[], PurchaseSummary>> {
    return ApiClient.server().post(`{merchant}/report/purchase/sku`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 报表-供应商维度查询
   *
   * @param groupBySku 是否在商品维度分组
   */
  static querySupplier (groupBySku: boolean, body: QueryParam): Promise<SummaryResponse<PurchaseSkuSupplierDailyReport[], PurchaseSummary>> {
    return ApiClient.server().post(`{merchant}/report/purchase/supplier`, body, {
      params: {
        groupBySku: groupBySku
      }
    }).then((res) => {
      return res.data
    })
  }

}
