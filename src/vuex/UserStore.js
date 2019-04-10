export const userStore = {
  state: {
    user: {
      userid: '',
      tao11id: '',
      name: '',
      role: '',
      group: 0,
      session: '',
      token: '',
      // 自动跟踪物流开关
      tracelogisticsEnable: false,
      // 发货检查间隔时间（分钟）
      tracelogisticsInterval: 10,
      // 发货检查模式
      tracelogisticsMode: '模式1',
      defaultBuyerMessage: '',
      defaultMemoFlag: 0
    }
  },
  mutations: {
    SET_USER_STORE (state, data) {
      state.user = {
        userid: data.id,
        tao11id: data.user_id,
        name: data.name,
        role: data.role,
        group: data.group,
        session: data.session,
        token: data.token,
        tracelogisticsEnable: data.tracelogistics_enable || false,
        tracelogisticsInterval: data.tracelogistics_interval || 10,
        tracelogisticsMode: data.tracelogistics_mode || '模式1',
        defaultBuyerMessage: data.defaultbuyermessage || '',
        defaultMemoFlag: data.defaultmemoflag || 0
      }
    },
    SET_TRACE_LOGISTICS_ENABLE (state, data) {
      state.user.tracelogisticsEnable = data
    },
    SET_TRACE_LOGISTICS_MODE (state, data) {
      state.user.tracelogisticsMode = data
    },
    SET_TRACE_LOGISTICS_INTERVAL (state, data) {
      state.user.tracelogisticsInterval = data
    },
    SET_DEFAULT_BUYER_MESSAGE (state, data) {
      state.user.defaultBuyerMessage = data
    },
    SET_DEFAULT_MEMO_FLAG (state, data) {
      state.user.defaultMemoFlag = data
    }
  },
  actions: {
    setUserStore ({ commit }, data) {
      commit('SET_USER_STORE', data)
    },
    setTraceLogisticsEnable ({ commit }, data) {
      commit('SET_TRACE_LOGISTICS_ENABLE', data)
    },
    setTraceLogisticsInterval ({ commit }, data) {
      commit('SET_TRACE_LOGISTICS_INTERVAL', data)
    },
    setTraceLogisticsMode ({ commit }, data) {
      commit('SET_TRACE_LOGISTICS_MODE', data)
    },
    setDefaultBuyerMessage ({ commit }, data) {
      commit('SET_DEFAULT_BUYER_MESSAGE', data)
    },
    setDefaultMemoFlag ({ commit }, data) {
      commit('SET_DEFAULT_MEMO_FLAG', data)
    }
  },
  getters: {
    user: state => {
      return state.user
    },
    userid: state => {
      return state.user.userid
    },
    session: state => {
      return state.user.session
    },
    defaultBuyerMessage: state => {
      return state.user.defaultBuyerMessage
    },
    defaultMemoFlag: state => {
      return state.user.defaultMemoFlag
    }
  }
}
