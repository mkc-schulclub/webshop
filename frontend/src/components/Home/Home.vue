<template>
    <Products v-if="this.activePage === 0"/>
    <Cart v-if="this.activePage === 1"/>
    <Schulclub v-if="activePage === 2"/>
</template>
  
<script>
    import { computed } from 'vue';
    import { useStore } from 'vuex';

    import Products from './Products.vue';
    import Cart from './Cart.vue'
    import Schulclub from './Schulclub.vue'

    export default {
        setup() {
            const store = useStore();
            const activePage = computed(() => store.state.activePage);
            return {
                activePage,
            }
        },
        components: {
            Products,
            Cart,
            Schulclub,
        },
    };
</script>
  
<style> 
    @import 'bootstrap/dist/css/bootstrap.css';
</style>
  