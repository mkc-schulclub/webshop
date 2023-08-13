<template>
  <div v-if="ifLoading" class="loading-backdrop">
    <div class="loading-content">
      <span class="loading-text">Laden</span>
      <span class="loading-dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["ifLoading"]),
  },
};
</script>

<style scoped>
.loading-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.loading-content {
  display: flex;
  align-items: center;
}

.loading-text {
  color: #fff;
  font-size: 1.5rem;
  margin-right: 8px;
}

.loading-dots {
  display: inline-flex;
  align-items: center;
}

.dot {
  height: 8px;
  width: 8px;
  background-color: #fff;
  border-radius: 50%;
  margin: 0 4px;
  animation: dot-pulse 1s infinite;
}

@keyframes dot-pulse {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}
</style>
