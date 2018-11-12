import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import Charge from 'model/charge/Charge'
import ChargeSummary from 'model/charge/ChargeSummary'
import ContextPageInfo from 'model/commons/ContextPageInfo'

export default class ChargeApi {
  /**
   * 作废费用单
   *
   */
  static abolish (id: string, version: number): Promise<Response<Charge>> {
    return ApiClient.server().post(`{merchant}/charge/abolish`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 审核费用单
   *
   */
  static audit (id: string, version: number): Promise<Response<Charge>> {
    return ApiClient.server().post(`{merchant}/charge/audit`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 创建不持久化的费用单
   *
   */
  static create (): Promise<Response<Charge>> {
    return ApiClient.server().get(`{merchant}/charge/create`).then((res) => {
      return res.data
    })
  }

  /**
   * 导出明细
   *
   */
  static exportChargeDetail (id: string): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/charge/detail/export`, {}, {
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
  static exportChargeList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/charge/list/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 获取费用单
   *
   */
  static get (id: string): Promise<Response<Charge>> {
    return ApiClient.server().get(`{merchant}/charge/get`, {
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
    return ApiClient.server().post(`{merchant}/charge/next`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 上一单
   *
   */
  static prev (body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`{merchant}/charge/prev`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 查询费用单列表
   *
   */
  static query (body: QueryParam): Promise<Response<Charge[]>> {
    return ApiClient.server().post(`{merchant}/charge/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 删除费用单
   *
   */
  static remove (id: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`{merchant}/charge/remove`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 保存费用单
   *
   */
  static save (body: Charge): Promise<Response<Charge>> {
    return ApiClient.server().post(`{merchant}/charge/save`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 保存并审核费用单
   *
   */
  static saveAndAudit (body: Charge): Promise<Response<Charge>> {
    return ApiClient.server().post(`{merchant}/charge/saveAndAudit`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 查询费用单列表合计数据
   *
   */
  static summary (body: QueryParam): Promise<Response<ChargeSummary>> {
    return ApiClient.server().post(`{merchant}/charge/summary`, body).then((res) => {
      return res.data
    })
  }

}
