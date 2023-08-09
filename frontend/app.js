Vue.createApp({
  data() {
    return {
      properties: ['colors', 'sizes', 'motives', 'variations'],
      loading: true,
      activePage: 0,
      darkmode: false,
      popup: false,
      pages: [
        {
          link: { text: "Home", url: "index.html" },
          pageTitle: "Home",
          content:
            "Willkommen im online Merch-Shop des Max-Klinger-Schulclubs!",
        },
        {
          link: { text: `Warenkorb`, url: "cart.html" },
          pageTitle: "Warenkorb",
          content: "",
        },
        {
          link: { text: "Schulclub", url: "contact.html" },
          pageTitle: "Max-Klinger-Schulclub",
          content: "",
        },
      ],
      products: [],
      cart: [],
      pdf: ""
    };
  },
  methods: {
    getProductProperty(product, property) {
      if (property === 'variations' || property === 'motives') {
        return product[property].map(value => typeof value === 'object' ? value[1] : value);
      }
      return product[property];
    },
    openPop(title, message) {
      this.popTitle = title
      this.popMessage = message
      this.popup = true
    },
    closePop() {
      this.popup = false
    },
    saveCurrent() {
      localStorage.setItem("activePage", JSON.stringify(this.activePage));
    },
    loadCurrent() {
      const page = localStorage.getItem("activePage");
      if (page && page >= 0 && page < this.pages.length) {
        this.activePage = JSON.parse(page);
      } else {
        this.activePage = 0;
      }
    },
    addToCart(product) {
      if (this.cart.length >= 5) {
          return this.openPop("Es liegen bereits 5 verschiedene Produkte im Warenkorb.", 
          "Weitere Produkte bitte in eine andere Bestellung verlagern.")
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
        selectedItem.quantity = 1;
        this.cart.push(selectedItem);
      }
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
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
    loadCartFromLocal() {
      const cartData = localStorage.getItem("cart");
      if (cartData) {
        this.cart = JSON.parse(cartData);
      }
    },
    submitCart() {
      data = localStorage.getItem("cart")
      const url = "https://frog.lowkey.gay/vyralux/api/v1/order";
      const options = {
        method: "POST",
        headers: new Headers({ 
          "content-type": "application/json",
          'hjtrfs': CryptoJS.HmacSHA256(data, "$2b$12$fwOnYqB3jsnF1IzFYtUbBekRJ/ZH/NH/UIYBxqM0zOwvP50J3c0C6").toString(CryptoJS.enc.Hex),
        }),
        body: data,
      };
      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          this.downloadFile(data.files[0]);
        })
        .catch((error) => {
          console.error("Error:", error);
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
    getCookieValue(cookieName) {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName + '=')) {
          const value = cookie.substring(cookieName.length + 1);
          return decodeURIComponent(value);
        }
      }
      return null;
    }
  },
  watch: {
    activePage() {
      this.saveCurrent();
    },
  },
  computed: {
    displayProperties() {
      return this.properties.filter(property => this.products.some(product => product[property] && product[property].length > 0));
    },
    cartItemCount() {
      let totalAmount = 0;
      for (const item of this.cart) {
        totalAmount += item.amount;
      }
      return totalAmount;
    },
  },
  mounted() {
  fetch("https://frog.lowkey.gay/vyralux/api/v1/items")
    .then((response) => response.json())
    .then((data) => {
      this.products = data;
      this.loading = false
    })
    .catch((error) => {
      popup = true;
      error = "Ein Fehler ist aufgetreten!"
      console.error("Error fetching data:", error);
      this.products = [
        {
            "name": "Klinger Galerie T-Shirt",
            "prod_id": "KGT",
            "price": "10",
            "variations": [],
            "colors": ["rot", "grün", "blau", "schwarz", "chili-red", "weiß", "blün", "prosa"],
            "sizes": ["S", "M", "L", "XL", "2XL"],
            "motives": [
                ["1", "Die Blaue Stunde"],
                ["2", "Meeresgötter in Brandung"],
                ["3", "Märztage III"],
                ["4", "Die Gesandtschaft"],
                ["5", "Verführung"],
                ["6", "Der pinkelnde Tod"],
                ["7", "Entführung"]
            ]
        },
        {
                "name": "Highschool Colour Edition",
                "prod_id": "CE",
                "price": "69",
          "colors": ["rot", "grün", "blau"],
                "motives": [],
                "variations": [
                  [
                    "1",
                    "Ultramarine"
                  ],
                  [
                    "2",
                    "Emerald"
                  ]
                ]
              }
        ],
      this.loading = false
    });
    this.loadCurrent();
    this.loadCartFromLocal();
  },
}).mount("body");
