export enum PayScene {
  online,
  cardTran
}

export namespace PayScene {
  export function name(state: PayScene) {
    if (state === PayScene.online) {
      return '移动支付'
    } else if (state === PayScene.cardTran) {
      return '台卡支付'
    }
  }
}
