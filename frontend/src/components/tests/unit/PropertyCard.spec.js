/* eslint-disable no-unused-vars */
import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import merge from 'lodash.merge'

import PropertyCard from '../../PropertyCard'

Vue.use(Vuetify)

describe('PropertyCard.vue', () => {
  function createWrapper (overrides) {
    const defaultOptions = {
      propsData: {
        property: {
          id: 'iamthepropertyid',
          title: 'testTitle',
          highlightedVicinity: 'somewhere, on the earth',
          distance: 9527
        },
        horizontal: false,
        showDistance: false,
        bookBtn: false
      },
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
    return shallowMount(PropertyCard, merge(defaultOptions, overrides))
  }

  it('renders property.title', async () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain(wrapper.props().property.title)
  })

  it('renders property.highlightedVicinity', async () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain(wrapper.props().property.highlightedVicinity)
  })

  it('renders property.distance in meter if prop showDistance is true', async () => {
    const wrapper = createWrapper({
      propsData: {
        showDistance: true
      }
    })

    expect(wrapper.text()).toContain(wrapper.props().property.distance / 1000)
  })

  it('does not render property.distance in meter if propsData showDistance is false', async () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).not.toContain(wrapper.props().property.distance / 1000)
  })

  it('renders RouterLink to correct url if propsData bookBtn is true', async () => {
    const wrapper = createWrapper({
      propsData: {
        bookBtn: true
      }
    })

    expect(wrapper.find(RouterLinkStub).props().to).toBe(`/booking/${wrapper.props().property.id}`)
  })

  it('does not renders RouterLinkif propsData bookBtn is false', async () => {
    const wrapper = createWrapper()

    expect(wrapper.find(RouterLinkStub).exists()).toBeFalsy()
  })
})
