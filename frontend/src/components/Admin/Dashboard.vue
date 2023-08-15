<template>
    <div id="dash" class="container row">
        <div class="card mx-4 py-2 text-center col">
            Anzahl von Produkten im Shop: {{ store.state.productCount }}
        </div>
        <div class="card mx-4 py-2 text-center col">
            {{ username }}
        </div>
    </div>
</template>

<script>
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    return {
        store,
    };
  },
  data() {
    return {
      username: '',
    };
  },
  created() {
    const cookieValue = this.getCookieValue('username');
    this.username = cookieValue.charAt(0).toUpperCase() + cookieValue.slice(1);
  },
  methods: {
    getCookieValue(cookieName) {
      const cookiePairs = document.cookie.split(';');
      for (const pair of cookiePairs) {
        const [name, value] = pair.trim().split('=');
        if (name === cookieName) {
          return value;
        }
      }
      return null;
    },
  },
};
</script>

<style>
@import "bootstrap/dist/css/bootstrap.css";
.card {
    color: whitesmoke;
    background-color: yellow;
}
</style>
