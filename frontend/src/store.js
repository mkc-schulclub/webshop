import { createStore } from "vuex";

const store = createStore({
  state: {
    darkMode: false,
    loading: false,
    activePage: 0,
    cartCount: 0,
    route: "Home",
    pages: [],
    products: [],
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
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", state.darkMode);
    },
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
    getDarkMode(state, data) {
      state.darkMode = data;
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
    getDarkMode({ commit }) {
      commit("getDarkMode", eval(localStorage.getItem("darkMode")));
    },
    getCart({ commit }) {
      const data = localStorage.getItem("cart");
      if (data) {
        commit("getLocalCart", JSON.parse(data));
      }
    },
    setActivePage(context, page) {
      context.commit("setActivePage", page);
    },
    fetchProducts(context) {
      setTimeout(() => {
        console.log(context.state.products.length)
        if (context.state.products.length === 0) {
          context.commit('setPopup', { title: "Ein Fehler ist aufgetreten", message: '', isVisible: true })
          setTimeout(() => {
            if (context.state.popup.isVisible === true) {
              location.reload()
            }
          }, 2500);
        }
      }, 5000);
      context.commit("Loading");
      fetch("https://frog.lowkey.gay/vyralux/api/v1/items")
        .then((response) => response.json())
        .then((data) => {
          context.commit("fetchProducts", data);
          context.commit("notLoading");
        });
    },
  },
});

export default store;
