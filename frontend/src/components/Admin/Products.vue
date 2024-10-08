<template>
  <div class="products" v-if="mode === 'view'">
    <div class="d-flex align-items-center">
      <h2>Liste aller Produkte</h2>
      <button
        @click="
          mode = 'add';
          adding();
        "
        title="Ein Produkt hinzufügen"
        id="addProductBtn"
        class="ms-1 btn btn-primary"
      >
        ＋
      </button>
    </div>
    <br />
    <ul v-for="(product, index) in products" :key="index">
      <div class="productcontainer">
        <div class="text">
          <h3 class="prod-prop-n">
            <p>{{ product.name }}</p>
          </h3>
          <h4 class="prod-prop-n">
            <p>ID:</p>
            <span class="prod-prop">{{ product.prod_id }}</span>
          </h4>

          <h4 class="prod-prop-n">
            <p>Preis:</p>
            <span class="prod-prop">{{ product.price }}</span>
          </h4>

          <h4
            v-if="product.colors && product.colors.length"
            class="prod-prop-n"
          >
            <p>Farben:</p>
            <span class="prod-prop">{{ product.colors.join(", ") }}</span>
          </h4>

          <h4 v-if="product.sizes && product.sizes.length" class="prod-prop-n">
            <p>Größen:</p>
            <span class="prod-prop">{{ product.sizes.join(", ") }}</span>
          </h4>

          <h4 v-if="product.motives.length" class="prod-prop-n">
            <p>Motive:</p>
            <span class="prod-prop">{{
              product.motives.map((mot) => mot[1]).join(", ")
            }}</span>
          </h4>

          <h4 v-if="product.variations.length" class="prod-prop-n">
            <p>Variationen:</p>
            <span class="prod-prop">{{
              product.variations.map((vari) => vari[1]).join(", ")
            }}</span>
          </h4>

          <div class="d-flex align-items-center">
            <button @click="edit(product)" class="btn btn-success">
              Bearbeiten
            </button>
            <button
              class="btn btn-danger"
              v-if="!product.surely"
              @click="product.surely = true"
            >
              Löschen
            </button>
            <div>
              <div v-if="product.surely">
                <p>Wirklich löschen?</p>
                <button
                  @click="
                    product.surely = false;
                    deleteProduct(product);
                  "
                  class="btn btn-success"
                  style="margin-left: 20px"
                >
                  ✓
                </button>
                <button @click="product.surely = false" class="btn btn-danger">
                  X
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
    </ul>
  </div>

  <div id="productMod" v-if="mode === 'edit' || mode === 'add'">
    <h2 v-if="mode === 'add'">Produkt hinzufügen</h2>
    <h2 v-if="mode === 'edit'">Produkt bearbeiten</h2>
    <h6>
      Hinweise:
      <ul class="mb-1">
        <li>
          Angaben wie bei Farben, Größen etc. müssen mit Komma getrennt sein.
        </li>
        <li>
          Größe/Auflösung von Bildern sollte so klein wie möglich sein.
          Vorzugsweise Bilder in .webp format konvertieren
        </li>
      </ul>
    </h6>
    <p style="color: gray">Bsp.: Motive: Klinger Kopf, MKC Logo</p>
    <form ref="productForm" @submit.prevent="modProduct">
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="product.name" required />
      </div>
      <div>
        <label for="prod_id">Produkt-ID:</label>
        <input
          v-bind:disabled="mode === 'edit'"
          type="text"
          id="prod_id"
          v-model="product.prod_id"
          required
        />
      </div>
      <div>
        <label for="price">Preis</label>
        <input type="text" id="price" v-model="product.price" required />
      </div>
      <div>
        <label for="sizes">Größen:</label>
        <input type="text" id="sizes" v-model="product.sizes" />
      </div>
      <div>
        <label for="colors">Farben:</label>
        <input type="text" id="colors" v-model="product.colors" />
      </div>
      <div>
        <label for="colors">Variationen:</label>
        <input
          type="text"
          id="variation"
          ref="variations"
          v-model="product.variations"
        />
      </div>
      <div>
        <label for="colors">Motive:</label>
        <input
          type="text"
          id="motives"
          ref="motives"
          v-model="product.motives"
        />
      </div>
      <div class="mb-3">
        <label class="btn btn-primary">
          Bild auswählen
          <input type="file" @change="previewImage" style="display: none" />
        </label>
        <img
          id="imagePreview"
          alt="Selected Image"
          style="max-width: 100px; display: none"
        />
      </div>
      <br />
      <p v-if="false" style="color: green">
        Ein Produkt kann nicht Variationen und Motive gleichzeitig haben.
      </p>
      <p v-if="error" style="color: red">{{ error }}</p>
      <br />
      <div class="d-flex align-items-center">
        <button
          type="submit"
          :class="{
            'disabled-button':
              product.motives.length && product.variations.length,
          }"
          class="btn btn-success"
        >
          Fertig
        </button>
        <button @click.prevent="mode = 'view'" class="btn btn-danger">
          Abbrechen
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { computed } from "vue";
import { mapState, useStore, mapActions } from "vuex";
import { useRouter } from "vue-router";
import router from "../../router";
import CryptoJS from "crypto-js";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const activePage = computed(() => store.state.activePage);
    return {
      activePage,
    };
  },
  data() {
    return {
      mode: "view",
      error: "",
      editProduct: {},
      product: {},
      errorPopup: false,
    };
  },
  watch: {
    product: {
      deep: true,
      handler() {
        if (this.product.motives.length && this.product.variations.length) {
          this.error =
            "Ein Produkt kann nicht Variationen und Motive gleichzeitig haben.";
        } else {
          this.error = "";
        }
      },
    },
  },
  methods: {
    ...mapActions(["fetchProducts"]),
    adding() {
      this.product = {
        name: "",
        prod_id: "",
        sizes: [],
        colors: [],
        motives: [],
        variations: [],
      };
    },
    edit(product) {
      this.mode = "edit";
      (this.editProduct = product), (this.product.name = this.editProduct.name);
      this.product.prod_id = this.editProduct.prod_id;
      this.product.price = this.editProduct.price;
      this.product.sizes = this.editProduct.sizes ? this.editProduct.sizes : "";
      this.product.colors = this.editProduct.colors
        ? this.editProduct.colors
        : "";
      this.product.variations = this.editProduct.variations
        ? this.editProduct.variations.map((variation) => variation[1])
        : [];
      this.product.motives = this.editProduct.motives
        ? this.editProduct.motives.map((motive) => motive[1])
        : [];
    },
    modProduct() {
      if (!this.getCookieValue("sessionToken"))
        return console.error("You are not logged in");
      function goodArray(data) {
        if (Array.isArray(data)) {
          return data;
        }
        if (typeof data === "string") {
          return data.split(/,\s*|,/).map((item) => item.trim());
        }
        return [];
      }
      const METH = this.mode === "add" ? "POST" : "PATCH";
      const newProduct = {
        name: this.product.name,
        prod_id: this.product.prod_id,
        price: this.product.price,
        sizes: this.product.sizes.length ? goodArray(this.product.sizes) : [],
        colors: this.product.colors.length
          ? goodArray(this.product.colors)
          : [],
        motives: this.product.motives.length
          ? goodArray(this.product.motives).map((motive, index) => [
              String(index + 1),
              motive,
            ])
          : [],
        variations: this.product.variations.length
          ? goodArray(this.product.variations).map((variation, index) => [
              String(index + 1),
              variation,
            ])
          : [],
      };
      this.$refs.productForm.reset();
      let productData = JSON.stringify(newProduct);
      let code;
      fetch("https://frog.lowkey.gay/vyralux/api/v1/items", {
        method: METH,
        headers: {
          "Content-Type": "application/json",
          hjtrfs: CryptoJS.HmacSHA256(
            productData,
            this.getCookieValue("key")
          ).toString(CryptoJS.enc.Hex),
          ndcauth: this.getCookieValue("sessionToken"),
        },
        body: productData,
      })
        .then((response) => {
          code = response.status;
          return (response = response.json());
        })
        .then((response) => {
          let title, message;
          message = response["api:message"];
          if (code === 200) {
            this.fetchProducts();
            this.mode = "view";
            return;
          } else {
            title = code === 500 ? "Ein Fehler ist aufgetreten" : "";
            if (response["api:message"] === "Invalid Session") {
              title =
                "Du bist nicht eingeloggt! Du wirst zum Login weitergeleitet...";
              this.$store.commit("setPopup", {
                isVisible: true,
                title: title,
                message: message,
              });
              return setTimeout(() => {
                router.push("/admin/login");
                this.$store.commit("setPopup", { isVisible: false });
              }, 3000);
            }
          }
          this.$store.commit("setPopup", {
            isVisible: true,
            title: title,
            message: message,
          });
        })
        .catch((error) => {
          console.error("Fehler:", error);
        });
    },
    deleteProduct(product) {
      this.editProduct = product;
      const data = JSON.stringify(this.editProduct);
      fetch("https://frog.lowkey.gay/vyralux/api/v1/items", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          hjtrfs: CryptoJS.HmacSHA256(
            data,
            this.getCookieValue("key")
          ).toString(CryptoJS.enc.Hex),
          ndcauth: this.getCookieValue("sessionToken"),
        },
        body: data,
      })
        .then((response) => {
          return response;
        })
        .then(() => {
          this.fetchProducts();
          this.mode = "view";
        })
        .catch((error) => {
          this.errorPopup = true;
          console.error("Error fetching data:", error);
        });
    },
    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imagePreview = document.getElementById("imagePreview");
          imagePreview.src = e.target.result;
          imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
    },
    getCookieValue(name) {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
          return cookie.substring(name.length + 1);
        }
      }
      return null;
    },
  },
  computed: {
    ...mapState(["products"]),
  },
};
</script>

<style>
@import "bootstrap/dist/css/bootstrap.css";
.productcontainer {
  display: flex;
  flex-direction: column;
}
.productcontainer p {
  background-color: rgb(190, 255, 190);
  padding: 2px 6px;
  border-radius: 4px;
  margin: 0;
}
.prod-prop-n {
  display: flex;
  align-items: flex-start;
}

.prod-prop-n span.prod-prop {
  margin-left: 10px; /* Adjust the indentation value as needed */
}

.disabled-button {
  display: none;
  background-color: #9e9e9e;
}
#productMod {
  margin-left: 27px;
}
form div {
  margin-bottom: 12px;
}
form label {
  display: inline-block;
  width: 120px;
}
form input {
  width: 200px;
}
</style>
