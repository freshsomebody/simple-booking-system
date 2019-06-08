var express = require('express')
var router = express.Router()

const BookingsModel = require('../models/BookingsModel')

// Query bookings with the specific user_id
router.get('/:userId/bookings', async (req, res) => {
  try {
    const { data } = await BookingsModel.fetchBookingsByUserId(req.params.userId)

    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err.message)
  }
})

module.exports = router
