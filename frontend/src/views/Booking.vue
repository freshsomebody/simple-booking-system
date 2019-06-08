<template>
<v-container grid-list-lg>
  <v-alert
    :value="fetchError"
    type="error"
  >
    {{ fetchError }}
  </v-alert>

  <v-layout row wrap v-if="!fetchError && property">
    <!-- Property card -->
    <v-flex sm12 offset-md1 md10 offset-lg2 lg8>
      <v-card>
        <v-layout row wrap>
          <v-flex xs12 sm5>
            <v-img
              src="/assets/p1.jpg"
              height="250px"
            ></v-img>
          </v-flex>

          <v-flex xs12 sm7>
            <v-card-title primary-title>
              <div>
                <h3 class="headline">{{ property.title }}</h3>
                <div>{{ property.highlightedVicinity }}</div>
              </div>
            </v-card-title>

            <v-card-text>
              <h1>€ {{ pricePerNight }}</h1>
              <div>per night</div>
            </v-card-text>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

    <!-- Checkin date -->
    <v-flex xs12 sm6 offset-md1 md5 offset-lg2 lg3 >
      <div class="subheading">CHECKIN</div>
      <v-date-picker
        full-width
        :show-current="false"
        v-model="bookingInfo.checkinDate"
        :min="new Date().toISOString().substr(0, 10)"
      ></v-date-picker>
    </v-flex>

    <!-- Checkout date -->
    <v-flex xs12 sm6 md5 lg3 >
      <div class="subheading">CHECKOUT</div>
      <v-date-picker
        full-width
        :show-current="false"
        v-model="bookingInfo.checkoutDate"
        :min="checkinDatePlusOne"
      ></v-date-picker>
    </v-flex>

    <!-- user form -->
    <v-flex xs12 sm6 offset-md1 md5 offset-lg0 lg2>
      <v-form
        v-model="valid"
        ref="form"
      >
        <v-select
          label="Number of rooms"
          :show-current="false"
          :items="NumberOfRoomsOptions"
          v-model="bookingInfo.numberOfRooms"
        ></v-select>

        <v-text-field
          v-model="bookingInfo.username"
          label="Name"
          :rules="nameRule"
          required
        ></v-text-field>

        <v-text-field
          v-model="bookingInfo.email"
          label="Email"
          :rules="emailRule"
          required
        ></v-text-field>
      </v-form>

      <div>
        Total
        <h1>€ {{ total }}</h1>
      </div>

      <ul>
        <li v-for="message in errorMessages"
          :key="message"
          class="red--text"
        >{{ message }}</li>
      </ul>

      <v-btn color="success" @click="submitBooking">Book</v-btn>
      <v-btn color="error" flat>
        <router-link tag="span" to="/">
          Cancel
        </router-link>
      </v-btn>
    </v-flex>
  </v-layout>

  <v-snackbar
    v-model="isCreationError"
    :timeout="5000"
    color="error"
    top
    multi-line
  >
    The service seems currently unavailable. Please try again later.
    <v-btn
      flat
      @click="isCreationError = false"
    >
      Close
    </v-btn>
  </v-snackbar>
</v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      property: null,
      pricePerNight: 50, // EUR

      // booking information
      bookingInfo: {
        propertyId: this.$route.params.propertyId,
        propertyName: '',
        city: '',
        checkinDate: new Date().toISOString().substr(0, 10),
        checkoutDate: '',
        numberOfRooms: 1,
        username: '',
        email: ''
      },
      // form validation
      valid: false,
      nameRule: [
        v => !!v.trim() || 'Name is required'
      ],
      emailRule: [
        v => !!v.trim() || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],

      fetchError: false,
      isCreationError: false,
      errorMessages: []
    }
  },

  computed: {
    // to generate the init options of numberOfRooms selector
    NumberOfRoomsOptions () {
      const max = 5

      let options = []
      for (let i = 1; i <= max; i++) {
        options.push(i)
      }

      return options
    },

    // return ISOString date of checkoutDate + 1
    checkinDatePlusOne () {
      const unixCheckin = this.dateToUnix(this.bookingInfo.checkinDate)

      return this.unixToDate(unixCheckin + 86400000)
    },

    // return the day differences between checkinDate and checkoutDate
    dayDiff () {
      const unixCheckin = this.dateToUnix(this.bookingInfo.checkinDate)
      const unixCheckout = this.dateToUnix(this.bookingInfo.checkoutDate)

      if (unixCheckin >= unixCheckout || isNaN(unixCheckout)) {
        return 0
      } else {
        return (unixCheckout - unixCheckin) / 86400000
      }
    },

    // return the total price of this booking
    total () {
      return this.pricePerNight * this.dayDiff * this.bookingInfo.numberOfRooms
    }
  },

  methods: {
    ...mapActions({
      fetchPropertyById: 'properties/fetchPropertyById',
      createNewBooking: 'bookings/createNewBooking'
    }),

    dateToUnix (date) {
      return new Date(date).getTime()
    },

    unixToDate (unix) {
      return new Date(unix).toISOString().substr(0, 10)
    },

    async submitBooking () {
      // reset errorMessages
      this.errorMessages = []
      // set errorMessages if checkoutDate is empty
      if (this.bookingInfo.checkoutDate === '') {
        this.errorMessages.push('Checkout date should NOT be empty')
      }
      // set errorMessages if username and/or email are/is invalid
      if (!this.$refs.form.validate()) {
        this.errorMessages.push('Please check your profile again')
      }

      // all valid => submit booking
      if (this.errorMessages.length === 0) {
        try {
          this.isCreationError = false
          await this.createNewBooking(this.bookingInfo)
        } catch (err) {
          this.isCreationError = true
        }
      }
    }
  },

  async created () {
    try {
      const { data } = await this.fetchPropertyById(this.bookingInfo.propertyId)
      this.property = data[0]
      this.bookingInfo.propertyName = this.property.title
      let address = data[0].highlightedVicinity.split(/, /g)
      this.bookingInfo.city = address[address.length - 1]
    } catch (err) {
      if (err.response.status === 404) {
        this.fetchError = 'Sorry, we cannot find this property. Please check the url again.'
      } else {
        this.fetchError = 'Sorry, the service seems currently unavailabe. Please try again later.'
      }
    }
  },

  watch: {
    dayDiff (diff) {
      if (diff === 0) {
        this.bookingInfo.checkoutDate = this.checkinDatePlusOne
      }
    }
  }
}
</script>
