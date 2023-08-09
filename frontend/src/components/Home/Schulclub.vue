<template>
  <div id="schulclub" class="mx-4">
    <router-link to="/admin"><button class="btn btn-primary">Zum Admin-Interface (für Schulclub-Mitglieder)</button></router-link>
  </div>
</template>
  
<script>
  import { RouterLink } from 'vue-router';

  export default {
    props: {
      activePage: Number
    },
    methods: {
      goToAdmin() {
        window.location.href = '/admin/';
      }
    }
  };
</script>
  
<style scoped>
@import 'bootstrap/dist/css/bootstrap.css';

</style>  