<template>
  <Products v-if="activePage === 1" />
</template>

<script>
import Products from "./Products.vue";

import { computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import router from "../../router";

export default {
  setup() {
    const store = useStore();
    const activePage = computed(() => store.state.activePage);
    onMounted(() => {
      store.dispatch("fetchProducts");
    });
    watch(activePage, (index) => {
      if (index === 3) {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          const cookieName = cookie.split("=")[0];
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; path=/;`;
        }
        router.push("/");
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
