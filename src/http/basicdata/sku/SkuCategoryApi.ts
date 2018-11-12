import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import SkuCategory from 'model/basicdata/sku/SkuCategory'

export default class SkuCategoryApi {
  /**
   * 新增
   *
   */
  static create (body: SkuCategory): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/skuCategory/save/new`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 创建
   *
   */
  static createBefore (): Promise<Response<SkuCategory>> {
    return ApiClient.server().post(`{merchant}/skuCategory/create`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 删除
   *
   */
  static delete (uuid: string): Promise<Response<void>> {
    return ApiClient.server().post(`{merchant}/skuCategory/delete`, {}, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 删除
   *
   */
  static deleteByCode (code: string): Promise<Response<void>> {
    return ApiClient.server().post(`{merchant}/skuCategory/delete/byCode`, {}, {
      params: {
        code: code
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 编辑
   *
   */
  static edit (body: SkuCategory): Promise<Response<void>> {
    return ApiClient.server().post(`{merchant}/skuCategory/save/modify`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 查询
   *
   */
  static get (uuid: string): Promise<Response<SkuCategory>> {
    return ApiClient.server().get(`{merchant}/skuCategory/get`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 获取子分类,code为null获取一级分类
   *
   */
  static getByCategory (code: string): Promise<Response<SkuCategory[]>> {
    return ApiClient.server().get(`{merchant}/skuCategory/get/byCategory`, {
      params: {
        code: code
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 查询
   *
   */
  static getByCode (code: string): Promise<Response<SkuCategory>> {
    return ApiClient.server().get(`{merchant}/skuCategory/get/byCode`, {
      params: {
        code: code
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 获取商户下的所有商品分类，分层
   *
   */
  static getByMerchant (): Promise<Response<SkuCategory[]>> {
    return ApiClient.server().get(`{merchant}/skuCategory/get/byMerchant`).then((res) => {
      return res.data
    })
  }

  /**
   * 获取商户下的所有商品分类，分层
   *
   */
  static getByMerchantMgr (): Promise<Response<SkuCategory[]>> {
    return ApiClient.server().get(`{merchant}/skuCategory/get/byMerchantMgr`).then((res) => {
      return res.data
    })
  }

  /**
   * 根据父级查询
   *
   */
  static getByParent (parent: string): Promise<Response<SkuCategory[]>> {
    return ApiClient.server().get(`{merchant}/skuCategory/get/byParent`, {
      params: {
        parent: parent
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 获取商户下的一级分类
   *
   */
  static getFirstByMerchant (): Promise<Response<SkuCategory[]>> {
    return ApiClient.server().get(`{merchant}/skuCategory/get/first/byMerchant`).then((res) => {
      return res.data
    })
  }

  /**
   * 获取商户下的所有商品分类，不分层
   *
   */
  static list (): Promise<Response<SkuCategory[]>> {
    return ApiClient.server().get(`{merchant}/skuCategory/list`).then((res) => {
      return res.data
    })
  }

}
