import Vue from 'vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import merge from 'lodash.merge'

import MainScreenLoading from '../../MainScreenLoading'

const localVue = createLocalVue()
localVue.use(Vuex)
Vue.use(Vuetify)

describe('MainScreenLoading.vue', () => {
  function createStore (overrides) {
    const defaultStoreConfig = {
      state: {
        isMainScreenLoading: true
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
      }
    }

    return shallowMount(MainScreenLoading, merge(defaultOption, overrides))
  }

  it('renders itself if isMainScreenLoading is true', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.MainScreenLoading').exists()).toBeTruthy()
  })

  it('renders nothing if isMainScreenLoading is false', () => {
    const store = createStore({
      state: {
        isMainScreenLoading: false
      }
    })
    const wrapper = createWrapper({ store })

    expect(wrapper.find('.MainScreenLoading').exists()).toBeFalsy()
  })
})
