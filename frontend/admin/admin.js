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
              "Admin-oberfläche online Merch-Shop des Max-Klinger-Schulclubs!",
          },
          {
            link: { text: `Produkte`, url: "products.html" },
            pageTitle: "Produkte",
            content: "Hier können produkte hinzugefügt, modifiziert und gelöscht werden",
          },
          {
            link: { text: "Zeug", url: "other.html" },
            pageTitle: "Zeug",
            content: "Hier kann anderes Zeug hin",
          },
        ],
        products: [],
      };
    },
    methods: {
    },
    watch: {
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
    },
  }).mount("body");
  