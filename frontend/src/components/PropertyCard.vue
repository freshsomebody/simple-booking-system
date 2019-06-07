<template>
<v-card>
  <v-img
    :src="imageSrc"
    aspect-ratio="2.75"
  ></v-img>

  <v-card-title primary-title>
    <div>
      <h3 class="headline mb-0">{{ property.title }}</h3>
      <div>{{ property.highlightedVicinity }}</div>
      <div>
        <v-icon>directions_walk</v-icon>
        {{ property.distance / 1000 }} meters away
      </div>
    </div>
  </v-card-title>

  <v-card-text>
    <h2>€ {{ pricePerNight }}</h2>
    <div>per night</div>
  </v-card-text>

  <v-card-actions>
    <v-btn flat color="orange">
      <router-link tag="span" :to="`/booking/${property.id}`">
        Book Now
      </router-link>
    </v-btn>
  </v-card-actions>
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

  props: ['property']
}
</script>
