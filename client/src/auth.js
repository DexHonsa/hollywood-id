import axios from "axios";
import router from "./router";
//import config from "./config.json";
import jwt_decode from "jwt-decode";
import { store } from "./store/store.js";
export default {
  user: {
    authenticated: false
  },
  login(creds) {
    return new Promise((resolve, reject) => {
      axios.post("/api/auth", creds).then(
        res => {
          localStorage.setItem("token", res.data.token);
          this.user.authenticated = true;
          
          var decoded = jwt_decode(res.data.token);
          store.dispatch("setUser", decoded);
          
          // console.log(decoded);
          if(decoded.password_reset != null && decoded.password_reset == true){
            resolve(decoded);
            // console.log('reset-pw')
          }else{
             window.location.reload();
          }
          
        },
        err => {
          reject(err);
        }
      );
    });
  },
  relogin(creds) {
    localStorage.removeItem("token");
    // this.user.authenticated = false;
    store.dispatch("setUser", {});

    return new Promise((resolve, reject) => {
      axios.post("/api/auth", creds).then(
        res => {
          localStorage.setItem("token", res.data.token);
          this.user.authenticated = true;
          
          var decoded = jwt_decode(res.data.token);
          store.dispatch("setUser", decoded);
          resolve(decoded);
          window.location.reload();
        },
        err => {
          reject(err);
        }
      );
    });
  },
  getUser(userId) {
    return new Promise((resolve, reject) => {
      // console.log('getting user');
      axios.get("/api/users/user/" + userId).then(
        res => {
          localStorage.setItem("token", res.data.token);
           this.user.authenticated = true;
          
          var decoded = jwt_decode(res.data.token);
          store.dispatch("setUser", decoded);
          resolve(decoded);
          window.location.reload();
        },
        err => {
          reject(err);
        }
      );
    });
  },
  getHeaders() {
    var token = localStorage.getItem("token");
    var headers = {
      Accept: "application/json",
      Authorization: "Bearer " + token
    };
    return headers;
  },
  checkAuth() {
    var jwt = localStorage.getItem("token");
    if (jwt) {
      this.user.authenticated = true;
    } else {
      this.user.authenticated = false;
    }
  },
  logout() {
    localStorage.removeItem("token");
    this.user.authenticated = false;
    store.dispatch("setUser", {});
    window.location.reload();
  }
};
