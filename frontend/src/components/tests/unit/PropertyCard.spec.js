/* eslint-disable no-unused-vars */
import Vue from 'vue'
import Router from 'vue-router'
import Vuetify from 'vuetify'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'

import PropertyCard from '../../PropertyCard'

Vue.use(Vuetify)

describe('PropertyCard.vue', () => {
  function createWrapper () {
    return shallowMount(PropertyCard, {
      propsData: {
        property: {
          id: 'iamthepropertyid',
          title: 'testTitle',
          highlightedVicinity: 'somewhere, on the earth',
          distance: 1000
        }
      },
      stubs: {
        RouterLink: RouterLinkStub
      }
    })
  }

  it('renders property.title', async () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain(wrapper.props().property.title)
  })

  it('renders property.highlightedVicinity', async () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain(wrapper.props().property.highlightedVicinity)
  })

  it('renders property.distance in meter', async () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain(wrapper.props().property.distance / 1000)
  })

  it('renders RouterLink to correct url', async () => {
    const wrapper = createWrapper()

    expect(wrapper.find(RouterLinkStub).props().to).toBe(`/booking/${wrapper.props().property.id}`)
  })
})
