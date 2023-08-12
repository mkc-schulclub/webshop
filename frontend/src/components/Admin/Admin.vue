<template>
  <router-link to="/">Back to Home</router-link>
  <Products v-if="activePage === 1" />
</template>

<script>
import Products from "./Products.vue";

import { computed, watch, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const activePage = computed(() => store.state.activePage);
    onMounted(() => {
      store.dispatch("fetchProducts");
    });
    watch(activePage, (index) => {
      if (index === 3) {
        Products.methods.logout();
      }
    });
    return {
      activePage,
    };
  },
  components: {
    Products,
  },
};
</script>

<style>
@import "bootstrap/dist/css/bootstrap.css";
</style>
