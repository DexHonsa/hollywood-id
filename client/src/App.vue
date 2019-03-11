<template>
  <div id="app">
    <router-view name="header"></router-view>
    <router-view name="login"></router-view>

    <router-view></router-view>
    <router-view name="footer"></router-view>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import jwtDecode from "jwt-decode";

export default {
  name: "App",

  methods: {
    ...mapActions(["setToken", "setUser"])
  },
  created() {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("hey");
      this.setToken(token);
    } else {
      console.log("ho");
      this.$router.push("/");
    }
  },
  mounted() {
    const token = localStorage.getItem("token");
    if (token) {
      // this.setToken(token);
      // this.setUser(decode(token));
    } else {
      this.$router.push("/");
    }
  },
  computed: {
    path() {
      return this.$route.path;
    }
  },
  watch: {
    path(val) {
      if (val != "/") {
        if (val.indexOf("result") > 0) {
          if (
            localStorage.getItem("token") != null &&
            jwtDecode(localStorage.getItem("token")).is_active
          ) {
            return;
          } else {
            this.$router.push("/paywall");
          }
        }
      }
    }
  }
};
</script>
