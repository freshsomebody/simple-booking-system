const axios = require('axios')

const DB = require('../constants/DB.js')

module.exports = {
  insertBooking: (booking) => {
    return axios.post(`${DB.HOST}/bookings`, booking)
  }
}
