<template lang="html">
  <div v-bind:class="{'overlay animated-fast fadeIn':visible,'overlay animated-fast fadeOut':!visible}" >
    <div v-bind:class="{'modal-1 animated-fast zoomIn':visible,'modal-1 animated-fast zoomOut':!visible}" style="width: 400px">
      <form class="learn-more-form" @submit.prevent="submitForm">
      <div class="login-panel-title">Add New User</div>
      <div class="modal-inner" style="text-align:center;">
          <input v-model="email" type="text" class="standard-input" name="email" placeholder="Enter Email">
          <p>An email will be sent with login instructions.</p>
     </div>
        

    
    <div class="modal-btn-container">
        <div @click="toggleVisible" class="modal-btn cancel">Cancel</div>
    <button class="modal-btn confirm" type="submit"><span v-if="!isLoading">Add User</span> <img v-if="isLoading" style="width:25px" src="../../img/spinner_white.svg"/></button>
    
    </div>
    <div v-if="hasError" class="alert-danger animated fadeIn" style="color:#ff0000; position:relative; margin-top:70px;">{{errorMessage}}</div>
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
      errorMessage: "",
      email: ""
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
      axios
        .post("/api/users/add_new_user", {
          email: this.email
        })
        .then(
          res => {
            this.hide();
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
</style>

