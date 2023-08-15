<template>
    <div class="container mt-5">
        <div class="row">
          <div class="col-md-6 mb-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Hallo, {{ username }}!</h5>
                <p class="card-text">⠀</p>
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Anzahl von Produkten im Shop:</h5>
                <p class="card-text">{{ store.state.productCount }}</p>
              </div>
            </div>
          </div>
          
          <div class="col-12 mb-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Tolle Daten:</h5>
                <p class="card-text">ja</p>
              </div>
            </div>
          </div>
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
    background-color: rgb(217, 141, 0);
}
</style>
