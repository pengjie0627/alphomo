import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import Receipt from 'model/statement/receipt/Receipt'
import ReceiptSummary from 'model/statement/receipt/ReceiptSummary'

export default class ReceiptApi {
  /**
   * 作废
   *
   */
  static abolish (uuid: string): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/statement/receipt/${uuid}/abolish`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 审核
   *
   */
  static audit (uuid: string): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/statement/receipt/${uuid}/audit`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 新增保存
   *
   */
  static create (body: Receipt): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/statement/receipt/create`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 详情
   *
   */
  static detail (uuid: string): Promise<Response<Receipt>> {
    return ApiClient.server().post(`{merchant}/statement/receipt/${uuid}/detail`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 应收对账明细-收款记录-导出
   *
   */
  static export (customer: string, body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/statement/receipt/${customer}/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 获取单号
   *
   */
  static getNum (): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/statement/receipt/getNum`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 下一单
   *
   */
  static next (customer: string, body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`{merchant}/statement/receipt/${customer}/next`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 上一单
   *
   */
  static prev (customer: string, body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`{merchant}/statement/receipt/${customer}/prev`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 应收对账明细-收款记录-列表
   *
   */
  static query (customer: string, body: QueryParam): Promise<Response<Receipt[]>> {
    return ApiClient.server().post(`{merchant}/statement/receipt/${customer}/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 编辑保存
   *
   */
  static save (body: Receipt): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/statement/receipt/save`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 应收对账明细-收款记录-汇总
   *
   */
  static summary (customer: string, body: QueryParam): Promise<Response<ReceiptSummary>> {
    return ApiClient.server().post(`{merchant}/statement/receipt/${customer}/summary`, body).then((res) => {
      return res.data
    })
  }

}
