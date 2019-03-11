<template lang="html">
  <div v-bind:class="{'overlay animated-fast fadeIn':visible,'overlay animated-fast fadeOut':!visible}" >
    <div v-bind:class="{'modal-1 animated-fast zoomIn':visible,'modal-1 animated-fast zoomOut':!visible}" style="width: 400px">
      <form class="learn-more-form" @submit.prevent="submitForm">
      <div class="logo-container">
        <img class="small-logo" src="../../img/logo_small_black.png" alt="">
      </div>
      <img class="logo" src="../../img/logo_small_black.png" alt="">
      <div class="login-panel-title">Cancel Subscription</div>
      <div class="modal-inner" style="text-align:center;">
          Are you sure you want to cancel your subscription?  Your account will remain active until your next scheduled billing date.
    </div>
        

    
    <div class="modal-btn-container">
        <div @click="toggleVisible" class="modal-btn cancel">Cancel</div>
    <button class="modal-btn delete" type="submit"><span v-if="!isLoading">Cancel My Subscription</span> <img v-if="isLoading" style="width:25px" src="../../img/spinner_white.svg"/></button>
    <div v-if="hasError" class="alert-danger animated fadeIn" style="color:#ff0000">{{errorMessage}}</div>
    </div>
    
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
      isLoading: false
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
        .post("/api/stripe/cancel_sub", {
          sub_id: this.$store.state.userStore.user.sub_id
        })
        .then(
          res => {
            window.location.reload();
            // this.toggleVisible();
          },
          err => {
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

