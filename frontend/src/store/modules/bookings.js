import axios from 'axios'

export default {
  namespaced: true,

  state: {},

  getters: {},

  actions: {
    fetchBookingsByUserId (store, userId) {
      return axios.get(`/api/users/${userId}/bookings`)
    },

    createNewBooking (store, bookingInfo) {
      return axios.post(`/api/bookings`, bookingInfo)
    }
  },

  mutations: {}
}
