<template>
  <nav class="navbar navbar-expand-lg">
    <router-link @click="setPage(0)" class="navbar-brand ml-4" to="/"
      >MKC Merch-Store</router-link
    >
    <div class="container-fluid">
      <ul id="navcontent" class="navbar-nav me-auto mb-2 mb-lg-0">
        <li v-for="(page, index) in pages" :key="index" class="nav-item">
          <a
            class="nav-link mx-0"
            :class="{ active: activePage === index }"
            :href="page.pageTitle"
            :title="`Zur ${page.pageTitle} Seite`"
            @click.prevent="setPage(index)"
          >
            {{ page.pageTitle }}
            <span
              class="badge rounded-pill bg-danger"
              v-if="index === 1 && route === 'Home' && cartItemCount"
            >
              {{ cartItemCount }}
            </span>
          </a>
        </li>
        <router-link
          v-if="route === 'Login'"
          class="nav-link"
          :title="`Zu Home`"
          to="/"
        >
          Zurück zu Home
        </router-link>
      </ul>
      <button class="btn btn-success" @click="toggleDarkMode">Darkmode</button>
    </div>
  </nav>
</template>

<script>
import { computed, ref } from "vue";
import { mapState, mapGetters, useStore, mapMutations } from "vuex";

export default {
  setup() {
    const store = useStore();
    const activePage = computed(() => store.state.activePage);
    const cartItemCount = computed(() => store.getters.cartItemCount);
    const darkMode = ref(store.state.darkMode);
    const route = computed(() => store.state.route);

    const setPage = (page) => {
      store.dispatch("setActivePage", page);
    };

    return {
      store,
      darkMode,
      route,
      activePage,
      cartItemCount,
      setPage,
    };
  },
  computed: {
    ...mapGetters(["cartItemCount"]),
    ...mapGetters(["pages"]),
  },
  methods: {
    toggleDarkMode() {
      this.$store.commit("toggleDarkMode");
    },
  },
};
</script>

<style scoped>
@import "bootstrap/dist/css/bootstrap.css";
nav {
  background-color: var(--my-primary);
}
@media (max-width: 1000px) {
  #navcontent {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    /*overflow-x: auto;*/
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: -ms-autohiding-scrollbar;
  }
  #navcontent .nav-item {
    white-space: nowrap;
    /*margin: 0 3vh;*/
    margin-left: 0;
    margin-right: 1em;
  }
  .navbar-brand {
    margin-left: 4vh;
  }
}
.navbar-brand {
  margin-left: 30px;
}
</style>
