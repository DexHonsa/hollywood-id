<template>
  <div>
    <div
      class="net"
      :style="'background-image:url('+require('../../img/hollywood_blue_blur.jpg')+')'"
    ></div>
    <div class="container">
      <add-listing-image :hide="toggleAddListing" v-if="addListing"/>
      <div class="search-panel animated-med fadeInUp">
        <div class="search-panel-top">
          <div class="search-panel-title" style="margin-bottom:0; padding-bottom:0;">Add Listing</div>
        </div>
        <div class="search-panel-content">
          <div v-if="!successfulSubmission" class="result-content">
            <form @submit.prevent="submitForm">
              <div class="add-image-container">
                <div @click="toggleAddListing" class="add-image">
                  <img
                    style="width:100%; position:absolute; left:0;top:0;"
                    v-if="listingImage != false"
                    :src="listingImage"
                    alt
                  >
                  <div class="add-image-overlay">
                    <i class="fal fa-plus"></i>
                  </div>
                  <i class="fal fa-camera-retro"></i>
                </div>
              </div>
              <div class="standard-tab-container">
                <div
                  @click="switchType('individual')"
                  class="standard-tab"
                  :class="{'active' : tab == 'individual'}"
                >Individual
                  <div class="standard-tab-bottom-bar"></div>
                </div>
                <div
                  @click="switchType('company')"
                  class="standard-tab"
                  :class="{'active' : tab == 'company'}"
                >Company
                  <div class="standard-tab-bottom-bar"></div>
                </div>
              </div>
              <div style="display:flex; flex-wrap:wrap">
                <div
                  v-for="(item, i) in items"
                  :key="i"
                  class="result-content-item"
                  :class="{'full' : item.full}"
                >
                  <div class="result-content-item-title">{{item.label}}</div>
                  <div class="result-content-item-value">
                    <input
                      v-if="item.label == 'Phone'"
                      type="text"
                      @keyup="focusOut"
                      v-model="formattedPhoneValue"
                      class="standard-input"
                      :placeholder="item.placeholder"
                    >
                    <input
                      data-vv-value-path="dValue"
                      :data-vv-as="item.label"
                      v-validate="item.label == 'First Name' ? 'required' : null"
                      :name="item.name"
                      :placeholder="item.placeholder"
                      v-else
                      type="text"
                      class="standard-input"
                    >
                    <transition enter-active-class="fadeInLeft" leave-active-class="fadeOut">
                      <span v-show="errors.has(item.label)" class="help is-danger animated-fast">
                        {{ errors.first(item.label) }}
                        <div class="help-chev"></div>
                      </span>
                    </transition>
                  </div>
                </div>
              </div>
              <div class="button-container">
                <button type="submit" class="confirm">
                  <span v-if="!isLoading">Create Listing</span>
                  <img v-if="isLoading" style="width:25px" src="../../img/spinner_white.svg">
                </button>
              </div>
            </form>
            <div class="credits-container">
              <div class="film-credits-container">
                <div class="title-1" style="color:#5d9bb2">Film Credits</div>
                <div @click="toggleAddCredit('film')" class="add-credit">
                  <i class="fa fa-plus"></i>
                </div>
                <div v-if="addFilmCredit" class="add-credit-form">
                  <input
                    id="filmCreditAdd"
                    style="border:solid 1px #eaeaea; text-align:left; border-bottom-right-radius:0px; border-top-right:0px; height:35px;"
                    type="text"
                    class="standard-input"
                    ref="filmCreditAdd"
                  >
                  <div @click="addCredit('film')" class="submit-credit-btn">
                    <i class="fa fa-plus"></i>
                  </div>
                </div>
                <div class="film-credits-item" v-for="(film, index) in film_credits" :key="index">
                  {{film}}
                  <i @click="removeCredit('film', film)" class="fa fa-times"></i>
                </div>
              </div>
              <div class="film-credits-container">
                <div class="title-1" style="color:#5d9bb2">TV Credits</div>
                <div @click="toggleAddCredit('tv')" class="add-credit">
                  <i class="fa fa-plus"></i>
                </div>
                <div v-if="addTvCredit" class="add-credit-form">
                  <input
                    id="tvCreditAdd"
                    style="border:solid 1px #eaeaea; text-align:left; border-bottom-right-radius:0px; border-top-right:0px; height:35px;"
                    type="text"
                    class="standard-input"
                    ref="tvCreditAdd"
                  >
                  <div @click="addCredit('tv')" class="submit-credit-btn">
                    <i class="fa fa-plus"></i>
                  </div>
                </div>
                <div class="film-credits-item" v-for="(tv, index) in tv_credits" :key="index">
                  {{tv}}
                  <i @click="removeCredit('tv', tv)" class="fa fa-times"></i>
                </div>
              </div>
            </div>
          </div>

          <!--Success Page -->
          <div v-if="successfulSubmission" class="result-content">
            <div class="ty-submit animated-fast zoomIn2">
              <div class="animated flipInY">
                <i class="fal fa-check-circle"></i>
              </div>
              <br>Thank you for your Submission!
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import StandardInput from "../form_elements/standard_input.2";
import AddListingImage from "./add_listing_image";
import axios from "axios";
import { mapActions } from "vuex";
export default {
  name: "add_listing",
  data() {
    return {
      phoneValue: 0,
      formattedPhoneValue: "",
      preventNextIteration: false,
      addListing: false,
      film_credits: [],
      isLoading: false,
      tv_credits: [],
      addFilmCredit: false,
      addTvCredit: false,
      tab: "individual",
      successfulSubmission: false
    };
  },
  components: {
    StandardInput,
    AddListingImage
  },
  mounted() {
    this.setUploadedImage("");
    this.setUploadedFilename("");
  },
  $_veeValidate: {
    validator: "new" // give me a new validator each time.
  },
  methods: {
    ...mapActions(["setUploadedImage", "setUploadedFilename"]),
    switchType(type) {
      this.tab = type;
    },
    removeEventListeners() {
      this.$refs.tvCreditAdd.removeEventListener("keypress", e => {
        var key = e.which || e.keyCode;
        if (key === 13) {
          this.addCredit("tv");
        }
      });
      this.$refs.filmCreditAdd.removeEventListener("keypress", e => {
        var key = e.which || e.keyCode;
        if (key === 13) {
          this.addCredit("film");
        }
      });
    },
    toggleAddCredit(type) {
      if (type == "tv") {
        this.addTvCredit = true;
        setTimeout(() => {
          this.$refs.tvCreditAdd.focus();
          this.$refs.tvCreditAdd.addEventListener("keypress", e => {
            var key = e.which || e.keyCode;
            if (key === 13) {
              this.addCredit("tv");
              this.removeEventListeners();
            }
          });
        }, 100);
      }
      if (type == "film") {
        this.addFilmCredit = true;
        setTimeout(() => {
          this.$refs.filmCreditAdd.focus();
          this.$refs.filmCreditAdd.addEventListener("keypress", e => {
            var key = e.which || e.keyCode;
            if (key === 13) {
              this.addCredit("film");
              this.removeEventListeners();
            }
          });
        }, 100);
      }
    },
    addCredit(type) {
      var value;
      if (type == "film") {
        value = this.$refs.filmCreditAdd.value;
      }
      if (type == "tv") {
        value = this.$refs.tvCreditAdd.value;
      }
      if (value.indexOf(",") > 0) {
        var values = value.split(",");
        for (let i = 0; i < values.length; i++) {
          this[type + "_credits"].unshift(values[i]);
        }
      } else {
        this[type + "_credits"].unshift(value);
      }
      this.addFilmCredit = false;
      this.addTvCredit = false;
    },
    removeCredit(type, value) {
      this[type + "_credits"].splice(this[type + "_credits"].indexOf(value), 1);
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
      // retrieved.post_title = retrieved.first_name + " " + retrieved.last_name;
      // retrieved.name = retrieved.first_name + " " + retrieved.last_name;
      retrieved.created_by = this.$store.state.userStore.user.id;

      var newRetrieved = {};

      for (let i = 0; i < Object.keys(retrieved).length; i++) {
        if (retrieved[Object.keys(retrieved)[i]] != "") {
          newRetrieved[Object.keys(retrieved)[i]] =
            retrieved[Object.keys(retrieved)[i]];
        }
      }
      if (this.tab == "company") {
        newRetrieved.titles = [];
        newRetrieved.titles.push("Company");
        newRetrieved.company = retrieved.name;
      } else {
        newRetrieved.titles = [];
        newRetrieved.titles = [retrieved.titles];
      }
      newRetrieved.film_credits = this.film_credits.join(",");
      newRetrieved.tv_credits = this.tv_credits.join(",");
      newRetrieved.rating = 0;
      newRetrieved.number_of_ratings = 0;

      this.$validator.validateAll().then(result => {
        if (!result) {
          this.isLoading = false;
          return;
        }
        if (!this.errors.any()) {
          axios.post("/api/listings/add_listing", newRetrieved).then(res => {
            if (res.data.pending) {
              this.successfulSubmission = true;
            }
          });
          console.log(newRetrieved);
        }
      });
    },
    toggleAddListing() {
      this.addListing = !this.addListing;
    },
    format(word) {
      let spaces = word.replace(/_/g, " ");
      return spaces.replace(/\b\w/g, l => l.toUpperCase());
    },
    focusOut(event) {
      if (["Arrow", "Backspace", "Shift"].includes(event.key)) {
        this.preventNextIteration = true;
        return;
      }
      if (this.preventNextIteration) {
        this.preventNextIteration = false;
        return;
      }
      this.phoneValue = this.formattedPhoneValue
        .replace(/-/g, "")
        .match(/(\d{1,10})/g)[0];

      // Format display value based on calculated currencyValue
      this.formattedPhoneValue = this.phoneValue.replace(
        /(\d{1,3})(\d{1,3})(\d{1,4})/g,
        "$1-$2-$3"
      );
    }
  },
  computed: {
    listingImage() {
      if (this.$store.state.listingsStore.uploadedImage == "") {
        return false;
      }
      return this.$store.state.listingsStore.uploadedImage;
    },
    items() {
      if (this.tab == "individual") {
        return [
          {
            name: "name",
            label: "Name",
            placeholder: "Enter Name"
          },
          {
            name: "email",
            label: "Email",
            placeholder: "Enter Email"
          },
          {
            name: "address1",
            label: "Address",
            placeholder: "Enter Address",
            full: true
          },
          {
            name: "web",
            label: "Website",
            placeholder: "Enter Website"
          },
          {
            name: "phone",
            label: "Phone",
            placeholder: "(XXX) XXX-XXXX"
          },
          {
            name: "titles",
            label: "Job Title",
            placeholder: "Enter Title"
          },
          {
            name: "rep_name",
            label: "Rep Name",
            placeholder: "Enter Name"
          },
          {
            name: "rep_email",
            label: "Rep Email",
            placeholder: "Enter Email"
          },
          {
            name: "rep_phone",
            label: "Rep Phone",
            placeholder: "(XXX) XXX-XXXX"
          },
          {
            name: "company",
            label: "Company",
            placeholder: "Enter Company"
          },
          {
            name: "company_web",
            label: "Company Website",
            placeholder: "Enter Website"
          },
          {
            name: "deal",
            label: "Deal",
            placeholder: "Enter Deal"
          },
          {
            name: "twitter",
            label: "Twitter",
            placeholder: "Enter Twitter"
          },
          {
            name: "facebook",
            label: "Facebook",
            placeholder: "Enter Facebook"
          },
          {
            name: "instagram",
            label: "Instagram",
            placeholder: "Enter Instagram"
          }
        ];
      }

      if (this.tab == "company") {
        return [
          {
            name: "name",
            label: "Company Name",
            placeholder: "Enter Company"
          },
          {
            name: "email",
            label: "Email",
            placeholder: "Enter Email"
          },
          {
            name: "address1",
            label: "Address",
            placeholder: "Enter Address",
            full: true
          },
          {
            name: "web",
            label: "Website",
            placeholder: "Enter Website"
          },
          {
            name: "phone",
            label: "Phone",
            placeholder: "(XXX) XXX-XXXX"
          },
          {
            name: "rep_name",
            label: "Rep Name",
            placeholder: "Enter Name"
          },
          {
            name: "rep_email",
            label: "Rep Email",
            placeholder: "Enter Email"
          },
          {
            name: "rep_phone",
            label: "Rep Phone",
            placeholder: "(XXX) XXX-XXXX"
          },
          {
            name: "rep_web",
            label: "Rep Website",
            placeholder: "Enter URL"
          },
          {
            name: "deal",
            label: "Deal",
            placeholder: "Enter Deal"
          },
          {
            name: "note",
            label: "Note",
            placeholder: "Enter Note",
            full: true
          }
        ];
      }
    }
  }
};
</script>
<style scoped>
.ty-submit {
  font-size: 15pt;
  color: #000;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ty-submit i {
  font-size: 100pt;
  color: #2cb168;
}
.add-image-result {
  background-size: cover;
  height: 100%;
  width: 100%;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
}
.add-credit-form {
  display: flex;
  align-items: center;
}
.submit-credit-btn {
  background: #5d9bb2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12pt;
  border-radius: 3px;
  padding: 10px;
  border-top-left-radius: 0px;
  height: 35px;
  border-bottom-left-radius: 0px;
}
.submit-credit-btn:hover {
  background: #4f8fa7;
  cursor: pointer;
}
.add-credit {
  color: #5d9bb2;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  cursor: pointer;
  user-select: none;
}
.add-credit:hover {
  background: #f7fafb;
}
.credits-container {
  display: flex;
  align-items: flex-start;
  width: 100%;
}
.film-credits-container {
  padding: 15px;
  margin-top: 15px;
  flex-basis: 50%;
  flex: 1;
  border: solid 1px #eaeaea;
  background: #fff;
}
.film-credits-item {
  display: flex;
  align-items: center;
  text-transform: lowercase;
  color: #000;
  padding: 5px;
  border-bottom: solid 1px #eaeaea;
}
.film-credits-item:hover {
  background: #f7fafb;
}
.film-credits-item:hover i {
  opacity: 1;
}
.film-credits-item i {
  opacity: 0;
  cursor: pointer;
  margin-left: auto;
}
.search-panel-content {
  display: flex;
  justify-content: center;
}
.result-content {
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
  flex-grow: unset;
}
.result-content-item.full {
  flex-basis: 100%;
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
}
</style>