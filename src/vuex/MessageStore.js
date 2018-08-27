export const messageStore = {
  state: {
    newMessages: []
  },
  mutations: {
    SET_MESSAGE_STORE (state, data) {
      state.newMessages = data
    },
    SET_MESSAGE_READ (state, data) {
      let msg = state.newMessages.filter((item) => {
        return item.Id === data
      })[0]
      if (msg) {
        let idx = state.newMessages.indexOf(msg)
        state.newMessages.splice(idx, 1)
      }
    }
  },
  actions: {
    setMessageStore ({ commit }, data) {
      commit('SET_MESSAGE_STORE', data)
    },
    setMessageRead ({ commit }, data) {
      commit('SET_MESSAGE_READ', data.Id)
    }
  },
  getters: {
    newMessages: state => {
      return state.newMessages
    }
  }
}
