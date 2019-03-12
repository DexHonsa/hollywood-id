<template>
  <div>
    <div
      class="net"
      :style="'background-image:url('+require('../../img/hollywood_blue_blur.jpg')+')'"
    ></div>
    <div class="container">
      <div
        class="search-panel animated-med fadeInUp"
        style="background:transparent;text-align:center; white-space:pre-wrap; padding-top:120px; color:#000;"
      >
        <div style="display:flex;justify-content:center; margin-bottom:100px;">
          <div style="width:500px; position:relative">
            <img style="width:100%; height:auto" src="../../img/logo_black.png" alt>
          </div>
        </div>
        <h1 align="center">Contact Us</h1>
        <div style="width:100%; max-width:500px; display:inline-block; position:relative;">
          <form @submit.prevent="submitForm">
            <input
              type="text"
              field="Name"
              placeholder="Full Name"
              class="standard-input"
              name="name"
              v-validate="'required'"
              v-model="name"
              width="100%"
            >
            <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
            <input
              type="text"
              field="Email"
              class="standard-input"
              placeholder="Email"
              name="email"
              v-validate="'required'"
              width="100%"
              v-model="email"
            >
            <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
            <textarea
              name="message"
              class="standard-input"
              placeholder="message"
              v-validate="'required'"
              id="message"
              cols="30"
              rows="10"
              v-model="message"
            ></textarea>
            <span
              v-show="errors.has('message')"
              class="help is-danger"
            >{{ errors.first('message') }}</span>
            <button
              type="submit"
              style="width:100%; margin-left:0"
              class="modal-btn confirm"
            >Send Message</button>
            <span v-if="success" class="help is-danger" style="color:#33aa44">{{ successMessage }}</span>
            <span
              v-if="error"
              class="help is-danger"
            >There was an error sending your message. Please try again.</span>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import StandardInput from "../form_elements/standard_input";
import axios from "axios";

export default {
  name: "contact_us",
  $_veeValidate: {
    validator: "new" // give me a new validator each time.
  },
  data() {
    return {
      name: "",
      email: "",
      message: "",
      success: false,
      error: false,
      successMessage: "Your message was sent successfully!"
    };
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    submitForm() {
      this.$validator.validateAll().then(result => {
        if (!result) {
          this.isLoading = false;
          return;
        }
        if (!this.errors.any()) {
          var obj = {
            name: this.name,
            email: this.email,
            message: this.message
          };
          axios.post("/api/contact_us", obj).then(
            res => {
              this.success = true;
            },
            err => {
              this.error = true;
            }
          );
        }
      });
    }
  },
  components: {
    StandardInput
  }
};
</script>