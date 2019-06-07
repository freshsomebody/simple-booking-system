var express = require('express')
var router = express.Router()
const axios = require('axios')

const HERE = require('../constants/HERE.js')
const DB = require('../constants/DB.js')

// Query the near by properties
router.get('/nearby/:latitude/:longitude', async (req, res) => {
  const { latitude, longitude } = req.params

  try {
    // get nearby properties
    const { data } = await axios.get(`https://places.cit.api.here.com/places/v1/autosuggest?at=${latitude},${longitude}&q=hotel&app_id=${HERE.APPID}&app_code=${HERE.APPCODE}`)

    // filter out those properties without id and position
    const properties = data.results.filter(property => property.id && property.position)

    // insert new properties if not exist
    // ** only for demo purpose **
    for (const property of properties) {
      await insertPropertyIfNotExist(property)
    }

    res.status(200).json(properties)
  } catch (err) {
    res.status(500).send(err.message)
  }
})

// Query a property by id
router.get('/:id', async (req, res) => {
  try {
    const { data } = await axios.get(`${DB.HOST}/properties?id=${req.params.id}`)

    if (data.length !== 0) res.status(200).json(data)
    else res.status(404).send('Cannot find this property')
  } catch (err) {
    res.status(500).send(err.message)
  }
})

const insertPropertyIfNotExist = async (property) => {
  // try to get the property with the same id
  const ifExist = await axios.get(`${DB.HOST}/properties?id=${property.id}`)

  // if not exist => insert a new property
  if (ifExist.data.length === 0) {
    await axios.post(`${DB.HOST}/properties`, property)
  }
}

module.exports = router
