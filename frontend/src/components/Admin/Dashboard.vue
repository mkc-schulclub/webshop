<template>
    <div id="dash">
        <div class="card mx-5 py-2 text-center">
            Anzahl von Produkten im Shop: {{ store.state.productCount }}
        </div>
    </div>
</template>

<script>
import { computed, watch, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    onMounted(() => {
      //store.dispatch("fetchProducts");
    });
    return {
        store,
    };
  },
};
</script>

<style>
@import "bootstrap/dist/css/bootstrap.css";
.card {
    background-color: yellow;
    
}
</style>
