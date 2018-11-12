import { Commit, ActionTree } from 'vuex'
import User from 'model/framework/user/User'
import Merchant from 'model/framework/merchant/Merchant'
import MerchantConfig from 'model/framework/merchant/MerchantConfig'
import FunctionPerm from 'model/framework/role/FunctionPerm'

// state
export interface State {
  user: Nullable<User>, // 当前用户
  merchant: Nullable<Merchant>, // 当前商户
  merchantConfig: Nullable<MerchantConfig>, // 商户配置
  permission: FunctionPerm[]
}

export const state: State = {
  user: null,
  merchant: null,
  merchantConfig: null,
  permission: []
}

/**
 * 通常不直接调用这个方法
 */
export const mutations = {
  user(state: State, user: User) {
    state.user = user
  },
  merchant(state: State, merchant: Merchant) {
    state.merchant = merchant
  },
  merchantConfig(state: State, merchantConfig: MerchantConfig) {
    state.merchantConfig = merchantConfig
  },
  permission(state: State, permission: FunctionPerm[]) {
    state.permission = permission
  },
  /**
   * 清除状态，通常在退出应用时执行
   *
   * @param {State} state
   */
  clear(state: State) {
    state.user = null
    state.merchant = null
    state.merchantConfig = null
    state.permission = []
  }
}

export const getters = {}

/**
 * 修改状态只提倡用dispatch
 */
export const actions: ActionTree<State, any> = {
  user(context: {commit: Commit}, user: User) {
    context.commit('user', user)
  },
  merchant(context: {commit: Commit}, merchant: Merchant) {
    context.commit('merchant', merchant)
  },
  merchantConfig(context: {commit: Commit}, merchantConfig: MerchantConfig) {
    context.commit('merchantConfig', merchantConfig)
  },
  permission(context: {commit: Commit}, permission: FunctionPerm[]) {
    context.commit('permission', permission)
  },
  clear(context: {commit: Commit}) {
    context.commit('clear')
  }
}

export default { state, getters, mutations, actions }
