<template>
<v-card>
  <v-layout row wrap>
    <v-flex xs12 :sm5="horizontal">
      <v-img
        :src="imageSrc"
        height="250px"
        aspect-ratio="2.75"
      ></v-img>
    </v-flex>

    <v-flex xs12 :sm7="horizontal">
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{ property.title }}</h3>
            <div>{{ property.highlightedVicinity }}</div>
            <div v-if="showDistance">
              <v-icon>directions_walk</v-icon>
              {{ property.distance / 1000 }} meters away
            </div>
          </div>
        </v-card-title>

      <v-card-text>
        <h2>€ {{ pricePerNight }}</h2>
        <div>per night</div>
      </v-card-text>
    </v-flex>

    <v-flex xs12 v-if="bookBtn">
      <v-card-actions>
        <v-btn
          v-if="bookBtn"
          class="bookBtn"
          flat
          color="orange"
          :to="`/booking/${property.id}`"
        >
          BOOK NOW
        </v-btn>
      </v-card-actions>
    </v-flex>
  </v-layout>
</v-card>
</template>

<script>
export default {
  data () {
    return {
      imageSrc: `/assets/p${Math.floor(Math.random() * 3) + 1}.jpg`,
      pricePerNight: 50
    }
  },

  props: {
    property: Object,
    horizontal: Boolean,
    showDistance: Boolean,
    bookBtn: Boolean
  }
}
</script>
