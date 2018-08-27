export const orderStore = {
  state: {
    orderInfo: {
      numiid: null,
      tradeid: null,
      sellernick: null,
      tid: null,
      oid: null,
      receiver: null,
      addressAdded: false,
      buyerMessage: null
    },
    orderBought: {
      tradeid: null,
      tid: null,
      oid: null,
      num: 1,
      buyer: '',
      buyerTid: null,
      buyerOid: null,
      buyerFee: 0,
      buyUrl: '',
      buyerPostFee: 0
    }
  },
  mutations: {
    SET_ORDER_INFO (state, data) {
      state.orderInfo = data
    },
    CLEAR_ORDER_INFO (state) {
      state.orderInfo = {
        numiid: null,
        tradeid: null,
        tid: null,
        oid: null,
        receiver: null,
        addressAdded: false,
        buyerMessage: null
      }
    },
    SET_ORDER_BOUGHT (state, data) {
      state.orderBought = data
    },
    CLEAR_ORDER_BOUGHT (state) {
      state.orderBought = {
        tradeid: null,
        tid: null,
        oid: null,
        num: 1,
        buyer: '',
        buyerTid: null,
        buyerOid: null,
        buyerFee: 0,
        buyUrl: '',
        buyerPostFee: 0
      }
    },
    SET_ORDER_RECEIVER (state, data) {
      state.orderInfo.receiver = data
    },
    SET_ORDER_ADDRESS_ADDED (state, data) {
      state.orderInfo.addressAdded = data
    }
  },
  actions: {
    setOrderInfo ({ commit }, data) {
      commit('SET_ORDER_INFO', data)
    },
    clearOrderInfo ({ commit }) {
      commit('CLEAR_ORDER_INFO')
    },
    setOrderBought ({ commit }, data) {
      commit('SET_ORDER_BOUGHT', data)
    },
    clearOrderBought ({ commit }, data) {
      commit('CLEAR_ORDER_BOUGHT', data)
    },
    setOrderInfoReceiver ({ commit }, data) {
      commit('SET_ORDER_RECEIVER', data)
    },
    setOrderInfoAddressAdded ({ commit }, data) {
      commit('SET_ORDER_ADDRESS_ADDED', data)
    }
  },
  getters: {
    orderInfo: state => {
      return state.orderInfo
    },
    orderBought: state => {
      return state.orderBought
    },
    orderReceiver: state => {
      return state.orderInfo.receiver
    },
    orderAddressAdded: state => {
      return state.orderInfo.addressAdded
    }
  }
}
