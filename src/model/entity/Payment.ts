export enum Payment {
  ONLINE = 'ONLINE',
  CASH = 'CASH',
  BANKCARDPAY = 'BANKCARDPAY',
  BALANCE = 'BALANCE',
  CREDIT = 'CREDIT',
  ORDERPAY = 'ORDERPAY',
  OTHER = 'OTHER',
  POINTS = 'POINTS',

  ALIPAY = 'ALIPAY',
  WEIXIN = 'WEIXIN',
  BESTPAY = 'BESTPAY',
  QQPAY = 'QQPAY',
  UNIONACPAY = 'UNIONACPAY',
  FFAN = 'FFAN',
  JDWALLET = 'JDWALLET'
}

export namespace PayMethod {
  export function name(state: Payment): string {
    if (state === Payment.ONLINE) {
      return '扫码支付'
    } else if (state === Payment.CASH) {
      return '现金'
    } else if (state === Payment.BANKCARDPAY) {
      return '银行卡'
    } else if (state === Payment.BALANCE) {
      return '储值支付'
    } else if (state === Payment.CREDIT) {
      return '赊账'
    } else if (state === Payment.ORDERPAY) {
      return '订单支付'
    } else if (state === Payment.OTHER) {
      return '其他'
    } else if (state === Payment.POINTS) {
      return '积分支付'
    } else if (state === Payment.ALIPAY) {
      return '支付宝'
    } else if (state === Payment.WEIXIN) {
      return '微信'
    } else if (state === Payment.BESTPAY) {
      return '翼支付'
    } else if (state === Payment.QQPAY) {
      return 'QQ钱包'
    } else if (state === Payment.UNIONACPAY) {
      return '银联支付'
    } else if (state === Payment.FFAN) {
      return '飞凡通'
    } else if (state === Payment.JDWALLET) {
      return '京东支付'
    }
    return ''
  }
}
