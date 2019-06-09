import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import bookingsModule from '../../modules/bookings'

import axios from 'axios'
import cloneDeep from 'lodash.clonedeep'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(Vuex)

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: [] }))
}))

describe('Store Modules properties.js', () => {
  let store

  beforeEach(() => {
    const cloneDeepModule = cloneDeep(bookingsModule)
    store = new Vuex.Store({
      modules: {
        bookings: cloneDeepModule
      }
    })
  })

  it('calls axios.get when "fetchBookingsByUserId" is dispatched', async () => {
    const mockUserId = 1
    store.dispatch('bookings/fetchBookingsByUserId', mockUserId)
    await flushPromises()

    expect(axios.get).toBeCalled()
  })

  it('calls axios.post when "createNewBooking" is dispatched', async () => {
    const mockBookingInfo = { propertyName: 'p1' }
    store.dispatch('bookings/createNewBooking', mockBookingInfo)
    await flushPromises()

    expect(axios.post.mock.calls[0][1]).toEqual(mockBookingInfo)
  })
})
