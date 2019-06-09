/* eslint-disable prefer-promise-reject-errors */
import Vue from 'vue'
import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import flushPromises from 'flush-promises'
import merge from 'lodash.merge'

import Booking from '../../Booking'
import PropertyCard from '../../../components/PropertyCard'

const localVue = createLocalVue()
localVue.use(Vuex)
Vue.use(Vuetify)

describe('Booking.vue', () => {
  const id = 'itsapropertyid'
  const title = 'p1'
  const highlightedVicinity = 'Somewhere in, Munich'

  const VAlertStub = { template: '<div class="VAlert" />' }
  const VDatePickerStub = { template: '<input class="VDatePicker" />' }
  const VSelectStub = { template: '<select />' }
  const VTextFieldStub = { template: '<input class="VTextField" />' }
  const VBtnStub = { template: '<button />' }
  const mockPropertyRes = {
    data: [{
      id,
      title,
      highlightedVicinity
    }]
  }

  const mockFetchPropertyById = jest.fn(() => Promise.resolve(mockPropertyRes))
  const mockCreateNewBooking = jest.fn()

  const store = new Vuex.Store({
    modeuls: {
      properties: {
        namespaced: true,
        actions: {
          fetchPropertyById: jest.fn(() => Promise.resolve(mockPropertyRes))
        }
      },
      bookings: {
        namespaced: true,
        actions: {
          createNewBooking: jest.fn(() => Promise.resolve())
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
            propertyId: id
          }
        }
      },
      stubs: {
        VAlert: VAlertStub,
        RouterLink: RouterLinkStub,
        VDatePicker: VDatePickerStub,
        VSelect: VSelectStub,
        VTextField: VTextFieldStub,
        VBtn: VBtnStub
      },
      methods: {
        fetchPropertyById: mockFetchPropertyById,
        createNewBooking: mockCreateNewBooking
      }
    }

    return shallowMount(Booking, merge(defaultOption, overrides))
  }

  it('calls fetchPropertyById with $route.parms.propertyId', async () => {
    createWrapper()
    await flushPromises()

    expect(mockFetchPropertyById).toBeCalledWith(id)
  })

  it('sets property, propertyName and city onload', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const propertyData = mockPropertyRes.data[0]
    expect(wrapper.vm.property).toEqual(propertyData)
    expect(wrapper.vm.bookingInfo.propertyName).toBe(propertyData.title)
    expect(wrapper.vm.bookingInfo.city).toBe('Munich')
  })

  it('displays error alert if it failed to fetch the property', async () => {
    const VLayoutStub = { template: '<div class="VLayout" />' }
    const wrapper = createWrapper({
      methods: {
        fetchPropertyById: jest.fn(() => Promise.reject({ response: { status: 404 } }))
      },
      stubs: {
        VLayout: VLayoutStub
      }
    })

    await flushPromises()

    expect(wrapper.vm.fetchError).toBeTruthy()
    expect(wrapper.find('.VLayout').exists()).toBeFalsy()
  })

  it('does not displays error alert if it fetch the property successfully', async () => {
    const VLayoutStub = { template: '<div class="VLayout" />' }
    const wrapper = createWrapper({
      stubs: {
        VLayout: VLayoutStub
      }
    })

    await flushPromises()

    expect(wrapper.vm.fetchError).toBeFalsy()
    expect(wrapper.find('.VLayout').exists()).toBeTruthy()
  })

  it('renders PropertyCard with property data', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const cardWrapper = wrapper.find(PropertyCard)
    expect(cardWrapper.exists()).toBeTruthy()
    expect(cardWrapper.props().property).toEqual(mockPropertyRes.data[0])
  })

  it('renders 2 VDatePicker for selecting checkin and checkout dates', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.findAll(VDatePickerStub)).toHaveLength(2)
  })

  it('renders 1 VSelect for selecting number of rooms', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.findAll(VSelectStub)).toHaveLength(1)
  })

  it('renders 2 VTextField for inputting username and email', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.findAll(VTextFieldStub)).toHaveLength(2)
  })

  it('the min of checkoutDate is checkinDate + 1', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    let datePickers = wrapper.findAll(VDatePickerStub)
    let checkinPicker = datePickers.at(0)
    let checkoutPicker = datePickers.at(1)

    checkinPicker.vm.$emit('input', '9999-06-30')
    expect(checkoutPicker.element.min).toBe('9999-07-01')

    checkinPicker.vm.$emit('input', '9998-12-31')
    expect(checkoutPicker.element.min).toBe('9999-01-01')
  })

  it('sets checkoutDate to checkinDate + 1 if checkoutDate was smaller than checkinDate', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    let datePickers = wrapper.findAll(VDatePickerStub)
    let checkinPicker = datePickers.at(0)
    let checkoutPicker = datePickers.at(1)
    // set checkinDate to be bigger than checkOutDate
    checkoutPicker.vm.$emit('input', '9999-12-29')
    checkinPicker.vm.$emit('input', '9999-12-30')

    console.log(checkoutPicker.element.value)

    expect(checkoutPicker.element.value).toBe('9999-12-31')
  })

  it('returns currect total according to pricePerNight, checkinDate, checkoutDate and numberOfRooms', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.pricePerNight = 10

    let datePickers = wrapper.findAll(VDatePickerStub)
    let checkinPicker = datePickers.at(0)
    let checkoutPicker = datePickers.at(1)
    // set checkinDate and checkOutDate
    checkinPicker.vm.$emit('input', '9999-12-29')
    checkoutPicker.vm.$emit('input', '9999-12-31')
    // set numberOfRooms
    wrapper.find(VSelectStub).vm.$emit('input', '2')

    expect(wrapper.vm.total).toBe(40)
  })

  it('prevents the booking submission and shows error messages if the form is not valid', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const mockValidate = jest.fn()
    wrapper.vm.$refs.form.validate = mockValidate

    wrapper.find(VTextFieldStub).vm.$emit('input', '')

    wrapper.findAll(VBtnStub).at(0).vm.$emit('click')

    // has done validation
    expect(mockValidate).toBeCalled()
    // has error messages
    expect(wrapper.vm.errorMessages.length).toBeGreaterThan(0)
    // submit action is not called
    expect(mockCreateNewBooking).not.toBeCalled()
  })

  it('calls createNewBooking with bookingInfo when the submit button is clicked', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.$refs.form.validate = jest.fn(() => true)

    const expectedInfo = {
      propertyId: id,
      propertyName: title,
      city: 'Munich',
      checkinDate: '9999-12-29',
      checkoutDate: '9999-12-31',
      numberOfRooms: 2,
      username: 'someone',
      email: 'test@email.com'
    }

    // set all data in the form
    let datePickers = wrapper.findAll(VDatePickerStub)
    let checkinPicker = datePickers.at(0)
    let checkoutPicker = datePickers.at(1)
    // set checkinDate and checkOutDate
    checkinPicker.vm.$emit('input', expectedInfo.checkinDate)
    checkoutPicker.vm.$emit('input', expectedInfo.checkoutDate)

    wrapper.find(VSelectStub).vm.$emit('input', expectedInfo.numberOfRooms)
    wrapper.findAll(VTextFieldStub).at(0).vm.$emit('input', expectedInfo.username)
    wrapper.findAll(VTextFieldStub).at(1).vm.$emit('input', expectedInfo.email)

    expect(wrapper.vm.bookingInfo).toEqual(expectedInfo)

    wrapper.findAll(VBtnStub).at(0).vm.$emit('click')
    expect(wrapper.vm.errorMessages).toHaveLength(0)
    expect(mockCreateNewBooking).toBeCalledWith(expectedInfo)
  })
})
