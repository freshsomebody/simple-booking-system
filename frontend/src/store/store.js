import Vue from 'vue'
import Vuex from 'vuex'

// import modules
import properties from './modules/properties'
import bookings from './modules/bookings'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    properties,
    bookings
  },

  state: {
    isMainScreenLoading: false
  },

  actions: {},

  mutations: {
    setIsMainScreenLoading (state, bool) {
      state.isMainScreenLoading = bool
    }
  }
})
