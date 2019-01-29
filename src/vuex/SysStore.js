import common from '../../static/common'
export const sysStore = {
  state: {
    sysConfigs: {
      localUrl: '',
      isExtension: true
    },
    tbCookies: []
  },
  mutations: {
    SET_SYS_STORE (state, data) {
      state.sysConfigs = Object.assign(state.sysConfigs, data)
    },
    SET_SYS_LOCAL_URL (state, data) {
      state.sysConfigs.localUrl = data
    },
    SET_SYS_ISEXTENSION (state, data) {
      state.sysConfigs.isExtension = data
    },
    SET_TBCOOKIES (state, data) {
      state.tbCookies = data
    }
  },
  actions: {
    setSysStore ({ commit }, data) {
      commit('SET_SYS_STORE', data)
    },
    setSysLocalUrl ({ commit }, data) {
      commit('SET_SYS_LOCAL_URL', data)
    },
    setSysIsExtension ({ commit }, data) {
      commit('SET_SYS_ISEXTENSION', data)
    },
    setTBCookies ({ commit }, data) {
      commit('SET_TBCOOKIES', data)
    }
  },
  getters: {
    sysConfigs: state => {
      return state.sysConfigs
    },
    sysLocalUrl: state => {
      return state.sysConfigs.localUrl
    },
    sysIsExtension: state => {
      return state.sysConfigs.isExtension
    },
    tbCookies: state => {
      return state.tbCookies
    },
    tbNick: state => {
      try {
        let tracknick = state.tbCookies.filter((item) => {
          return item.name === 'tracknick'
        })[0]
        return common.decodeUnicode(decodeURI(tracknick.value))
      } catch (err) {
        return ''
      }
    }
  }
}
