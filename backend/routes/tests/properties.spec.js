const request = require('supertest')
const app = require('../../app')

let axios = require('axios')
const PM = require('../../models/PropertiesModel')
const BM = require('../../models/BookingsModel')

const mockNearbyProperties = {
  results: [
    { id: 0 },
    { position: [1, 1] },
    { id: 1, position: [1, 1] },
    { id: 2, position: [2, 2] },
    { id: 3, position: [3, 3] }
  ]
}

describe('GET api/properties/nearby/:lat/:lng', () => {
  beforeEach(() => {
    axios.get = jest.fn(() => Promise.resolve({ data: mockNearbyProperties }))

    PM.fetchPropertyById = jest.fn(() => Promise.resolve({ data: [{ id: 1 }] }))
    PM.insertPropertyIfNotExist = jest.fn(() => Promise.resolve())

    BM.fetchBookingsByPropertyId = jest.fn(() => Promise.resolve({ data: [] }))
  })

  it('calls Here api with the user position', async () => {
    const lat = 20; const lng = 120

    await request(app).get(`/api/properties/nearby/${lat}/${lng}`)

    expect(axios.get.mock.calls[0][0]).toContain(`?at=${lat},${lng}`)
  })

  it('calls insertPropertyIfNotExist currect times', async () => {
    await request(app).get(`/api/properties/nearby/20/120`)

    expect(PM.insertPropertyIfNotExist).toBeCalledTimes(3)
  })

  it('returns results containing both id and position', async () => {
    const response = await request(app).get(`/api/properties/nearby/20/120`)

    expect(response.text).toBe(
      JSON.stringify([
        { id: 1, position: [1, 1] },
        { id: 2, position: [2, 2] },
        { id: 3, position: [3, 3] }
      ])
    )
  })
})

describe('GET api/properties/:propertyId', () => {
  it('calls PM.fetchPropertyById with id', async () => {
    await request(app).get('/api/properties/1')

    expect(PM.fetchPropertyById).toBeCalledWith('1')
  })

  it('returns statusCode 200 and property', async () => {
    const response = await request(app).get('/api/properties/1')

    expect(response.statusCode).toBe(200)
    expect(response.text).toBe(JSON.stringify([{ id: 1 }]))
  })

  it('returns statusCode 404 if no property is found', async () => {
    PM.fetchPropertyById = jest.fn(() => Promise.resolve({ data: [] }))
    const response = await request(app).get('/api/properties/1')

    expect(response.statusCode).toBe(404)
  })
})

describe('GET api/properties/:propertyId/bookings', () => {
  it('calls BM.fetchBookingsByPropertyId with propertyId', async () => {
    await request(app).get('/api/properties/1/bookings')

    expect(BM.fetchBookingsByPropertyId).toBeCalledWith('1')
  })

  it('returns statusCode 200 and bookings', async () => {
    const mockRes = [1, 2, 3]
    BM.fetchBookingsByPropertyId = jest.fn(() => Promise.resolve({ data: mockRes }))
    const response = await request(app).get('/api/properties/1/bookings')

    expect(response.statusCode).toBe(200)
    expect(response.text).toBe(JSON.stringify(mockRes))
  })
})
