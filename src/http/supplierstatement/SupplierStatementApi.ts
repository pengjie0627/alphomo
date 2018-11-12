import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import SupplierStatement from 'model/supplierstatement/SupplierStatement'
import SupplierStatementBill from 'model/supplierstatement/SupplierStatementBill'
import SupplierStatementSummary from 'model/supplierstatement/SupplierStatementSummary'

export default class SupplierStatementApi {
  /**
   * 作废
   *
   */
  static abolish (uuid: string): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/supplier/statement/${uuid}/abolish`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 审核
   *
   */
  static audit (uuid: string): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/supplier/statement/${uuid}/audit`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 新增保存
   *
   */
  static create (body: SupplierStatement): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/supplier/statement/create`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 详情
   *
   */
  static detail (uuid: string): Promise<Response<SupplierStatement>> {
    return ApiClient.server().post(`{merchant}/supplier/statement/${uuid}/detail`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 导出明细
   *
   */
  static exportSupplierStatementDetail (id: string): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/supplier/statement/detail/export`, {}, {
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
  static exportSupplierStatementList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/supplier/statement/list/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 获取单号
   *
   */
  static getNum (): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/supplier/statement/getNum`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 下一单
   *
   */
  static next (body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`{merchant}/supplier/statement/next`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 上一单
   *
   */
  static prev (body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`{merchant}/supplier/statement/prev`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 列表
   *
   */
  static query (body: QueryParam): Promise<Response<SupplierStatement[]>> {
    return ApiClient.server().post(`{merchant}/supplier/statement/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 结算单据
   *
   */
  static queryBills (supplier: string, body: QueryParam): Promise<Response<SupplierStatementBill[]>> {
    return ApiClient.server().post(`{merchant}/supplier/statement/${supplier}/queryBills`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 删除
   *
   */
  static remove (uuid: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`{merchant}/supplier/statement/${uuid}/remove`, {}, {
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
  static save (body: SupplierStatement): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/supplier/statement/save`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 保存并审核单据
   *
   */
  static saveAndAudit (body: SupplierStatement): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/supplier/statement/saveAndAudit`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 汇总
   *
   */
  static summary (body: QueryParam): Promise<Response<SupplierStatementSummary>> {
    return ApiClient.server().post(`{merchant}/supplier/statement/summary`, body).then((res) => {
      return res.data
    })
  }

}
