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
            content: ''
          },
          {
            link: { text: 'Schulclub', url: 'contact.html' },
            pageTitle: 'Max-Klinger-Schulclub',
            content: 'Hier kann anderes Zeug hin'
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
          this.activePage = 0;
        }
      },
      addToCart(product) {
        const selectedItem = {
          name: product.name,
          prod_id: product.prod_id,
          size: product.selectedSize ? product.selectedSize : null,
          color: product.selectedColor ? product.selectedColor : null,
          motive: product.selectedMotive ? {
            [product.selectedMotive[0]]: product.selectedMotive[1]
          } : null,
          variation: product.selectedVariation ? {
            [product.selectedVariation[0]]: product.selectedVariation[1]
          } : null,
          price: product.price,
          quantity: 1
        };
        const existingItemIndex = this.cart.findIndex((item) => {
          return (
            item.name === selectedItem.name &&
            item.size === selectedItem.size &&
            item.color === selectedItem.color &&
            JSON.stringify(item.motive) === JSON.stringify(selectedItem.motive) &&
            JSON.stringify(item.variation) === JSON.stringify(selectedItem.variation)
          );
        });
        if (existingItemIndex !== -1) {
          this.cart[existingItemIndex].quantity++;
        } else {
          selectedItem.quantity = 1;
          this.cart.push(selectedItem);
        }
        localStorage.setItem('cart', JSON.stringify(this.cart));
        console.log(localStorage.getItem('cart'));
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
      },
      submitCart() {
        const url = 'http://frog.lowkey.gay/vyralux/api/v1/order';
        const options = {
          method: 'POST',
          headers: 
            new Headers({'content-type': 'application/json'}),
          body: localStorage.getItem('cart')
        };
        fetch(url, options)
          .then(response => response.json())
          .then(data => {
            console.log(data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
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