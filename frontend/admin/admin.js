Vue.createApp({
    data() {
      return {
        activePage: 0,
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
        error: "",
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
      test() {
        this.editProduct = {
          "name": "Klinger Galerie T-Shirt",
          "prod_id": "KGT",
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
        }
        this.product.name = this.editProduct.name;
        this.product.prod_id = this.editProduct.prod_id;
        this.product.sizes = this.editProduct.sizes ? this.editProduct.sizes : ""
        this.product.colors = this.editProduct.colors ? this.editProduct.colors : ""
        this.product.variations = this.editProduct.variations ? this.editProduct.variations.map(variation => variation[1]) : [];
        this.product.motives = this.editProduct.motives ? this.editProduct.motives.map(motive => motive[1]) : [];
      },
    
      addProduct() {
        newProduct = {
          name: this.product.name,
          prod_id: this.product.prod_id,
          sizes: this.product.sizes.length ? this.product.sizes.replace(/,(\S)/g, ', $1') : null,
          colors: this.product.colors.length ? this.product.colors.replace(/,(\S)/g, ', $1') : null,
          motives: this.product.motives.length ? this.product.motives.split(/\s*,\s*|\s+/).map((motive, index) => [index + 1, motive]) : null,
          variations: this.product.variations.length ? this.product.variations.split(/\s*,\s*|\s+/).map((variation, index) => [index + 1, variation]) : null
        }
        this.$refs.productForm.reset()
        console.log(newProduct)
        // send to backend, get response and tell admin the result
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
    },
    watch: {
      activePage() {
        this.saveCurrent();
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
      fetch("https://frog.lowkey.gay/vyralux/api/v1/items")
        .then((response) => response.json())
        .then((data) => {
          this.products = data;
        })
        .catch((error) => {
          errorPopup = true;
          console.error("Error fetching data:", error);
        });
        this.loadCurrent()
    },
  }).mount("body");
  