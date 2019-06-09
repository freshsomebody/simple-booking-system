/* eslint-disable prefer-promise-reject-errors */
import Vue from 'vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import flushPromises from 'flush-promises'
import merge from 'lodash.merge'

import UserBookings from '../../UserBookings'

const localVue = createLocalVue()
localVue.use(Vuex)
Vue.use(Vuetify)

describe('Booking.vue', () => {
  const userId = 1
  const mockBookings = [
    {
      'property_id': 'p1',
      'property_name': 'hotel1',
      'city': 'Nunich',
      'user': {
        'name': 'Someone',
        'email': 'someone@mail',
        'id': 1
      },
      'checkin_date': '2019-06-12',
      'checkout_date': '2019-06-15',
      'number_of_rooms': 1,
      'id': 1
    },
    {
      'property_id': 'p2',
      'property_name': 'hotel2',
      'city': 'Nunich',
      'user': {
        'name': 'Someone',
        'email': 'someone@mail',
        'id': 1
      },
      'checkin_date': '2019-06-11',
      'checkout_date': '2019-06-12',
      'number_of_rooms': 1,
      'id': 2
    }
  ]

  const mockReturnBookings = jest.fn(() => Promise.resolve({ data: mockBookings }))

  const store = new Vuex.Store({
    modeuls: {
      bookings: {
        namespaced: true,
        actions: {
          fetchBookingsByUserId: mockReturnBookings
        }
      }
    }
  })

  function createWrapper (overrides) {
    const defaultOption = {
      localVue,
      store,
      mocks: {
        $route: {
          params: {
            userId: userId
          }
        }
      },
      methods: {
        fetchBookingsByUserId: mockReturnBookings
      }
    }

    return shallowMount(UserBookings, merge(defaultOption, overrides))
  }

  it('calls fetchBookingsByUserId to fetch bookings', async () => {
    createWrapper()
    await flushPromises()

    expect(mockReturnBookings).toBeCalledWith(userId)
  })

  it('displays error alert if it failed to fetch the bookings', async () => {
    const VLayoutStub = { template: '<div class="VLayout" />' }
    const wrapper = createWrapper({
      methods: {
        fetchBookingsByUserId: jest.fn(() => Promise.reject({ response: { status: 404 } }))
      },
      stubs: {
        VLayout: VLayoutStub
      }
    })

    await flushPromises()

    expect(wrapper.vm.errorMessage).toBeTruthy()
    expect(wrapper.find('.VLayout').exists()).toBeFalsy()
  })

  it('displays correct number of v-timeline-item', async () => {
    const wrapper = createWrapper({
      stubs: {
        VTimelineItem: { template: '<div class="VTimelineItem" />' }
      }
    })
    await flushPromises()

    expect(wrapper.findAll('.VTimelineItem')).toHaveLength(mockBookings.length)
  })

  it('renders correct color of v-timeline-item if the booking was lived', async () => {
    const wrapper = createWrapper({
      data () {
        return {
          today: new Date('2019-06-15').getTime(),
          itemColors: ['grey', 'indigo', 'green']
        }
      },
      stubs: {
        VTimelineItem: { template: '<div class="VTimelineItem" />' }
      }
    })
    await flushPromises()

    const itemWrapperAttribute = wrapper.find('.VTimelineItem').attributes()
    expect(itemWrapperAttribute.color).toBe(wrapper.vm.itemColors[0])
  })

  it('renders correct color of v-timeline-item if the booking is living', async () => {
    const wrapper = createWrapper({
      data () {
        return {
          today: new Date('2019-06-13').getTime(),
          itemColors: ['grey', 'indigo', 'green']
        }
      },
      stubs: {
        VTimelineItem: { template: '<div class="VTimelineItem" />' }
      }
    })
    await flushPromises()

    const itemWrapperAttribute = wrapper.find('.VTimelineItem').attributes()
    expect(itemWrapperAttribute.color).toBe(wrapper.vm.itemColors[1])
  })

  it('renders correct color of v-timeline-item if the booking will be lived', async () => {
    const wrapper = createWrapper({
      data () {
        return {
          today: new Date('2019-06-10').getTime(),
          itemColors: ['grey', 'indigo', 'green']
        }
      },
      stubs: {
        VTimelineItem: { template: '<div class="VTimelineItem" />' }
      }
    })
    await flushPromises()

    const itemWrapperAttribute = wrapper.find('.VTimelineItem').attributes()
    expect(itemWrapperAttribute.color).toBe(wrapper.vm.itemColors[2])
  })
})
