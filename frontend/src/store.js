import { createStore } from "vuex";

const store = createStore({
  state: {
    loading: false,
    activePage: 0,
    cartCount: 0,
    route: "Home",
    pages: [],
    products: null,
    cart: [],
    popup: {
      title: "",
      message: "",
      isVisible: false,
    },
  },
  getters: {
    pages(state) {
      if (state.route === "Home") {
        return [
          {
            pageTitle: "Home",
            content:
              "Willkommen im online Merch-Shop des Max-Klinger-Schulclubs!",
          },
          {
            pageTitle: "Warenkorb",
            content: "",
          },
          {
            pageTitle: "Max-Klinger-Schulclub",
            content: "",
          },
        ];
      } else if (state.route === "Admin") {
        return [
          {
            pageTitle: "Admin",
            content: "Willkommen im Admin-interface des MKC-Webshops!",
          },
          {
            pageTitle: "Produkte",
            content:
              "Hier können Produkte hinzugefügt, bearbeitet und gelöscht werden",
          },
          {
            pageTitle: "Buchhaltung",
            content: "Hier kommt Buchhaltung Zeug hin",
          },
          {
            pageTitle: "Logout",
            content:
              "Wieso bist du noch hier? Hat der Logout nicht funktioniert?",
          },
        ];
      } else if (state.route === "Login") {
        return [
          {
            pageTitle: "",
            content: "",
          },
        ];
      } else {
        return null;
      }
    },
    ifLoading(state) {
      return state.loading;
    },
    cartItemCount(state) {
      let totalAmount = 0;
      for (const item of state.cart) {
        totalAmount += item.amount;
      }
      return totalAmount;
    },
    popup(state) {
      return state.popup;
    },
  },
  mutations: {
    route(state, name) {
      state.activePage = 0;
      state.route = name;
  },
    Loading(state, value) {
      state.loading = true;
    },
    notLoading(state, value) {
      state.loading = false;
    },
    getLocalCart(state, data) {
      state.cart = data;
    },
    setActivePage(state, page) {
      state.activePage = page;
    },
    fetchProducts(state, data) {
      state.products = data;
    },
    setPopup(state, { title, message, isVisible }) {
      state.popup.title = title;
      state.popup.message = message;
      state.popup.isVisible = isVisible;
    },
    closePopup(state) {
      state.popup.isVisible = false;
    },
  },
  actions: {
    getCart({ commit }) {
      const data = localStorage.getItem("cart");
      if (data) {
        commit("getLocalCart", JSON.parse(data));
      }
    },
    setActivePage(context, page) {
      context.commit("setActivePage", page);
    },
    async fetchProducts(context) {
      context.commit("Loading");
      context.commit("fetchProducts", [
        {
          name: "Klinger Galerie T-Shirt",
          prod_id: "KGT",
          price: "10",
          variations: [],
          colors: [
            "rot",
            "grün",
            "blau",
            "schwarz",
            "chili-red",
            "weiß",
            "blün",
            "prosa",
          ],
          sizes: ["S", "M", "L", "XL", "2XL"],
          motives: [
            ["1", "Die Blaue Stunde"],
            ["2", "Meeresgötter in Brandung"],
            ["3", "Märztage III"],
            ["4", "Die Gesandtschaft"],
            ["5", "Verführung"],
            ["6", "Der pinkelnde Tod"],
            ["7", "Entführung"],
          ],
        },
        {
          name: "Highschool Colour Edition",
          prod_id: "CE",
          price: "69",
          colors: ["rot", "grün", "blau", "deez"],
          motives: [],
          variations: [
            ["1", "Ultramarine"],
            ["2", "Emerald"],
          ],
        },
      ]);
      context.commit("notLoading");
      /* try {
          const response = await fetch('your-api-endpoint');
          const data = await response.json();
          context.commit('fetchProducts', data);
        } catch (error) {
          console.error('Error fetching data:', error);
        } */
    },
  },
});

export default store;
