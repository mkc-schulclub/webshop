<template>
  <div id="app" class="container mt-5">
    <h1 class="mb-4">Login zur Admin-Oberfläche für Schulclub-Mitglieder</h1>
    <form @submit.prevent="login(username, password)">
      <div class="form-group">
        <label for="username">Username:</label>
        <input
          id="username"
          type="text"
          class="form-control"
          v-model="username"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Passwort:</label>
        <input
          id="password"
          type="password"
          class="form-control"
          v-model="password"
          required
        />
      </div>
      <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import CryptoJS from "crypto-js";

export default {
  setup() {
    const router = useRouter();
    return {
      router,
    };
  },
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    getCookieValue(name) {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
          return cookie.substring(name.length + 1);
        }
      }
      return null;
    },
    login(username, password) {
      let key;
      const userAuth = {
        name: username,
        password: password,
      };
      fetch("https://frog.lowkey.gay/vyralux/api/v1/key", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          key = CryptoJS.SHA256(data["keyBase"]).toString(CryptoJS.enc.Hex);
          const expirationDate = new Date();
          expirationDate.setTime(
            expirationDate.getTime() + 24 * 60 * 60 * 1000
          );
          document.cookie = `key=${key}; expires=${expirationDate.toUTCString()}; path=/; SameSite=None; secure`;

          return fetch("https://frog.lowkey.gay/vyralux/api/v1/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              hjtrfs: CryptoJS.HmacSHA256(
                JSON.stringify(userAuth),
                this.getCookieValue("key")
              ).toString(CryptoJS.enc.Hex),
            },
            body: JSON.stringify(userAuth),
          });
        })
        .then((response) => response.json())
        .then((data) => {
          const { sid } = data;
          if (sid) {
            const expirationDate = new Date();
            expirationDate.setTime(
              expirationDate.getTime() + 24 * 60 * 60 * 1000
            );
            document.cookie = `sessionToken=${sid}; expiress=${expirationDate.toUTCString()}; path=/; SameSite=None; secure`;
            this.router.push("/admin");
          } else {
            console.error("No session token generated");
            this.errorMessage = "Bitte nochmal versuchen!";
          }
        })
        .catch((error) => {
          this.errorMessage = "Login fehlgeschlagen!";
          console.error("Error fetching data:", error);
        });
    },
  },
};
</script>

<style>
@import "bootstrap/dist/css/bootstrap.css";
</style>
