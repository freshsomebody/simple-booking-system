const request = require('supertest')
const app = require('../../app')

let axios = require('axios')

const mockNearbyProperties = {
  results: [
    { id: 0 },
    { position: [1, 1] },
    { id: 1, position: [1, 1] },
    { id: 2, position: [2, 2] },
    { id: 3, position: [3, 3] }
  ]
}
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: mockNearbyProperties }))
}))

describe('GET /properties/nearby/:lat/:lng', () => {
  it('calls Here api with the user position', async () => {
    const lat = 20; const lng = 120

    await request(app).get(`/api/properties/nearby/${lat}/${lng}`)

    expect(axios.get.mock.calls[0][0]).toContain(`?at=${lat},${lng}`)
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
