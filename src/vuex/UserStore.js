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
      tracelogisticsEnable: false
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
        tracelogisticsEnable: data.tracelogistics_enable || false
      }
    },
    SET_TRACE_LOGISTICS_ENABLE (state, data) {
      state.user.tracelogisticsEnable = data
    }
  },
  actions: {
    setUserStore ({ commit }, data) {
      commit('SET_USER_STORE', data)
    },
    setTraceLogisticsEnable ({ commit }, data) {
      commit('SET_TRACE_LOGISTICS_ENABLE', data)
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
    }
  }
}
