<template>
  <nav class="navbar navbar-expand-lg">
    <a class="navbar-brand ml-4" href="" @click.prevent="setPage(0)">MKC Merch-Store</a>
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
            v-if="index === 1 && route === 'Home' && cartItemCount">
              {{ cartItemCount }}
            </span>
          </a>
        </li>
        <router-link 
            v-if="route === 'Login'"
            class="nav-link" 
            :title="`Zu Home`"
            to="/">
            Zurück zu Home
          </router-link>
      </ul>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue';
import { mapState, mapGetters, useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const activePage = computed(() => store.state.activePage);
    const cartItemCount = computed(() => store.getters.cartItemCount);
    const route = computed(() => store.state.route);

    const setPage = (page) => {
      store.dispatch('setActivePage', page);
    };

    return {
      route,
      activePage,
      cartItemCount,
      setPage,
    };
  },
  computed: {
    ...mapGetters(['cartItemCount']),
    ...mapGetters(['pages']),
  }
};
</script>

<style scoped>
@import 'bootstrap/dist/css/bootstrap.css';
nav {
  background-color: #78d6a3;
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