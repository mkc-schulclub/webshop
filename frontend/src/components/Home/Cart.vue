<template>
  <p v-if="activePage == 1 && !cart.length" class="mx-4">{{ "Der Warenkorb ist leer" }}</p>
  <div class="cart" v-if="activePage === 1">
    <ul v-for="(product, index) in cart" :key="index">
      <div>
        <h3>{{ product.name }}</h3>
        <div class="image">
          <img src="../images/cart.png" />
        </div>
        <ul v-if="product.color">
          <b>Farbe:</b>
          {{
            product.color
          }}
        </ul>
        <ul v-if="product.size">
          <b>Größe:</b>
          {{
            product.size
          }}
        </ul>
        <ul v-if="product.motive">
          <b>Motiv:</b>
          {{
            Object.values(product.motive)[0]
          }}
        </ul>
        <ul v-if="product.variation">
          <b>Variation:</b>
          {{
            Object.values(product.variation)[0]
          }}
        </ul>
        <ul>
          <b>Preis:</b>
          {{
            `${product.price}€`
          }}
        </ul>
        <ul>
          <b>Anzahl:</b
          >{{
            product.amount
          }}
        </ul>
        <div>
          <button
            class="btn btn-secondary btn-custom-hover"
            @click.prevent="removeFromCart(product)"
          >
            <i class="fas fa-trash"></i> Entfernen
          </button>
        </div>
      </div>
    </ul>
    <button
      class="btn btn-success submitCartBtn"
      v-if="cart.length"
      @click.prevent="submitCart()"
    >
      <i class="far fa-file-alt"></i> Bestellformular verarbeiten
    </button>
    <br />
    <a style="margin-left: 30%" v-if="pdf" :href="pdf"
      >Hier clicken, um das Bestellformular herunterzuladen!</a
    >
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
import { computed, ref } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const activePage = computed(() => store.state.activePage);
    const cart = ref(store.state.cart);
    return {
      activePage,
      cart,
    };
  },
  data() {
    return {
      pdf: null,
    };
  },
  methods: {
    removeFromCart(product) {
      const existingItemIndex = this.cart.findIndex((item) => {
        return (
          item.name === product.name &&
          item.size === product.size &&
          item.color === product.color &&
          JSON.stringify(item.motive) === JSON.stringify(product.motive) &&
          JSON.stringify(item.variation) === JSON.stringify(product.variation)
        );
      });
      if (existingItemIndex !== -1) {
        const item = this.cart[existingItemIndex];
        if (item.amount > 1) {
          item.amount--;
        } else {
          this.cart.splice(existingItemIndex, 1);
        }
      }
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    getCookieValue(name) {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
          return cookie.substring(name.length + 1);
        }
      }
      return null;
    },
    submitCart() {
      fetch("https://frog.lowkey.gay/vyralux/api/v1/key", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.json())
      .then((data) => {
        let key = CryptoJS.SHA256(data["keyBase"]).toString(CryptoJS.enc.Hex);
        const expirationDate = new Date();
        expirationDate.setTime(
          expirationDate.getTime() + 24 * 60 * 60 * 1000
        );
        document.cookie = `key=${key}; expires=${expirationDate.toUTCString()}; path=/; SameSite=None; secure`;

        let cartData = localStorage.getItem("cart");
        const url = "https://frog.lowkey.gay/vyralux/api/v1/order";
        const options = {
          method: "POST",
          headers: new Headers({
            "content-type": "application/json",
            hjtrfs: CryptoJS.HmacSHA256(cartData, this.getCookieValue("key")).toString(
              CryptoJS.enc.Hex
            ),
          }),
          body: cartData,
        };
        fetch(url, options)
          .then((response) => response.json())
          .then((data) => {
            this.downloadFile(data.files[0]);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
    },
    downloadFile(pdfUrl) {
      this.pdf = pdfUrl
      const anchor = document.createElement("a");
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.setAttribute("download", "file.pdf");
      anchor.setAttribute("href", pdfUrl);
      anchor.click();
      document.body.removeChild(anchor);
    },
  },
};
</script>

<style scoped>
@import "bootstrap/dist/css/bootstrap.css";
.submitCartBtn {
  align-items: center;
  align-content: center;
  align-self: center;
  margin-left: 40%;
  margin-bottom: 30px;
}
.btn-custom-hover:hover {
  background-color: rgb(230, 86, 86);
}
</style>
