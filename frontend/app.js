Vue.createApp({
    data() {
      return {
        activePage: 0,
        darkmode: false,
        pages: [
          {
            link: { text: 'Home', url: 'index.html' },
            pageTitle: 'Home',
            content: 'Willkommen im online Merch-Shop des Max-Klinger-Schulclubs!'
          },
          {
            link: { text: `Warenkorb`, url: 'cart.html' },
            pageTitle: 'Warenkorb',
            content: 'Hier wird der Warenkorb sein'
          },
          {
            link: { text: 'Contact', url: 'contact.html' },
            pageTitle: 'Contact Page',
            content: 'This is the contact content'
          }
        ],
        products: [],
        cart: [],
      };
    },
    methods: {
      saveCurrent() {
        localStorage.setItem('activePage', JSON.stringify(this.activePage));
      },
      loadCurrent() {
        const page = localStorage.getItem('activePage');
        if (page && page >= 0 && page < this.pages.length) {
          this.activePage = JSON.parse(page);
        } else {
          this.activePage = 0; // Set to the index of the home page as a fallback
        }
      },
      addToCart(product) {
        this.cart.push(product);
        localStorage.setItem('cart', JSON.stringify(this.cart));
      },
      removeFromCart(index) {
          this.cart.splice(index, 1);
          localStorage.setItem('cart', JSON.stringify(this.cart));
      },
      loadCartFromLocal() {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
          this.cart = JSON.parse(cartData);
        }
      }
    },
    watch: {
      activePage() {
        this.saveCurrent();
      },
    },
    mounted() {
      fetch('http://frog.lowkey.gay/vyralux/api/v1/items')
        .then(response => response.json())
        .then(data => {
          this.products = data;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
      this.loadCurrent()
      this.loadCartFromLocal();
    }
  }).mount('body');