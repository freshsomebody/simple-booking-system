<template>
<v-container grid-list-lg>
  <v-alert
    :value="errorMessage"
    type="error"
    class="headline"
  >
    {{ errorMessage }}
  </v-alert>

  <v-layout row wrap v-if="!errorMessage">
    <v-flex
      v-for="(property, index) in sortedNearbyProperties"
      :key="property.id"
      d-flex
      xs12
      offset-sm1 sm10
      :offset-lg2="index % 2 === 0" :offset-lg0="index % 2 === 1" lg4
    >
      <PropertyCard
        :property="property"
        show-distance
        book-btn />
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import PropertyCard from '@/components/PropertyCard'

export default {
  components: {
    PropertyCard
  },

  data () {
    return {
      isGeolocationAvailable: true,
      errorMessage: false
    }
  },

  computed: {
    ...mapState({
      nearbyProperties: state => state.properties.nearbyProperties
    }),

    sortedNearbyProperties () {
      if (this.nearbyProperties.length > 0) {
        return this.nearbyProperties.slice(0).sort((propA, propB) => propA.distance - propB.distance)
      } else return []
    }
  },

  methods: {
    ...mapActions('properties', {
      fetchNearbyProperties: 'fetchNearbyProperties'
    }),

    getCurrentPosition () {
      return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(position => {
            resolve([position.coords.latitude, position.coords.longitude])
          }, error => {
            reject(error)
          })
        } else {
          // geolocation is not available
          reject(new Error('geolocation is not available'))
        }
      })
    }
  },

  async created () {
    try {
      const position = await this.getCurrentPosition()
      await this.fetchNearbyProperties(position)
    } catch (err) {
      this.isGeolocationAvailable = false
      this.errorMessage = err.message
    }
  }
}
</script>
