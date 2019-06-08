const axios = require('axios')

const DB = require('../constants/DB.js')

module.exports = {
  fetchPropertyById: (id) => {
    return axios.get(`${DB.HOST}/properties?id=${id}`)
  },

  insertPropertyIfNotExist: async (property) => {
    // try to get the property with the same id
    const { data } = await axios.get(`${DB.HOST}/properties?id=${property.id}`)

    // if not exist => insert a new property
    if (data.length === 0) {
      await axios.post(`${DB.HOST}/properties`, property)
    }

    return data
  }
}
