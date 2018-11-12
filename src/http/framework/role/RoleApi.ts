import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import FunctionPerm from 'model/framework/role/FunctionPerm'
import Role from 'model/framework/role/Role'
import UserPerm from 'model/framework/role/UserPerm'

export default class RoleApi {
  /**
   * 获取
   *
   */
  static delete (id: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/role/delete`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 获取
   *
   */
  static get (id: string): Promise<Response<Role>> {
    return ApiClient.server().get(`/{merchant}/role/get`, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 获取权限选择列表
   *
   */
  static listPerms (): Promise<Response<FunctionPerm[]>> {
    return ApiClient.server().get(`/{merchant}/role/listPerms`).then((res) => {
      return res.data
    })
  }

  /**
   * 获取权限选择列表
   *
   */
  static listUserPerms (): Promise<Response<UserPerm>> {
    return ApiClient.server().get(`/{merchant}/role/listUserPerms`).then((res) => {
      return res.data
    })
  }

  /**
   * 分页查询
   *
   */
  static query (body: QueryParam): Promise<Response<Role[]>> {
    return ApiClient.server().post(`/{merchant}/role/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 分页查询
   *
   */
  static queryAll (body: QueryParam): Promise<Response<Role[]>> {
    return ApiClient.server().post(`/{merchant}/role/queryAll`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 新建
   *
   */
  static saveModify (body: Role): Promise<Response<string>> {
    return ApiClient.server().post(`/{merchant}/role/save/modify`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 新建
   *
   */
  static saveNew (body: Role): Promise<Response<string>> {
    return ApiClient.server().post(`/{merchant}/role/save/new`, body).then((res) => {
      return res.data
    })
  }

}
