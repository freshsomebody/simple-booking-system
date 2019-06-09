<template>
<v-container>
  <v-alert
    :value="errorMessage"
    type="warning"
    class="headline"
  >
    {{ errorMessage }}
  </v-alert>

  <v-timeline align-top v-if="!errorMessage">
    <v-timeline-item
      v-for="booking in bookings"
      :key="booking.id"
      :id="booking.id"
      :color="itemColors[checkBookingStatus(booking)]"
      :icon="itemIcons[checkBookingStatus(booking)]"
      fill-dot
    >
      <v-card
        :color="itemColors[checkBookingStatus(booking)]"
        dark
      >
        <v-card-title class="title">{{ booking.property_name }}</v-card-title>
        <v-card-text class="white text--primary">
          <p>
            <v-icon color="black">location_on</v-icon>
            {{ booking.city }}
          </p>
          <h3 class="mb-3">
            <v-icon color="black">calendar_today</v-icon>
            {{ booking.checkin_date }} - {{ booking.checkout_date }}
          </h3>
          <p>
            <v-icon color="black">hotel</v-icon>
            {{ booking.number_of_rooms }} room(s)
          </p>
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      userId: this.$route.params.userId,
      bookings: [],

      today: new Date(new Date().toISOString().substr(0, 10)).getTime(),
      itemColors: ['grey', 'indigo', 'green'],
      itemIcons: ['done', 'home', 'calendar_today'],

      errorMessage: false
    }
  },

  methods: {
    ...mapActions('bookings', {
      fetchBookingsByUserId: 'fetchBookingsByUserId'
    }),

    checkBookingStatus (booking) {
      const unixCheckin = this.dateToUnix(booking.checkin_date)
      const unixCheckout = this.dateToUnix(booking.checkout_date)

      if (unixCheckout <= this.today) return 0 // lived
      if (unixCheckout > this.today && unixCheckin <= this.today) return 1 // living
      if (unixCheckout > this.today && unixCheckin > this.today) return 2 // will live
    },

    dateToUnix (date) {
      return new Date(date).getTime()
    }
  },

  async created () {
    try {
      const { data } = await this.fetchBookingsByUserId(this.userId)

      this.bookings = data
      if (data.length === 0) {
        this.errorMessage = `You haven't booked any property yet!`
      }
    } catch (err) {
      this.errorMessage = 'Sorry, the service seems currently unavailabe. Please try again later.'
    }
  }
}
</script>
