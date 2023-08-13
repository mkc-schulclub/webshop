<template>
  <div class="mx-4">
    <div class="input-group mb-3">
      <input
        type="text"
        class="form-control form-control-lg border-dark"
        v-model="searchTerm"
        placeholder="Produkte suchen..."
      />
    </div>
    <div class="my-3 row filters">
      <h4 class="col-lg-1">Filter:</h4>
      <div class="form-group col-lg-1">
        <select id="sizeFilter" class="dropdown" v-model="selectedSize">
          <option value="" disabled selected hidden>Größe</option>
          <option value="">alle</option>
          <option v-for="size, index in availableSizes" :key="index">{{ size }}</option>
        </select>
      </div>
      <div class="form-group col-lg-1">
        <select id="sizeFilter" class="dropdown" v-model="selectedColor">
          <option value="" disabled selected hidden>Farben</option>
          <option value="">alle</option>
          <option v-for="color, index in availableColors" :key="index">{{ color }}</option>
        </select>
      </div>
      <div class="form-group col-lg-1">
        <select id="sizeFilter" class="dropdown" v-model="selectedDesign">
          <option value="" disabled selected hidden>Designs</option>
          <option value="">alle</option>
          <option v-for="design, index in availableDesigns" :key="index">{{ design[1] }}</option>
        </select>
      </div>
    </div>
  </div>

  <ul v-for="(product, index) in filteredProducts" :key="index" class="card mb-2 mx-0 p-0" style="width: 100%;">
    <div class=" card-body">
      <div class="text">
        <h3 class="mb-0">{{ `${product.name} (${product.prod_id})` }}</h3>
        <div class="selections">
          <div class="btn-toolbar" role="toolbar">
            <div class="btn-group custom-border flex-wrap">
              <button
                v-for="color in product.colors"
                :key="color"
                type="button"
                class="btn btn-select"
                :class="{ active: product.selectedColor === color }"
                @click="product.selectedColor = color"
              >
                {{ color }}
              </button>
            </div>
            <div class="btn-group custom-border flex-wrap">
              <button
                v-for="size in product.sizes"
                :key="size"
                type="button"
                class="btn btn-select"
                :class="{ active: product.selectedSize === size }"
                @click="product.selectedSize = size"
              >
                {{ size }}
              </button>
            </div>
            <div class="btn-group custom-border flex-wrap">
              <button
                v-for="motive in product.motives"
                :key="motive[0]"
                type="button"
                class="btn btn-select"
                :class="{ active: product.selectedMotive === motive }"
                @click="product.selectedMotive = motive"
              >
                {{ motive[1] }}
              </button>
            </div>
            <div class="btn-group custom-border flex-wrap">
              <button
                v-for="variation in product.variations"
                :key="variation[0]"
                type="button"
                class="btn btn-select"
                :class="{ active: product.selectedVariation === variation }"
                @click="product.selectedVariation = variation"
              >
                {{ variation[1] }}
              </button>
            </div>
          </div>
          <div class="container mt-4">
            <button
              type="button"
              class="btn btn-success cart-btn mb-1"
              @click.prevent="addToCart(product)"
              :disabled="!propertiesSelected(product)"
              :class="{ 'disabled-button': !propertiesSelected(product) }"
            >
              <img
                src="../images/cart.png"
                width="16"
                height="16"
                class="mr-1 image"
              />
              Zum Warenkorb hinzufügen
            </button>
          </div>
          <div class="text-center text-wrap card card-body mb-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed commodo
            sagittis fringilla. Integer at est risus. Curabitur risus nunc,
            finibus sed gravida ac, tempus eget justo.
          </div>
        </div>
      </div>
      <div class="">
        <img src="../images/IMG_2386.webp" class="rounded mx-auto d-block image img-fluid">
      </div>
    </div>
  </ul>
  <p v-if="!filteredProducts.length" class="text-center text-secondary">Keine Suchergebnisse °՞(ᗒᗣᗕ)՞°</p>
</template>

<script>
import { computed, ref } from "vue";
import { mapState, mapActions, mapGetters, mapMutations, useStore } from "vuex";
import Fuse from 'fuse.js';

