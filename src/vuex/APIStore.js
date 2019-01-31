let host = '192.168.99.1:3000'
host = 'localhost:3000'
host = 'read-trade.wgkyz.com'
// host = 'apibus.tao11.la'
const initAPIData = {
  token: '',
  // apiUrl: 'http://zhuzhu777.com:2999/r/zztAuth/Login/',
  // apiHost: '//' + window.location.host + '/r/',
  apiHost: 'http://' + host + '/api/',
  // apiHost: 'http://localhost:2999/r/',
  apiService: '',
  apiAction: '',
  apiQuery: {},
  apiLastResponse: {}
}

export const apiStore = {
  state: {
    token: '',
    apiHost: 'http://localhost/api',
    apiService: '',
    apiAction: '',
    apiQuery: {},
    apiLastResponse: {}
  },
  mutations: {
    SET_API_HOST (state, data) {
      state.apiHost = data
    },
    SET_API_SERVICE (state, data) {
      state.apiService = data
    },
    SET_API_ACTION (state, data) {
      state.apiAction = data
    },
    SET_API_QUERY (state, data) {
      state.apiQuery = data
    },
    SET_API_LAST_RESPONSE (state, data) {
      state.apiLastResponse = data
    },
    SET_API_URL (state, data) {
      // host不为空时更新
      if (data.apiHost) state.apiHost = data.apiHost
      state.apiService = data.apiService
      state.apiAction = data.apiAction
      state.apiQuery = data.apiQuery
      state.apiLastResponse = data.apiLastResponse
    },
    SET_TOKEN (state, token) {
      state.token = token
    }
  },
  actions: {
    setAPIStore ({ commit }, data) {
      // 重置apiState
      commit('SET_API_URL', initAPIData)
      commit('SET_API_URL', data)
    },
    setAPIService ({ commit }, data) {
      commit('SET_API_SERVICE', data)
    },
    setAPIAction ({ commit }, data) {
      commit('SET_API_ACTION', data)
    },
    setAPIQuery ({ commit }, data) {
      commit('SET_API_QUERY', data)
    },
    setAPILastResponse ({ commit }, data) {
      commit('SET_API_LAST_RESPONSE', data)
    },
    setToken ({ commit }, token) {
      commit('SET_TOKEN', token)
    }
  },
  getters: {
    apiUrl: state => {
      var queryString = ''
      if (state.apiQuery) {
        queryString = '?'
        for (var key in state.apiQuery) {
          queryString += key
          queryString += '='
          queryString += state.apiQuery[key]
          queryString += '&'
        }
        queryString = queryString.substring(0, queryString.length - 1)
      }
      return state.apiHost + state.apiService + '/' + state.apiAction + queryString
    },
    apiLastResponse: state => {
      return state.apiLastResponse
    },
    token: state => {
      return state.token
    }
  }
}
