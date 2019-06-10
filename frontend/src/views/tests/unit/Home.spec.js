/* eslint-disable prefer-promise-reject-errors */
import Vue from 'vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import flushPromises from 'flush-promises'
import merge from 'lodash.merge'

import Home from '../../Home'
import PropertyCard from '../../../components/PropertyCard'

const localVue = createLocalVue()
localVue.use(Vuex)
Vue.use(Vuetify)

describe('Home.vue', () => {
  function createStore (overrides) {
    const defaultStoreConfig = {
      modules: {
        properties: {
          state: {
            nearbyProperties: [{ distance: 2 }, { distance: 3 }, { distance: 1 }]
          },
          actions: {
            fetchNearbyProperties: jest.fn(() => Promise.resolve())
          }
        }
      }
    }
    return new Vuex.Store(
      merge(defaultStoreConfig, overrides)
    )
  }

  function createWrapper (overrides) {
    const defaultOption = {
      localVue,
      store: createStore(),
      stubs: {
        VProgressCircular: { template: '<div class="VProgressCircular" />' }
      },
      methods: {
        setIsMainScreenLoading: jest.fn(),
        getCurrentPosition: jest.fn(() => Promise.resolve([20, 120])),
        fetchNearbyProperties: jest.fn(() => Promise.reject({ data: [] }))
      }
    }

    return shallowMount(Home, merge(defaultOption, overrides))
  }

  it('displays error alert if getCurrentPosition failed', async () => {
    const VLayoutStub = { template: '<div class="VLayout" />' }
    const wrapper = createWrapper({
      methods: {
        getCurrentPosition: jest.fn(() => Promise.reject({ message: 'Cannot get the user location.' }))
      },
      stubs: {
        VLayout: VLayoutStub
      }
    })

    await flushPromises()

    expect(wrapper.vm.errorMessage).toBeTruthy()
    expect(wrapper.find('.VLayout').exists()).toBeFalsy()
  })

  it('displays error alert if fetchNearbyProperties failed', async () => {
    const VLayoutStub = { template: '<div class="VLayout" />' }
    const wrapper = createWrapper({
      methods: {
        fetchNearbyProperties: jest.fn(() => Promise.reject({ message: 'Failed to ftech properties' }))
      },
      stubs: {
        VLayout: VLayoutStub
      }
    })

    await flushPromises()

    expect(wrapper.vm.errorMessage).toBeTruthy()
    expect(wrapper.find('.VLayout').exists()).toBeFalsy()
  })

  it('calls fetchNearbyProperties to fetch nearby properties', async () => {
    const mockFetchNearbyProperties = jest.fn(() => Promise.resolve())

    createWrapper({
      methods: {
        fetchNearbyProperties: mockFetchNearbyProperties
      }
    })

    await flushPromises()

    expect(mockFetchNearbyProperties).toBeCalledWith([20, 120])
  })

  it('sorts nearby properties by distance', () => {
    const wrapper = createWrapper({
      methods: {
        fetchNearbyProperties: jest.fn(() => Promise.reject({ data: [{ distance: 2 }, { distance: 3 }, { distance: 1 }] }))
      }
    })

    expect(wrapper.vm.sortedNearbyProperties).toEqual([{ distance: 1 }, { distance: 2 }, { distance: 3 }])
  })

  it('renders the correct number of PropertyCard', () => {
    const wrapper = createWrapper({
      computed: {
        sortedNearbyProperties: () => [{}, {}, {}]
      }
    })

    const cards = wrapper.findAll(PropertyCard)
    expect(cards).toHaveLength(3)
  })
})
