<template>
  <div id="app" class="">
    <LoadingBackdrop/>
    <Navbar/>
    <Header/>
    <router-view></router-view>
    <Popup/>
  </div>
</template>

<script>
import LoadingBackdrop from './components/LoadingBackdrop.vue';
import Navbar from './components/Navbar.vue';
import Header from './components/Header.vue';
import Popup from './components/Popup.vue'

import Home from './components/Home/Home.vue'
import Admin from './components/Admin/Admin.vue'

import { watch, ref } from 'vue';
import { mapState, mapActions, useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const darkMode = ref(store.state.darkMode);
    let dark = false;
    watch(() => store.state.darkMode, () => {
      dark = !dark
      if (dark) {
        document.documentElement.style.background = "#2B2A33"
        document.getElementById("app").classList.add("darkmode")
        return
      }
      document.documentElement.style.background = "white"
      document.getElementById("app").classList.remove("darkmode")
    });
    return {
      darkMode,
      store,
    };
  },
  computed: {
    ...mapState(['activePage']),
  },
  methods: {
    ...mapActions(['getCart']),
  },
  components: {
    LoadingBackdrop,
    Popup,
    Navbar,
    Header,
    Home,
    Admin,
  },
  data() {
    return {
      dark: false,
      eventBus: app,
    };
  },
  created() {
    this.getCart();
},
};
</script>

<style> 
  @import 'bootstrap/dist/css/bootstrap.css';
  @import './index.css';
  #app {
    height:100vh;
  }
</style>