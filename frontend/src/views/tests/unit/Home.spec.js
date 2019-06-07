/* eslint-disable no-unused-vars */
import Vue from 'vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import flushPromises from 'flush-promises'

import Home from '../../Home'
import PropertyCard from '../../../components/PropertyCard'

const localVue = createLocalVue()
localVue.use(Vuex)
Vue.use(Vuetify)

describe('Home.vue', () => {
  let state
  let actions
  let store

  beforeEach(() => {
    state = {
      nearbyProperties: [{ distance: 2 }, { distance: 3 }, { distance: 1 }]
    }
    actions = {
      fetchNearbyProperties: jest.fn(() => Promise.resolve())
    }

    store = new Vuex.Store({
      modules: {
        properties: {
          namespaced: true,
          state,
          actions
        }
      }
    })
  })

  it('calls fetchNearbyProperties to fetch nearby properties', async () => {
    const mockFetchNearbyProperties = jest.fn(() => Promise.resolve())

    const wrapper = shallowMount(Home, {
      localVue,
      store,
      methods: {
        getCurrentPosition: jest.fn(() => Promise.resolve([20, 120])),
        fetchNearbyProperties: mockFetchNearbyProperties
      }
    })

    await flushPromises()

    expect(mockFetchNearbyProperties).toBeCalledWith([20, 120])
  })

  it('sorts nearby properties by distance', () => {
    const wrapper = shallowMount(Home, {
      localVue,
      store
    })

    expect(wrapper.vm.sortedNearbyProperties).toEqual([{ distance: 1 }, { distance: 2 }, { distance: 3 }])
  })

  it('renders the correct number of PropertyCard', () => {
    const wrapper = shallowMount(Home, {
      localVue,
      computed: {
        sortedNearbyProperties: () => [{}, {}, {}]
      }
    })

    const cards = wrapper.findAll(PropertyCard)
    expect(cards).toHaveLength(3)
  })
})