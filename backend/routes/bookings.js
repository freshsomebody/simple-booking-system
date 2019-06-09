var express = require('express')
var router = express.Router()

const BookingsModel = require('../models/BookingsModel')
const UsersModel = require('../models/UsersModel')

const BookingClass = require('../models/classes/Booking')

// Insert a new booking
router.post('/', async (req, res) => {
  try {
    // check whether the user exists
    const user = await UsersModel.insertUserIfNotExist({
      name: req.body.username,
      email: req.body.email
    })

    let newBooking = new BookingClass(
      req.body.propertyId,
      req.body.propertyName,
      req.body.city,
      user,
      req.body.checkinDate,
      req.body.checkoutDate,
      req.body.numberOfRooms
    )
    // get nearby properties
    const booking = await BookingsModel.insertBooking(newBooking)
    const bookingId = booking.data.id

    res.status(201).json({
      userId: user.id,
      bookingId
    })
  } catch (err) {
    res.status(500).send(err.message)
  }
})

module.exports = router
