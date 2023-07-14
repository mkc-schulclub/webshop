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
    mounted() {
      this.loadCartFromLocal();
      fetch('http://frog.lowkey.gay/vyralux/api/v1/items')
        .then(response => response.json())
        .then(data => {
          this.products = data;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }).mount('body');