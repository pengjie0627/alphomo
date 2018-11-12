import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import AdvancePayment from 'model/advancepayment/AdvancePayment'
import AdvancePaymentSummary from 'model/advancepayment/AdvancePaymentSummary'
import ContextPageInfo from 'model/commons/ContextPageInfo'

export default class AdvancePaymentApi {
  /**
   * 作废预付款单
   *
   */
  static abolish (id: string, version: number): Promise<Response<AdvancePayment>> {
    return ApiClient.server().post(`{merchant}/advancepayment/abolish`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 审核预付款单
   *
   */
  static audit (id: string, version: number): Promise<Response<AdvancePayment>> {
    return ApiClient.server().post(`{merchant}/advancepayment/audit`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 创建不持久化的预付款单
   *
   */
  static create (): Promise<Response<AdvancePayment>> {
    return ApiClient.server().get(`{merchant}/advancepayment/create`).then((res) => {
      return res.data
    })
  }

  /**
   * 导出明细
   *
   */
  static exportAdvancePaymentDetail (id: string): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/advancepayment/detail/export`, {}, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 导出列表
   *
   */
  static exportAdvancePaymentList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/advancepayment/list/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 获取预付款单
   *
   */
  static get (id: string): Promise<Response<AdvancePayment>> {
    return ApiClient.server().get(`{merchant}/advancepayment/get`, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 下一单
   *
   */
  static next (body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`{merchant}/advancepayment/next`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 上一单
   *
   */
  static prev (body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`{merchant}/advancepayment/prev`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 查询预付款单列表
   *
   */
  static query (body: QueryParam): Promise<Response<AdvancePayment[]>> {
    return ApiClient.server().post(`{merchant}/advancepayment/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 删除预付款单
   *
   */
  static remove (id: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`{merchant}/advancepayment/remove`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 保存预付款单
   *
   */
  static save (body: AdvancePayment): Promise<Response<AdvancePayment>> {
    return ApiClient.server().post(`{merchant}/advancepayment/save`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 保存并审核预付款单
   *
   */
  static saveAndAudit (body: AdvancePayment): Promise<Response<AdvancePayment>> {
    return ApiClient.server().post(`{merchant}/advancepayment/saveAndAudit`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 查询预付款单列表合计数据
   *
   */
  static summary (body: QueryParam): Promise<Response<AdvancePaymentSummary>> {
    return ApiClient.server().post(`{merchant}/advancepayment/summary`, body).then((res) => {
      return res.data
    })
  }

}
