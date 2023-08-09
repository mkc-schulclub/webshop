<template>
    <div class="mx-4">
        <h1>{{ pages[activePage].pageTitle }}</h1>
        <p>{{ pages[activePage].content }}</p>
    </div>
</template>
  
<script>
    import { computed } from 'vue';
    import { useStore, mapGetters } from 'vuex';

    export default {
    setup() {
        const store = useStore();
        const activePage = computed(() => store.state.activePage);
        const pages = computed(() => store.getters.pages)
        const cart = store.state.cart
        return {
            pages,
            activePage,
            cart,
        };
    },
    };
</script>
  
<style scoped>
@import 'bootstrap/dist/css/bootstrap.css';
</style>
  