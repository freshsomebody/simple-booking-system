const axios = require('axios')

const DB = require('../../constants/DB.js')
const BM = require('../BookingsModel')

describe('BookingsModel', () => {
  beforeEach(() => {
    axios.get = jest.fn(() => Promise.resolve())
    axios.post = jest.fn(() => Promise.resolve())
  })

  it('fetchBookingsByPropertyId calls axios.get with propertyId', async () => {
    const propertyId = 1
    await BM.fetchBookingsByPropertyId(propertyId)

    expect(axios.get.mock.calls[0][0]).toContain(`?property_id=${propertyId}`)
  })

  it('fetchBookingsByUserId calls axios.get with userId', async () => {
    const userId = 1
    await BM.fetchBookingsByUserId(userId)

    expect(axios.get.mock.calls[0][0]).toContain(`?user.id=${userId}`)
  })

  it('insertBooking calls axios.post with booking data', async () => {
    const mockBookingData = { property_id: 1 }
    await BM.insertBooking(mockBookingData)

    expect(axios.post).toBeCalledWith(`${DB.HOST}/bookings`, mockBookingData)
  })
})
