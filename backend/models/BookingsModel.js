const axios = require('axios')

const DB = require('../constants/DB.js')

module.exports = {
  fetchBookingsByPropertyId: (propertyId) => {
    return axios.get(`${DB.HOST}/bookings?property_id=${propertyId}`)
  },

  fetchBookingsByUserId: (userId) => {
    return axios.get(`${DB.HOST}/bookings?user.id=${userId}&_sort=checkin_date,checkout_date&_order=desc`)
  },

  insertBooking: (booking) => {
    return axios.post(`${DB.HOST}/bookings`, booking)
  }
}
