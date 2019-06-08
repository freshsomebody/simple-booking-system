const axios = require('axios')

const DB = require('../constants/DB.js')

module.exports = {
  insertUserIfNotExist: async (user) => {
    // try to get the user with the name and email
    const { data } = await axios.get(`${DB.HOST}/users?name=${user.name}&email=${user.email}`)

    // if not exist => insert a new property
    if (data.length === 0) {
      const newUser = await axios.post(`${DB.HOST}/users`, user)
      const id = newUser.data.id
      return { id, ...user }
    }

    return data[0]
  }
}
