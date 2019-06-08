const request = require('supertest')
const app = require('../../app')

const BM = require('../../models/BookingsModel')

describe('GET api/usres/:userId/bookings', () => {
  beforeEach(() => {
    BM.fetchBookingsByUserId = jest.fn(() => Promise.resolve({ data: [1, 2, 3] }))
  })

  it('calls BM.fetchBookingsByUserId with userId', async () => {
    await request(app).get('/api/users/1/bookings')

    expect(BM.fetchBookingsByUserId).toBeCalledWith('1')
  })

  it('returns statusCode 200 and bookings', async () => {
    const mockRes = [1, 2, 3]
    BM.fetchBookingsByUserId = jest.fn(() => Promise.resolve({ data: mockRes }))
    const response = await request(app).get('/api/users/1/bookings')

    expect(response.statusCode).toBe(200)
    expect(response.text).toBe(JSON.stringify(mockRes))
  })
})
