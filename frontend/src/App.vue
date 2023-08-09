<template>
  <div id="app">
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

import { computed } from 'vue';
import { mapState, mapActions, useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    return {
    
    };
  },
  computed: {
    ...mapState(['activePage'])
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
      
    };
  },
  created() {
    this.getCart();
},
};
</script>

<style> 
  @import 'bootstrap/dist/css/bootstrap.css';
</style>