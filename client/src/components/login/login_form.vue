<template lang="html">
  <div class="overlay animated-fast " :class="{'fadeIn':visible,'fadeOut':!visible}" >
    <div class="modal-1 animated-fast " :class="{'zoomIn':visible,'zoomOut':!visible}" style="width: 400px">
      <form v-if="!newPasswordEntry" class="login-form" @submit.prevent="submitForm">
      <div class="logo-container">
        <img class="small-logo" src="../../img/logo_black.png" alt="">
      </div>
      <img class="logo" src="../../img/logo_small_black.png" alt="">
      <div class="login-panel-title"></div>
        <div class="login-box-input-item">
          <div class="login-box-input-icon"><i class="fal fa-user-circle" /></div>
            <input type="text" id="email" name="email" placeholder="Email" v-model="email" class="css-login-input-input" />
        </div>
    <div class="login-box-input-item">
          <div class="login-box-input-icon"><i class="fal fa-lock" /></div>
            <input type="password" id="password" name="password" placeholder="Password" class="css-login-input-input" />
        </div>
    
    <div class="modal-btn-container">
        <div @click="toggleVisible" class="modal-btn cancel">Cancel</div>
    <button class="modal-btn confirm" type="submit"><span v-if="!isLoading">Login</span> <img v-if="isLoading" style="width:25px" src="../../img/spinner_white.svg"/></button>
    
    </div>
    <div v-if="hasError" class="alert-danger animated fadeIn animate-fix" style="color:#ff0000; text-align:center; clear:both">{{errorMessage}}</div>
    <div v-if="hasForgotPassword" class="alert-danger animated fadeIn animate-fix" style="color:#ff0000; text-align:center; clear:both">{{forgotPasswordMessage}}</div>
    <div @click="forgotPassword" class="forgot-password">Forgot Password?</div>
    </form>

     <form v-if="newPasswordEntry" class="login-form" @submit.prevent="submitNewPassword">
      <div class="logo-container">
        <img class="small-logo" src="../../img/logo_black.png" alt="">
      </div>
      <img class="logo" src="../../img/logo_small_black.png" alt="">
      <div class="login-panel-title"></div>
        
    <div class="login-box-input-item">
          <div class="login-box-input-icon"><i class="fal fa-lock" /></div>
            <input type="password" id="password" name="new_password" v-model="newPassword" placeholder="New Password" class="css-login-input-input" />
        </div>
    
    <div class="modal-btn-container">
        
    <button class="modal-btn confirm" type="submit"><span v-if="!newPasswordLoading">Login</span> <img v-if="newPasswordLoading" style="width:25px" src="../../img/spinner_white.svg"/></button>
    
    </div>
    <div v-if="hasError" class="alert-danger animated fadeIn animate-fix" style="color:#ff0000; text-align:center; clear:both">{{errorMessage}}</div>
    <div v-if="hasForgotPassword" class="alert-danger animated fadeIn animate-fix" style="color:#ff0000; text-align:center; clear:both">{{forgotPasswordMessage}}</div>
    
    </form>
    </div>
    </div>
</template>
<script>
import axios from "axios";
import auth from "../../auth";
export default {
  name: "login_form",
  props: ["hide", "login"],
  data() {
    return {
      visible: true,
      hasError: false,
      email: "",
      newPassword: "",
      isLoading: false,
      errorMessage: "",
      forgotPasswordMessage: "",
      hasForgotPassword: false,
      newPasswordEntry: false,
      newPasswordLoading: false
    };
  },
  $_veeValidate: {
    validator: "new" // give me a new validator each time.
  },
  methods: {
    forgotPassword() {
      this.hasForgotPassword = false;
      if (this.email == "") {
        this.hasForgotPassword = true;
        this.forgotPasswordMessage =
          "Please enter your email and click forgot password";
      } else {
        axios
          .post("/api/auth/reset_password", { email: this.email })
          .then(() => {
            this.hasForgotPassword = true;
            this.forgotPasswordMessage =
              "Instructions have been sent to your email";
          });
      }
    },
    toggleVisible() {
      var that = this;
      this.visible = false;
      setTimeout(function() {
        that.hide();
      }, 300);
    },
    submitForm(event) {
      this.isLoading = true;
      var form = event.target;
      var data = new FormData(form);
      data = data.entries();
      var obj = data.next();
      var retrieved = {};

      while (undefined !== obj.value) {
        retrieved[obj.value[0]] = obj.value[1];
        obj = data.next();
      }
      this.$validator.validateAll().then(result => {
        if (!result) {
          this.isLoading = false;
          return;
        }
        if (!this.errors.any()) {
          axios.post("/api/auth", retrieved).then(
            res => {
              auth.login(retrieved).then(res => {
                // console.log(res);
                this.newPasswordEntry = true;
              });
            },
            err => {
              this.isLoading = false;
              //console.log(err.response);
              this.hasError = true;
              this.errorMessage = err.response.data.error;
            }
          );
        }
      });
    },
    submitNewPassword() {
      this.newPasswordLoading = true;

      axios
        .post("/api/auth/new_password", {
          id: this.$store.state.userStore.user.id,
          password: this.newPassword
        })
        .then(
          res => {
            auth
              .relogin({ email: this.email, password: this.newPassword })
              .then(res => {});
          },
          err => {
            this.isLoading = false;
            this.hasError = true;
            this.errorMessage = err.response.data.error;
          }
        );
    }
  }
};
</script>
