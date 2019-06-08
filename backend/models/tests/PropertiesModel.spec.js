const axios = require('axios')

const DB = require('../../constants/DB.js')
const PM = require('../PropertiesModel')

describe('PropertiesModel', () => {
  beforeEach(() => {
    axios.get = jest.fn(() => Promise.resolve({ data: [] }))
    axios.post = jest.fn(() => Promise.resolve())
  })

  it('fetchPropertyById calls axios.get with id', async () => {
    const id = 1
    await PM.fetchPropertyById(id)

    expect(axios.get.mock.calls[0][0]).toContain(`?id=${id}`)
  })

  it('insertPropertyIfNotExist calls axios.get with id', async () => {
    const mockProperty = { id: 2 }
    await PM.insertPropertyIfNotExist(mockProperty)

    expect(axios.get.mock.calls[0][0]).toContain(`?id=${mockProperty.id}`)
  })

  it('insertPropertyIfNotExist calls axios.post if the property does not exist', async () => {
    const mockProperty = { id: 3 }
    await PM.insertPropertyIfNotExist(mockProperty)

    expect(axios.post).toBeCalledWith(`${DB.HOST}/properties`, mockProperty)
  })

  it('insertPropertyIfNotExist does not call axios.post if the property exists', async () => {
    axios.get.mockImplementation(() => Promise.resolve({ data: [{ id: 4 }] }))
    await PM.insertPropertyIfNotExist({ id: 4 })

    expect(axios.post).not.toBeCalled()
  })
})
