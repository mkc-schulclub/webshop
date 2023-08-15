import { createRouter, createWebHistory } from "vue-router";

import store from "./store";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import( './components/Home/Home.vue'),
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import( './components/Admin/Admin.vue'),
  },
  {
    path: "/admin/login",
    name: "Login",
    component: () => import( './components/Login.vue'),
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