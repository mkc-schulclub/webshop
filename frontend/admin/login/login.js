Vue.createApp({
  data() {
    return {
      username: "",
      password: "",
      errorMessage: ""
    }
  },
  methods: {
    login(username, password) {
      data = {
        "name": username,
        "password": password
      }
      fetch('https://frog.lowkey.gay/vyralux/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ndc_msg_sig': CryptoJS.HmacSHA256(JSON.stringify(data), "").toString(CryptoJS.enc.Hex),
        },
        body: JSON.stringify(data)
        })
        .then(response => {
          console.log(response.status, response.statusText);
          if (response.ok) {
            return response.json(); // Parse response as JSON
          } else {
            throw new Error('Login failed'); // Throw error for failed login
          }
        })
        .then(data => {
          const { sid } = data;
          const expirationDate = new Date();
          expirationDate.setTime(expirationDate.getTime() + 24 * 60 * 60 * 1000);
          if (sid) document.cookie = `sessionToken=${sid}; expires=${expirationDate.toUTCString()}; path=/; secure`;
          console.log(sid);
          window.location.href = "../";
        })
        .catch(error => {
          this.errorMessage = 'Login failed!';
          console.error("Error fetching data:", error);
        });
      }, 
  }
  }).mount("body");