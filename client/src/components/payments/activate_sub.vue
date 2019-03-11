<template>
  <div>
    <div
      class="net"
      :style="'background-image:url('+require('../../img/hollywood_blue_blur.jpg')+')'"
    ></div>
    <div class="container">
      <div class="search-panel animated-med fadeInUp">
        <div class="search-panel-top">
          <div
            class="search-panel-title"
            style="margin-bottom:0; padding-bottom:0;"
          >Activate Subscription</div>
        </div>
        <div class="search-panel-content">
          <form class="form" @submit.prevent="submitForm">
            <div class="tab-container">
              <div class="tab" :class="{'active':tab == 0}">
                <i v-if="tab > 0" class="fa fa-check-circle animated zoomIn"></i> Payment Details
                <div class="bottom-bar"></div>
              </div>
              <div class="tab-divider">
                <i class="fal fa-angle-right"></i>
              </div>
              <div class="tab" :class="{'active':tab == 1}">
                <i v-if="tab > 1" class="fa fa-check-circle animated zoomIn"></i> Confirmation
                <div class="bottom-bar"></div>
              </div>
            </div>
            <transition
              enter-active-class="fadeInRight"
              leave-active-class="fadeOutLeft"
              mode="out-in"
            >
              <div
                :key="0"
                v-if="tab == 0"
                class="result-content animated-fast"
                style="display:inline-block"
              >
                <div
                  class="instructions"
                >Please enter your card information. Do not click the back button once verification has begun.</div>
                <div id="card-element"></div>
                <div id="card-errors" role="alert"></div>
                <div class="button-container">
                  <div @click="verifyPayment" class="modal-btn confirm">
                    <span v-if="!isLoading">Verify Payment</span>
                    <img v-if="isLoading" style="width:25px" src="../../img/spinner_white.svg">
                  </div>
                </div>
              </div>

              <div
                :key="1"
                v-if="tab == 1"
                class="result-content animated-fast"
                style="display:inline-block"
              >
                <div
                  v-for="(item, index) in Object.keys(confirmObj)"
                  :key="index"
                  class="result-content-item"
                  v-if="index < 3"
                >
                  <div class="result-content-item-title">{{item}}</div>
                  <div class="result-content-item-value">
                    <span v-if="item != 'plan'">{{confirmObj[item]}}</span>
                    <span v-else>
                      <span v-if="confirmObj[item] == 'm'">$9.99 Monthly</span>
                      <span v-if="confirmObj[item] == 'y'">$99.99 Yearly</span>
                      <span
                        @click="switchPlan"
                        style="color:#3080e8; cursor:pointer; font-size: 9pt; margin-left: 15px; user-select:none"
                      >(switch)</span>
                    </span>
                  </div>
                </div>
                <div
                  v-if="hasError"
                  class="is-danger"
                  style="margin-top:10px; font-size:10pt; text-align:right;"
                >
                  <i class="fal fa-exclamation-triangle"></i>
                  {{errorMessage}}
                </div>
                <div class="button-container">
                  <div @click="processPayment" class="modal-btn confirm">
                    <span v-if="!isLoading && !isComplete">Complete Purchase</span>
                    <img
                      v-if="isLoading && !isComplete"
                      style="width:25px"
                      src="../../img/spinner_white.svg"
                    >
                    <i v-if="isComplete" class="fa fa-check-circle"></i>
                  </div>
                </div>
              </div>
            </transition>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import StandardInput from "../form_elements/standard_input.2";
import axios from "axios";
import { mapActions } from "vuex";
import auth from "../../auth";

