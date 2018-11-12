export enum PayMethod {
  cash,
  other,
  aliPay,
  weiXin,
  qqPay,
  ffan,
  bestPay,
  bankCardPay,
  balance,
  credit,
  jdWallet,
  unionAcPay,
  scorePay,
  bill99,
  baiduWallet
}

export namespace PayMethod {
  export function name(state: PayMethod): string {
    if (state === PayMethod.cash) {
      return '现金'
    } else if (state === PayMethod.other) {
      return '其他'
    } else if (state === PayMethod.aliPay) {
      return '支付宝'
    } else if (state === PayMethod.weiXin) {
      return '微信'
    } else if (state === PayMethod.qqPay) {
      return 'QQ钱包'
    } else if (state === PayMethod.ffan) {
      return '飞凡通'
    } else if (state === PayMethod.bestPay) {
      return '翼支付'
    } else if (state === PayMethod.bankCardPay) {
      return '银行卡'
    } else if (state === PayMethod.balance) {
      return '储值支付'
    } else if (state === PayMethod.credit) {
      return '赊账'
    } else if (state === PayMethod.jdWallet) {
      return '京东钱包'
    } else if (state === PayMethod.unionAcPay) {
      return '银联支付'
    } else if (state === PayMethod.scorePay) {
      return '积分支付'
    } else if (state === PayMethod.bill99) {
      return '快钱钱包'
    } else if (state === PayMethod.baiduWallet) {
      return '百度钱包'
    }
    return ''
  }
}
