<template>
<v-container grid-list-lg>
  <v-layout row wrap>
    <v-flex xs12>
      <v-alert
        :value="!isGeolocationAvailable"
        type="error"
      >
        geolocation is not available
      </v-alert>
    </v-flex>

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
      isGeolocationAvailable: true
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

  created () {
    this.getCurrentPosition().then(position => {
      this.fetchNearbyProperties(position)
    }).catch(() => {
      this.isGeolocationAvailable = false
    })
  }
}
</script>
