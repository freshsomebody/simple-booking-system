const axios = require('axios')

const DB = require('../../constants/DB.js')
const US = require('../UsersModel')

const mockUser = {
  name: 'Someone',
  email: 'Someone@email.com'
}

describe('UsersModel', () => {
  beforeEach(() => {
    axios.get = jest.fn(() => Promise.resolve({ data: [] }))
    axios.post = jest.fn(() => Promise.resolve({ data: {id: 1} }))
  })

  it('insertUserIfNotExist calls axios.get with id', async () => {
    const user = await US.insertUserIfNotExist(mockUser)

    expect(axios.get.mock.calls[0][0]).toContain(`?name=${mockUser.name}&email=${mockUser.email}`)
    expect(user).toEqual({
      id: 1,
      name: 'Someone',
      email: 'Someone@email.com'
    })
  })

  it('insertUserIfNotExist calls axios.post if the user does not exist', async () => {
    await US.insertUserIfNotExist(mockUser)

    expect(axios.post).toBeCalledWith(`${DB.HOST}/users`, mockUser)
  })

  it('insertUserIfNotExist does not call axios.post if the user exists', async () => {
    axios.get.mockImplementation(() => Promise.resolve({ data: [{ id: 3 }] }))
    const user = await US.insertUserIfNotExist({ id: 3 })

    expect(axios.post).not.toBeCalled()
    expect(user).toEqual({ id: 3 })
  })
})
