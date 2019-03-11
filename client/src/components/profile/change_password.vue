<template lang="html">
  <div v-bind:class="{'overlay animated-fast fadeIn':visible,'overlay animated-fast fadeOut':!visible}" >
    <div v-bind:class="{'modal-1 animated-fast zoomIn':visible,'modal-1 animated-fast zoomOut':!visible}" style="width: 400px">
      <form class="learn-more-form" @submit.prevent="submitForm">
      <div class="logo-container">
        <img class="small-logo" src="../../img/logo_small_black.png" alt="">
      </div>
      <img class="logo" src="../../img/logo_small_black.png" alt="">
      <div class="login-panel-title">Change Your Password</div>
      <div class="modal-inner" style="text-align:center;">
          <input type="password" v-model="password" class="standard-input" placeholder="Current Password">
          <input type="password" v-model="newPassword" class="standard-input" placeholder="New Password">
     </div>
        

    
    <div class="modal-btn-container">
        <div @click="toggleVisible" class="modal-btn cancel">Cancel</div>
    <button class="modal-btn delete" type="submit"><span v-if="!isLoading">Change Password</span> <img v-if="isLoading" style="width:25px" src="../../img/spinner_white.svg"/></button>
    
    </div>
    <div v-if="hasError" class="alert-danger animated fadeIn" style="color:#ff0000">{{errorMessage}}</div>
    <div v-if="hasSuccess" class="alert-danger animated fadeIn" style="color:#00aa55; background:#00aa5555">{{successMessage}}</div>
    
    </form>
    </div>
    </div>
</template>
<script>
import axios from "axios";
export default {
  name: "cancel_sub",
  props: ["hide", "del"],
  data() {
    return {
      visible: true,
      hasError: false,
      isLoading: false,
      password: "",
      newPassword: "",
      hasSuccess: false,
      successMessage: ""
    };
  },
  $_veeValidate: {
    validator: "new" // give me a new validator each time.
  },
  methods: {
    toggleVisible() {
      var that = this;
      this.visible = false;
      setTimeout(function() {
        that.hide();
      }, 300);
    },
    submitForm() {
      this.isLoading = true;
      this.hasSuccess = false;
      this.hasError = false;
      axios
        .post("/api/auth/change_password", {
          id: this.$store.state.userStore.user.id,
          password: this.password,
          newPassword: this.newPassword
        })
        .then(
          res => {
            this.isLoading = false;
            //window.location.reload();
            console.log(res.data);
            this.hasSuccess = true;
            this.successMessage = res.data.message;
            //this.toggleVisible();
          },
          err => {
            this.hasError = true;
            this.errorMessage = err.response.data.message;
            this.isLoading = false;
          }
        );
    }
  }
};
</script>
<style>
.learn-more-form {
  width: 100%;
  padding: 15px 15px;
  padding-top: 45px;
  overflow: hidden;
  color: #000;
}
.alert-danger {
  white-space: nowrap;
  margin-top: 65px;
}
</style>

