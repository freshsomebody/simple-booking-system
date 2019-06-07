import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import propertiesModule from '../../modules/properties'

import axios from 'axios'
import cloneDeep from 'lodash.clonedeep'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(Vuex)

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] }))
}))

describe('Store Modules properties.js', () => {
  let store

  beforeEach(() => {
    const cloneDeepModule = cloneDeep(propertiesModule)
    store = new Vuex.Store({
      modules: {
        properties: cloneDeepModule
      }
    })
  })

  it('updates "nearbyProperties" state when "fetchNearbyProperties" is dispatched', async () => {
    expect.assertions(2)
    const mockResData = [{}, {}, {}]
    axios.get.mockImplementation(() => Promise.resolve({ data: mockResData }))

    expect(store.state.properties.nearbyProperties).toEqual([])
    store.dispatch('properties/fetchNearbyProperties', [20, 120])
    await flushPromises()
    expect(store.state.properties.nearbyProperties).toEqual(mockResData)
  })
})
