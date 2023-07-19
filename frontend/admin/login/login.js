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
            return response.json();
          } else {
            this.errorMessage = 'Login fehlgeschlagen!'
            throw new Error('Login failed');
          }
        })
        .then(data => {
          const { sid } = data;
          if (sid) {
            const expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + 24 * 60 * 60 * 1000);
            document.cookie = `sessionToken=${sid}; expires=${expirationDate.toUTCString()}; path=/; secure`;
            window.location.href = "../";
          }
          else console.error('No session token generated')
        })
        .catch(error => {
          this.errorMessage = 'Login fehlgeschlagen!';
          console.error("Error fetching data:", error);
        });
      }, 
  }
  }).mount("body");