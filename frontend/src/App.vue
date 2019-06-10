<template>
  <v-app>
    <Navbar />

    <MainScreenLoading />

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar'
import MainScreenLoading from '@/components/MainScreenLoading'

export default {
  name: 'App',

  components: {
    Navbar,
    MainScreenLoading
  },

  data () {
    return {
      //
    }
  }
}
</script>
