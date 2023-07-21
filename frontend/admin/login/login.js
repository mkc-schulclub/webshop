Vue.createApp({
  data() {
    return {
      username: "",
      password: "",
      errorMessage: ""
    }
  },
  methods: {
    getCookieValue(name) {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
          return cookie.substring(name.length + 1);
        }
      }
      return null;
    },
    login(username, password) {
      let key;
      data = {
        "name": username,
        "password": password
      }
      fetch('https://frog.lowkey.gay/vyralux/api/v1/key', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        key = CryptoJS.SHA256(data["keyBase"]).toString(CryptoJS.enc.Hex)
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + 24 * 60 * 60 * 1000);
        document.cookie = `key=${key}; expires=${expirationDate.toUTCString()}; path=/; secure`;
      })
      .then(
        fetch('https://frog.lowkey.gay/vyralux/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'hjtrfs': CryptoJS.HmacSHA256(JSON.stringify(data), this.getCookieValue("key")).toString(CryptoJS.enc.Hex),
        },
        body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
          const { sid } = data;
          if (sid) {
            const expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + 24 * 60 * 60 * 1000);
            document.cookie = `sessionToken=${sid}; expires=${expirationDate.toUTCString()}; path=/; secure`;
            this.activePage = 0
            window.location.href = "../";
          }
          else console.error('No session token generated'); this.errorMessage = 'Bitte nochmal versuchen!'
        })
        .catch(error => {
          this.errorMessage = 'Login fehlgeschlagen!';
          console.error("Error fetching data:", error);
        })
      )
    }, 
  }
}).mount("body");