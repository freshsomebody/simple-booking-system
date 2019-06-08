const axios = require('axios')

const DB = require('../../constants/DB.js')
const BM = require('../BookingsModel')

describe('BookingsModel', () => {
  beforeEach(() => {
    axios.post = jest.fn(() => Promise.resolve())
  })

  it('insertBooking calls axios.post with booking data', async () => {
    const mockBookingData = { property_id: 1 }
    await BM.insertBooking(mockBookingData)

    expect(axios.post).toBeCalledWith(`${DB.HOST}/bookings`, mockBookingData)
  })
})
