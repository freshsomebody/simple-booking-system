<template>
<div class="MainScreenLoading" v-if="isMainScreenLoading">
  <v-progress-circular
    :size="100"
    :width="7"
    color="primary"
    indeterminate
  ></v-progress-circular>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      isMainScreenLoading: state => state.isMainScreenLoading
    })
  }
}
</script>

<style lang="scss" scoped>
.MainScreenLoading {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99;
  opacity: 0.5;

  background: white;
}
</style>
