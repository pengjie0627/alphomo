import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import Payment from 'model/statement/payment/Payment'
import PaymentBill from 'model/statement/payment/PaymentBill'
import PaymentSummary from 'model/statement/payment/PaymentSummary'

export default class PaymentApi {
  /**
   * 作废
   *
   */
  static abolish (uuid: string): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/statement/payment/${uuid}/abolish`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 审核
   *
   */
  static audit (uuid: string): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/statement/payment/${uuid}/audit`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 新增保存
   *
   */
  static create (body: Payment): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/statement/payment/create`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 详情
   *
   */
  static detail (uuid: string): Promise<Response<Payment>> {
    return ApiClient.server().post(`{merchant}/statement/payment/${uuid}/detail`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 付款单-导出列表
   *
   */
  static export (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/statement/payment/list/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 导出明细
   *
   */
  static exportPaymentDetail (id: string): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/statement/payment/detail/export`, {}, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 获取单号
   *
   */
  static getNum (): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/statement/payment/getNum`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 下一单
   *
   */
  static next (body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`{merchant}/statement/payment/next`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 上一单
   *
   */
  static prev (body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`{merchant}/statement/payment/prev`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 付款单-列表
   *
   */
  static query (body: QueryParam): Promise<Response<Payment[]>> {
    return ApiClient.server().post(`{merchant}/statement/payment/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 付款单据
   *
   */
  static queryBills (supplier: string, currency: string, body: QueryParam): Promise<Response<PaymentBill[]>> {
    return ApiClient.server().post(`{merchant}/statement/payment/${supplier}/queryBills`, body, {
      params: {
        currency: currency
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 删除
   *
   */
  static remove (uuid: string, version: number): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/statement/payment/${uuid}/remove`, {}, {
      params: {
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 编辑保存
   *
   */
  static save (body: Payment): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/statement/payment/save`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 保存并审核单据
   *
   */
  static saveAndAudit (body: Payment): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/statement/payment/saveAndAudit`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 付款单-汇总
   *
   */
  static summary (body: QueryParam): Promise<Response<PaymentSummary>> {
    return ApiClient.server().post(`{merchant}/statement/payment/summary`, body).then((res) => {
      return res.data
    })
  }

}