export default {
  name: "setup",
  data() {
    return {
      first_name: this.$store.state.userStore.user.first_name,
      last_name: this.$store.state.userStore.user.last_name,
      user_id: this.$store.state.userStore.user.id,
      email: this.$store.state.userStore.user.email,
      password: "",
      isLoading: false,
      selectedSub: "y",
      tab: 0,
      phoneValue: 0,
      formattedPhoneValue: "",
      preventNextIteration: false,
      addListing: false,
      card: "",
      confirmObj: {},
      token: "",
      isComplete: false,
      hasError: false,
      errorMessage: ""
    };
  },
  $_veeValidate: {
    validator: "new" // give me a new validator each time.
  },
  mounted() {
    setTimeout(() => {
      this.createCCForm();
    }, 300);

    // if (this.$store.state.userStore.user.id != null) {
    //   this.$router.push("/search");
    // }
  },
  methods: {
    switchPlan() {
      if (this.$route.query.sub == "m") {
        this.$router.push("/activate_sub?sub=y");
        this.confirmObj.plan = "y";
      } else {
        this.$router.push("/activate_sub?sub=m");
        this.confirmObj.plan = "m";
      }
    },
    verifyPayment() {
      this.isLoading = true;
      this.stripe.createToken(this.card).then(result => {
        if (result.error) {
          this.isLoading = false;
          var errorElement = document.getElementById("card-errors");
          errorElement.textContent = result.error.message;
        } else {
          this.confirmObj = {
            email: this.email,
            name: this.first_name + " " + this.last_name,
            plan: this.$route.query.sub,
            token: result.token
          };
          this.isLoading = false;
          this.tab = this.tab + 1;
        }
      });
    },
    processPayment() {
      this.isLoading = true;
      axios.post("/api/stripe/setup_account", this.confirmObj).then(res => {
        var cus_id = res.data.customer;
        var sub_id = res.data.id;
        // console.log(res.data);

        axios
          .patch("/api/auth/edit/" + this.user_id, {
            //email: this.email,
            sub_id,
            cus_id,
            //password: this.password,
            //first_name: this.first_name,
            //last_name: this.last_name,
            is_active: true
          })
          .then(
            res => {
              this.isLoading = false;
              this.isComplete = true;
              axios
                .post("/api/auth/welcome", {
                  email: this.email,
                  sub: this.selectedSub
                })
                .then(() => {
                  this.$router.push("/profile");
                });
            },
            err => {
              this.isLoading = false;
              console.log("error");
              this.isLoading = false;
              this.hasError = true;
              this.errorMessage = err.response.data.error;
            }
          );
        // setTimeout(() => {
        //   this.$router.push("/search");
        // }, 3000);
        // this.tab = this.tab + 1;
        // this.confirmObj = res.data;
      });
    },
    next() {},
    createCCForm() {
      var elements = this.stripe.elements();
      var style = {
        empty: {
          background: "#5d9bb2"
        },
        base: {
          background: "#fff",
          color: "#5d9bb2",
          lineHeight: "25px",
          padding: "10px",
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#5d9bb2"
          }
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a"
        }
      };

      // Create an instance of the card Element.
      this.card = elements.create("card", { style: style });
      this.card.mount("#card-element");
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
      retrieved.image = this.$store.state.listingsStore.uploadedFilename;
      retrieved.post_title = retrieved.first_name + " " + retrieved.last_name;
      retrieved.name = retrieved.first_name + " " + retrieved.last_name;
      retrieved.created_by = this.$store.state.userStore.user.id;
      var newRetrieved = {};

      for (let i = 0; i < Object.keys(retrieved).length; i++) {
        if (retrieved[Object.keys(retrieved)[i]] != "") {
          newRetrieved[Object.keys(retrieved)[i]] =
            retrieved[Object.keys(retrieved)[i]];
        }
      }

      this.$validator.validateAll().then(result => {
        if (!result) {
          this.isLoading = false;
          return;
        }
        if (!this.errors.any()) {
          axios.post("/api/listings/add_listing", newRetrieved).then(res => {
            this.$router.push("/search");
          });
        }
      });
    }
  },
  computed: {
    user() {
      return this.$store.state.userStore.user;
    },
    stripe() {
      return Stripe("pk_test_NfPP2BE1n6Ldn0I898ZKz3gB");
    },
    items() {
      return [
        {
          name: "first_name",
          label: "First Name",
          placeholder: "Enter First Name"
        },
        {
          name: "last_name",
          label: "Last Name",
          placeholder: "Enter Last Name"
        },

        {
          name: "email",
          label: "Email",
          placeholder: "Enter Email"
        },
        {
          name: "password",
          label: "Password",
          placeholder: "Enter Password"
        }
      ];
    }
  },
  components: {}
};
</script>

<style scoped>
.instructions {
  text-align: center;
  padding: 15px;
  color: #92a9b3;
  font-size: 12pt;
}
#card-errors {
  padding: 10px;
  color: #db5656;
  font-weight: bold;
}
.form {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
#card-element {
  background: #fff;
  border: solid 1px #eaeaea;
  flex-basis: 100%;
  padding: 15px;
  flex: 1;
}
.tab-container {
  display: flex;
  align-items: center;
  color: #000;

  border-radius: 3px;
  justify-content: center;
}
.tab {
  color: #5d9bb277;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-weight: bold;
}
.tab i {
  margin-right: 10px;
  color: rgb(57, 207, 115);
}
.tab.active .bottom-bar {
  height: 2px;
  width: 100%;
  background: #5d9bb2;
  position: absolute;
  bottom: 0;
  left: 0;
}
.tab.active {
  color: #5d9bb2;
}
.tab-divider {
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5d9bb2;
}
.search-panel-content {
  display: flex;
  justify-content: center;
}
.result-content {
  width: 100%;
  max-width: 800px;
}
.standard-input {
  box-shadow: unset;
  margin: 0;
  padding: 0;
  font-size: 12pt;
  text-align: right;
  padding: 5px;
  border: unset;
}
::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #b5ccd8;
  opacity: 1; /* Firefox */
}
.result-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.help {
  position: absolute;
  left: -110px;
  top: calc(50% - 25px);
  width: 100px;
  height: 50px;
  text-align: center;
  background: #ffe2e2;
  color: #db5656;
  padding: 10px;
  border-radius: 5px;
  font-size: 8pt;
}
.help.right {
  right: -110px;
  left: unset;
}
.help.right .help-chev {
  border-right-color: #ffe2e2;
  border-left-color: transparent;
  left: -16px;
  right: unset;
}
.help-chev {
  border: solid 8px transparent;
  border-left-color: #ffe2e2;
  position: absolute;
  right: -16px;
  top: 50%;
  transform: translateY(-50%);
}
.result-content-item {
  position: relative;
  flex: 1;
  flex-basis: 50%;
}
.add-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  margin-bottom: 15px;
}
.add-image:hover .add-image-overlay {
  opacity: 1;
}
.add-image {
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  width: 200px;
  background: #fff;
  border: solid 1px #eaeaea;
  border-radius: 100px;
  font-size: 75pt;
  cursor: pointer;
  color: #b5ccd8;
}
.add-image:active .add-image-overlay {
  transition: none;
  background: #b5ccd8 !important;
}
.add-image-overlay {
  transition: all 0.3s ease;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  background: #b5ccd899;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 45pt;
  color: #fff;
}
.button-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 15px 0px;
  width: 100%;
}
@media (max-width: 728px) {
  .result-content-item {
    flex-basis: 100%;
  }
  .tab-divider {
    width: 20px;
  }
  .tab-container {
    padding: 15px 0px;
  }
  .tab {
    padding: 5px 5px;
    white-space: nowrap;
    font-size: 9pt;
  }
}
</style>