const request = require('supertest')
const app = require('../../app')

const BM = require('../../models/BookingsModel')
const UM = require('../../models/UsersModel')

const BookingClass = require('../../models/classes/Booking')

const mockBookingReqBody = {
  propertyId: 1,
  propertyName: 'First Property',
  city: 'Munich',
  username: 'Someone',
  email: 'Someone@email.com',
  checkinDate: '2019-06-10',
  checkoutDate: '2019-06-11',
  numberOfRooms: 1
}

describe('POST /api/bookings', () => {
  beforeEach(() => {
    BM.insertBooking = jest.fn(() => Promise.resolve({ data: { id: 2 } }))
    UM.insertUserIfNotExist = jest.fn(() => Promise.resolve({ id: 1, name: 'Someone', email: 'Someone@email.com' }))
  })

  it('calls insertUserIfNotExist with user data', async () => {
    await request(app).post('/api/bookings')
      .send(mockBookingReqBody)

    expect(UM.insertUserIfNotExist).toBeCalledWith({
      name: 'Someone',
      email: 'Someone@email.com'
    })
  })

  it('calls insertBooking with formatted booking data', async () => {
    const formattedBooking = new BookingClass(
      mockBookingReqBody.propertyId,
      mockBookingReqBody.propertyName,
      mockBookingReqBody.city,
      { id: 1, name: 'Someone', email: 'Someone@email.com' },
      mockBookingReqBody.checkinDate,
      mockBookingReqBody.checkoutDate,
      mockBookingReqBody.numberOfRooms
    )

    await request(app).post('/api/bookings')
      .send(mockBookingReqBody)

    expect(BM.insertBooking).toBeCalledWith(formattedBooking)
  })

  it('returns statusCode 201 and { userId, bookingId }', async () => {
    const response = await request(app).post('/api/bookings')
      .send(mockBookingReqBody)

    expect(response.statusCode).toBe(201)
    expect(response.text).toBe(JSON.stringify({ userId: 1, bookingId: 2 }))
  })
})
