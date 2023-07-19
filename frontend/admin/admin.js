Vue.createApp({
    data() {
      return {
        loading: true,
        activePage: 0,
        mode: "view",
        darkmode: false,
        errorPopup: false,
        pages: [
          {
            link: { text: "Admin", url: "index.html" },
            pageTitle: "Admin",
            content:
              "Admin-oberfläche des Merch-Shops!",
          },
          {
            link: { text: `Produkte`, url: "products.html" },
            pageTitle: "Produkte",
            content: "Hier können produkte hinzugefügt, modifiziert und gelöscht werden",
          },
          {
            link: { text: "Buchhaltung", url: "stats.html" },
            pageTitle: "Buchhaltung",
            content: "Hier kann Buchhaltung hin",
          },
          {
            link: { text: "Logout", url: "" },
            pageTitle: "",
            content: "",
          },
        ],
        userSession: localStorage.getItem("session"),
        error: "",
        surely: false,
        products: [],
        editProduct: {},
        product: {
          name: '',
          prod_id: '',
          sizes: [],
          colors: [],
          motives: [],
          variations: []
        },
      };
    },
    methods: {
      adding() {
        this.product = {
          name: '',
          prod_id: '',
          sizes: [],
          colors: [],
          motives: [],
          variations: []
        }
      },
      edit(product) {
        this.mode = "edit"
        this.editProduct = product,
        this.product.name = this.editProduct.name;
        this.product.prod_id = this.editProduct.prod_id;
        this.product.price = this.editProduct.price
        this.product.sizes = this.editProduct.sizes ? this.editProduct.sizes : ""
        this.product.colors = this.editProduct.colors ? this.editProduct.colors : ""
        this.product.variations = this.editProduct.variations ? this.editProduct.variations.map(variation => variation[1]) : [];
        this.product.motives = this.editProduct.motives ? this.editProduct.motives.map(motive => motive[1]) : [];
        return
        fetch('https://frog.lowkey.gay/vyralux/api/v1/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ndc_msg_sig': CryptoJS.HmacSHA256(data, "").toString(CryptoJS.enc.Hex),
            'ndcauth': getCookieValue('sessionToken')
          },
          body: JSON.stringify(data)
        })
        .then(response => {
          console.log(response.status, response.statusText);
          if (response.ok) {}
          return response.json();
          })
          .catch((error) => {
            errorPopup = true;
            console.error("Error fetching data:", error);
          });
      },
    
      modProduct() {
        if (this.mode === 'add') {
          newProduct = {
            name: this.product.name,
            prod_id: this.product.prod_id,
            sizes: this.product.sizes.length ? this.product.sizes.replace(/,(\S)/g, ', $1') : null,
            colors: this.product.colors.length ? this.product.colors.replace(/,(\S)/g, ', $1') : null,
            motives: this.product.motives.length ? this.product.motives.split(/\s*,\s*|\s+/).map((motive, index) => [index + 1, motive]) : null,
            variations: this.product.variations.length ? this.product.variations.split(/\s*,\s*|\s+/).map((variation, index) => [index + 1, variation]) : null
          }
          this.$refs.productForm.reset()
          data = JSON.stringify(newProduct)
          fetch('https://frog.lowkey.gay/vyralux/api/v1/items', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'ndc_msg_sig': CryptoJS.HmacSHA256(data, "").toString(CryptoJS.enc.Hex),
              'ndcauth': getCookieValue('sessionToken')
            },
            body: data
          })
          .then(response => {
            console.log(response.status, response.statusText, response);
          })
          .catch((error) => {
            errorPopup = true;
            console.error("Error fetching data:", error);
          });
        }
        if (this.mode === 'edit') {
          // use the PATCH endpoint
        }
        fetch("https://frog.lowkey.gay/vyralux/api/v1/items")
        .then((response) => response.json())
        .then((data) => {
          this.products = data;
        })
        this.mode === 'view'
      },
      deleteProduct(product) {
        this.editProduct = product
        data = JSON.stringify(this.editProduct)
        fetch('https://frog.lowkey.gay/vyralux/api/v1/items', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'ndc_msg_sig': CryptoJS.HmacSHA256(data, "").toString(CryptoJS.enc.Hex),
            'ndcauth': getCookieValue('sessionToken')
          },
          body: data
        })
        .then(response => {
          console.log(response.status, response.statusText);
            return response
          })
          .catch((error) => {
            errorPopup = true;
            console.error("Error fetching data:", error);
          });
        fetch("https://frog.lowkey.gay/vyralux/api/v1/items")
        .then((response) => response.json())
        .then((data) => {
          this.products = data;
        })
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
      logout() {
          this.activePage = 0
          this.deleteCookies()
          window.location = '../'
      },
      getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
          }
        }
        return null;
      },
      deleteCookies() {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          const cookieName = cookie.split('=')[0];
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      }
    },
    watch: {
      activePage() {
        this.saveCurrent();
        if (this.activePage === 3) {
          this.logout()
        }
      },
      product: {
        deep: true,
        handler() {
          if (this.product.motives.length && this.product.variations.length) {
            this.error = "Ein Produkt kann nicht Variationen und Motive gleichzeitig haben."
          }
          else {
            this.error = ""
          }
        }
      }
    },
    computed: {
    },
    mounted() {
      if (!this.getCookie('sessionToken')) window.location = './login';
      fetch("https://frog.lowkey.gay/vyralux/api/v1/items")
        .then((response) => response.json())
        .then((data) => {
          this.products = data;
          this.loading = false
        })
        .catch((error) => {
          errorPopup = true;
          console.error("Error fetching data:", error);
        });
        this.loadCurrent()
    },
  }).mount("body");
  