export default {
  setup() {
    const store = useStore();
    const cart = ref(store.state.cart);
    const cartItemCount = computed(() => store.getters.cartItemCount);
    return {
      cart,
      cartItemCount,
    };
  },
  computed: {
    availableSizes() {
      const sizes = new Set();
      this.products.forEach((product) => {
        if (product.sizes) {
          product.sizes.forEach((size) => sizes.add(size));
        }
      });
      return Array.from(sizes);
    },
    availableColors() {
      const colors = new Set();
      this.products.forEach((product) => {
        if (product.colors) {
          product.colors.forEach((color) => colors.add(color));
        }
      });
      return Array.from(colors);
    },
    availableDesigns() {
      const designs = new Set();
      this.products.forEach((product) => {
        if (product.motives) {
          product.motives.forEach((motive) => designs.add(motive));
        }
        if (product.variations) {
          product.variations.forEach((variation) => designs.add(variation));
        }
      });
      return Array.from(designs);
    },
    filteredProducts() {
      let filtered = this.products;
      if (this.searchTerm) {
        const searchTerm = this.searchTerm.toLowerCase();
        const fuse = new Fuse(this.products, {
          keys: ['name'],
          threshold: 0.5,
        });
      const searchResults = fuse.search(searchTerm);
      const matchingProducts = searchResults.map((result) => result.item);
      filtered = matchingProducts;
      }
      if (this.selectedSize) {
        filtered = filtered.filter(
          (product) =>
            product.sizes && product.sizes.includes(this.selectedSize)
        );
      }
      if (this.selectedColor) {
        filtered = filtered.filter(
          (product) =>
            product.colors && product.colors.includes(this.selectedColor)
        );
      }
      if (this.selectedDesign) {
        filtered = filtered.filter(
          (product) =>
          (product.motives &&
          product.motives.some((motive) => motive[1] === this.selectedDesign)) ||
        (product.variations &&
          product.variations.some((variation) => variation[1] === this.selectedDesign))
        );
      }
      return filtered;
    },
    ...mapState(["products"]),
    ...mapGetters(["cartItemCount"]),
    displayProperties() {
      return this.properties.filter((property) =>
        this.products.some(
          (product) => product[property] && product[property].length > 0
        )
      );
    },
  },
  methods: {
    getProductProperty(product, property) {
      if (property === "variations" || property === "motives") {
        return product[property].map((value) =>
          typeof value === "object" ? value[1] : value
        );
      }
      return product[property];
    },
    propertiesSelected(product) {
      if (product.colors && product.colors.length > 0) {
        if (!product.selectedColor) {
          return false;
        }
      }
      if (product.sizes && product.sizes.length > 0) {
        if (!product.selectedSize) {
          return false;
        }
      }
      if (product.motives && product.motives.length > 0) {
        if (!product.selectedMotive) {
          return false;
        }
      }
      if (product.variations && product.variations.length > 0) {
        if (!product.selectedVariation) {
          return false;
        }
      }
      return true;
    },
    cartError() {
      const title = "Es liegen bereits 5 verschiedene Produkte im Warenkorb.";
      const message =
        "Weitere Produkte bitte in eine andere Bestellung verlagern.";
      this.$store.commit("setPopup", { title, message, isVisible: true });
    },
    addToCart(product) {
      if (this.cart.length >= 5) {
        return this.cartError();
      }
      const selectedItem = {
        name: product.name,
        prod_id: product.prod_id,
        size: product.selectedSize ? product.selectedSize : null,
        color: product.selectedColor ? product.selectedColor : null,
        motive: product.selectedMotive
          ? {
              [product.selectedMotive[0]]: product.selectedMotive[1],
            }
          : null,
        variation: product.selectedVariation
          ? {
              [product.selectedVariation[0]]: product.selectedVariation[1],
            }
          : null,
        price: product.price,
        amount: 1,
      };
      const existingItemIndex = this.cart.findIndex((item) => {
        return (
          item.name === selectedItem.name &&
          item.size === selectedItem.size &&
          item.color === selectedItem.color &&
          JSON.stringify(item.motive) === JSON.stringify(selectedItem.motive) &&
          JSON.stringify(item.variation) ===
            JSON.stringify(selectedItem.variation)
        );
      });
      if (existingItemIndex !== -1) {
        this.cart[existingItemIndex].amount++;
      } else {
        this.cart.push(selectedItem);
      }
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
  },
  data() {
    return {
      properties: ["colors", "sizes", "motives", "variations"],
      selectedProduct: {},
      searchTerm: "",
      selectedSize: "",
      selectedColor: "",
      selectedDesign: "",
    };
  },
};
</script>

<style scoped>
.card-body {
  background-color: #c6f1d9;
}
.cart-btn {
  margin-top: 0;
  margin: 20px;
}
.btn-select {
  background-color: var(--my-primary) !important;
  height: 40px !important;
  border-color: #000000 !important;
}
.btn-select.active {
  background-color: #4ec797 !important;
}
.btn-group {
  margin-bottom: 1em;
  margin-top: 1em;
  margin-right: 2em;
  height: 30px !important;
  /* display: flex !important; */
  align-items: baseline !important;
}
.image {
  max-width: 95%;
  height: auto;
}
@media (max-width: 560px) {
  .btn-group {
    margin-bottom: 2em;
    margin-top: 2em;
  }
  .btn-group:last-child {
    margin-bottom: 3em;
  }
}
.dropdown {
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background-color: #afafaf;
}
</style>
