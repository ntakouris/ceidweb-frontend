import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedIn: false,
    isAdmin: false,
    userDetails: {},
    basicAuth: '',
  },
  mutations: {
    setLoggedIn(state, loggedIn, isAdmin) {
      state.loggedIn = loggedIn
      state.isAdmin = isAdmin
    },
    setUserDetails(state, userDetails) {
      state.userDetails = userDetails
    }
  },
  actions: {
  },
  modules: {
  },
});
