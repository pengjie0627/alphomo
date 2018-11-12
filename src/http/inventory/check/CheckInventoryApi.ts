import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import CheckInventory from 'model/inventory/check/CheckInventory'

export default class CheckInventoryApi {
  /**
   * 审核
   *
   */
  static audit (id: string, version: number): Promise<Response<CheckInventory>> {
    return ApiClient.server().post(`/{merchant}/inventory/check/audit`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 批量审核
   *
   */
  static batchAudit (body: CheckInventory[]): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/inventory/check/batch/audit`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 批量删除草稿
   *
   */
  static batchRemove (body: CheckInventory[]): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/inventory/check/batch/remove`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 创建
   *
   */
  static create (): Promise<Response<CheckInventory>> {
    return ApiClient.server().get(`/{merchant}/inventory/check/create`).then((res) => {
      return res.data
    })
  }

  /**
   * 导出列表
   *
   */
  static exportList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`/{merchant}/inventory/check/list/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 获取
   *
   */
  static get (id: string): Promise<Response<CheckInventory>> {
    return ApiClient.server().get(`/{merchant}/inventory/check/get`, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 获取并创建(复制)
   *
   */
  static getAndCreate (id: string): Promise<Response<CheckInventory>> {
    return ApiClient.server().get(`/{merchant}/inventory/check/getAndCreate`, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 获取下一单
   *
   */
  static getNext (body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`/{merchant}/inventory/check/get/next`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 获取上一单
   *
   */
  static getPrev (body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`/{merchant}/inventory/check/get/prev`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 查询列表
   *
   */
  static query (body: QueryParam): Promise<Response<CheckInventory[]>> {
    return ApiClient.server().post(`/{merchant}/inventory/check/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 删除草稿
   *
   */
  static remove (id: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/inventory/check/remove`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 保存
   *
   */
  static save (body: CheckInventory): Promise<Response<CheckInventory>> {
    return ApiClient.server().post(`/{merchant}/inventory/check/save`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 保存并审核
   *
   */
  static saveAndAudit (body: CheckInventory): Promise<Response<CheckInventory>> {
    return ApiClient.server().post(`/{merchant}/inventory/check/saveAndAudit`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 保存并创建
   *
   */
  static saveAndCreate (body: CheckInventory): Promise<Response<CheckInventory>> {
    return ApiClient.server().post(`/{merchant}/inventory/check/saveAndCreate`, body).then((res) => {
      return res.data
    })
  }

}
