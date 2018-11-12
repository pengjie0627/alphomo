import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import User from 'model/framework/user/User'

export default class UserApi {
  /**
   * 绑定手机号或修改
   *
   * @param authCode 手机校验码
   */
  static bindMobile (mobile: string, authCode: string): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/user/bindMobile`, {}, {
      params: {
        mobile: mobile,
        authCode: authCode
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 删除
   *
   */
  static delete (id: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/user/delete`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 导出列表
   *
   */
  static exportList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`/{merchant}/user/list/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 详情查询
   *
   */
  static get (id: string): Promise<Response<User>> {
    return ApiClient.server().get(`/{merchant}/user/get`, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 分页查询
   *
   */
  static list (): Promise<Response<User[]>> {
    return ApiClient.server().post(`/{merchant}/user/list`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 注销
   *
   */
  static logout (): Promise<Response<string>> {
    return ApiClient.server().get(`/{merchant}/user/logout`).then((res) => {
      return res.data
    })
  }

  /**
   * 分页查询经办人
   *
   */
  static query (body: QueryParam): Promise<Response<User[]>> {
    return ApiClient.server().post(`/{merchant}/user/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 分页查询（不包括管理员）
   *
   */
  static queryEmployee (body: QueryParam): Promise<Response<User[]>> {
    return ApiClient.server().post(`/{merchant}/user/queryEmployee`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 编辑
   *
   */
  static saveModify (body: User): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/user/save/modify`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 新建
   *
   */
  static saveNew (body: User): Promise<Response<string>> {
    return ApiClient.server().post(`/{merchant}/user/save/new`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 编辑基本信息
   *
   */
  static upateBaseInfo (body: User): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/user/upateBaseInfo`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 修改密码
   *
   */
  static updatePassword (oldPassword: string, newPassword: string): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/user/update/password`, {}, {
      params: {
        oldPassword: oldPassword,
        newPassword: newPassword
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 详情查询
   *
   */
  static userInfo (): Promise<Response<User>> {
    return ApiClient.server().get(`/{merchant}/user/userInfo`).then((res) => {
      return res.data
    })
  }

  /**
   * 校验号码
   *
   * @param authCode 手机校验码
   */
  static verifyMobile (mobile: string, authCode: string): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/user/verifyMobile`, {}, {
      params: {
        mobile: mobile,
        authCode: authCode
      }
    }).then((res) => {
      return res.data
    })
  }

}
