import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import LoginResult from 'model/authen/LoginResult'
import User from 'model/framework/user/User'

export default class AuthApi {
  /**
   * 登录信息
   *
   */
  static info (): Promise<Response<LoginResult>> {
    return ApiClient.server().get(`auth/info`).then((res) => {
      return res.data
    })
  }

  /**
   * 登录信息
   *
   */
  static jwt (jwt: string, merchant: string): Promise<Response<LoginResult>> {
    return ApiClient.server().get(`auth/jwt`, {
      params: {
        jwt: jwt,
        merchant: merchant
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 登录
   *
   * @param login 手机号或登录账号
   * @param password 密码
   */
  static login (login: string, password: string): Promise<Response<LoginResult>> {
    return ApiClient.server().get(`auth/login`, {
      params: {
        login: login,
        password: password
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 登录
   *
   * @param login 手机号或登录账号
   * @param password 密码
   */
  static loginTest (login: string, password: string): Promise<Response<LoginResult>> {
    return ApiClient.server().get(`auth/loginTest`, {
      params: {
        login: login,
        password: password
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 注册
   *
   * @param authCode 手机校验码
   */
  static register (authCode: string, body: User): Promise<Response<LoginResult>> {
    return ApiClient.server().post(`auth/register`, body, {
      params: {
        authCode: authCode
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 忘记密码
   *
   * @param mobile 手机号
   * @param password 新密码
   * @param authCode 手机校验码
   */
  static resetPassword (mobile: string, password: string, authCode: string): Promise<Response<void>> {
    return ApiClient.server().post(`auth/password/reset`, {}, {
      params: {
        mobile: mobile,
        password: password,
        authCode: authCode
      }
    }).then((res) => {
      return res.data
    })
  }

}
