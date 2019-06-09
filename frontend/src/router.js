import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/booking/:propertyId',
      name: 'booking',
      component: () => import('./views/Booking.vue')
    },
    {
      path: '/user/:userId/bookings',
      name: 'userBookings',
      component: () => import('./views/UserBookings.vue')
    }
  ]
})
