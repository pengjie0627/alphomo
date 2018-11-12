export default class Auth2Api {

  /**
   * 第三方登录。
   *
   * @param login 类型。取值有vipmro
   */
  static onToAuthorize(type: string): string {
    return '/auth/login/leadToAuthorize?type=' + type
  }
}
