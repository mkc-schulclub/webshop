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
        products: [],
      };
    },
    methods: {
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
    },
    computed: {
    },
    mounted() {
      fetch("http://frog.lowkey.gay/vyralux/api/v1/items")
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
  