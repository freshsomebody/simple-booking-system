import axios from 'axios'

export default {
  namespaced: true,

  state: {},

  getters: {},

  actions: {
    createNewBooking (store, bookingInfo) {
      return axios.post(`/api/bookings`, bookingInfo)
    }
  },

  mutations: {}
}
