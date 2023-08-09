<template>
  <div>
    <div v-if="popup.isVisible" class="dialog-overlay">
        <div class="dialog-content">
            <h2>{{ popup.title }}</h2>
            <p>{{ popup.message }}</p>
            <button @click="closePop">Schließen</button>
        </div>
    </div>
</div>
</template>
  
<script>
import { computed, ref } from 'vue';
import { mapState, mapActions, mapGetters, useStore } from 'vuex';

  export default {
    computed: {
    ...mapGetters(['popup']),
  },
  methods: {
    closePop() {
      this.$store.commit('setPopup', { isVisible: false });
    },
  },
  };
</script>
  
<style scoped>
@import 'bootstrap/dist/css/bootstrap.css';
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
}
.dialog-button {
  margin-top: 10px;
}
</style>