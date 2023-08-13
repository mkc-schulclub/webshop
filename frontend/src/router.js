import { createRouter, createWebHistory } from "vue-router";

import Home from "./components/Home/Home.vue";
import Admin from "./components/Admin/Admin.vue";
import Login from "./components/Login.vue";

import store from "./store";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
  },
  {
    path: "/admin/login",
    name: "Login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  ["Home", "Admin", "Login"].forEach((name) => {
    if (to.name === name) {
      store.commit("route", name);
    }
  });
  next();
});

function cookie() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("sessionToken="));
}

router.beforeEach((to, from, next) => {
  if (to.name === "Admin" && !(cookie() ? cookie().split("=")[1] : false)) {
    next("/admin/login");
  } else {
    next();
  }
});

export default router;
