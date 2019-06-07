import axios from 'axios'

export default {
  namespaced: true,

  state: {
    nearbyProperties: []
  },

  getters: {},

  actions: {
    async fetchNearbyProperties ({ commit }, currentPosition) {
      const lat = currentPosition[0]
      const lng = currentPosition[1]
      const { data } = await axios.get(`/api/properties/nearby/${lat}/${lng}`)

      commit('setNearbyProperties', data)
    },

    async fetchPropertyById ({ commit }, id) {
      return axios.get(`/api/properties/${id}`)
    }
  },

  mutations: {
    setNearbyProperties (state, properties) {
      state.nearbyProperties = properties
    }
  }
}
