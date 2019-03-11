<template>
  <div>
    <div
      class="net"
      :style="'background-image:url('+require('../../img/hollywood_blue_blur.jpg')+')'"
    ></div>
    <div class="container">
      <add-listing-image :hide="toggleAddListing" v-if="addListing"/>
      <div v-if="isLoading" class="double-loader">
        <img src="../../img/double_loader.svg" alt>
      </div>
      <div v-if="!isLoading" class="search-panel animated-med fadeInUp">
        <div class="search-panel-top">
          <div
            class="search-panel-title"
            style="margin-bottom:0; padding-bottom:0;"
          >Edit Exisisting Listing</div>
        </div>
        <div class="search-panel-content">
          <div class="result-content">
            <form @submit.prevent="submitForm">
              <div class="add-image-container">
                <div @click="toggleAddListing" class="add-image">
                  <div class="add-image-result" :style="'background-image:url('+listingImage+')'"></div>
                  <!-- <img
                    style="width:100%; position:absolute; left:0;top:0;"
                    v-if="listingImage != false"
                    :src="listingImage"
                    alt
                  >-->
                  <div class="add-image-overlay">
                    <i class="fal fa-plus"></i>
                  </div>
                  <i class="fal fa-camera-retro"></i>
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
                      :name="item.name"
                      @keyup="focusOut"
                      class="standard-input"
                      :placeholder="item.placeholder"
                      v-model="item.value"
                    >
                    <input
                      :data-vv-as="item.label"
                      v-validate="item.label == 'First Name' ? 'required' : null"
                      :name="item.name"
                      v-model="item.value"
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
                  <span v-if="!listingLoading">Update Listing</span>
                  <img v-if="listingLoading" style="width:25px" src="../../img/spinner_white.svg">
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
            <div style="margin-top:15px; display:flex; margin-left:auto;">
              <div @click="deleteListing" class="modal-btn delete" style="margin:0; ">
                <span v-if="!listingLoading">Delete Listing</span>
                <img v-if="listingLoading" style="width:25px" src="../../img/spinner_white.svg">
              </div>
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
  name: "edit_listing",
  data() {
    return {
      phoneValue: 0,
      formattedPhoneValue: "",
      preventNextIteration: false,
      addListing: false,
      isLoading: true,
      listingLoading: false,
      listing: {},
      film_credits: [],
      tv_credits: [],
      addFilmCredit: false,
      addTvCredit: false
    };
  },
  components: {
    StandardInput,
    AddListingImage
  },
  mounted() {
    this.setUploadedImage("");
    this.setUploadedFilename("");
    this.init();
  },
  $_veeValidate: {
    validator: "new" // give me a new validator each time.
  },
  methods: {
    ...mapActions(["setUploadedImage", "setUploadedFilename"]),
    deleteListing() {
      this.listingLoading = true;
      axios.delete("/api/listings/delete/" + this.$route.params.id).then(
        res => {
          this.listingLoading = false;
          this.$router.push("/search");
        },
        err => {
          this.listingLoading = false;
        }
      );
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
    init() {
      axios.get("/api/listings/get_listing/" + this.$route.params.id).then(
        res => {
          this.listing = res.data;
          this.setUploadedImage(res.data.image);
          this.setUploadedFilename(res.data.image);
          this.film_credits =
            res.data.film_credits != null
              ? res.data.film_credits.split(",")
              : [];
          this.tv_credits =
            res.data.tv_credits != null ? res.data.tv_credits.split(",") : [];
          this.isLoading = false;
        },
        err => {}
      );
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
      this.listingLoading = true;
      // this.isLoading = true;
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

      if (retrieved.image == null) {
        delete retrieved.image;
      }
      retrieved.created_by = this.$store.state.userStore.user.id;

      var newRetrieved = {};

      for (let i = 0; i < Object.keys(retrieved).length; i++) {
        if (retrieved[Object.keys(retrieved)[i]] != "") {
          newRetrieved[Object.keys(retrieved)[i]] =
            retrieved[Object.keys(retrieved)[i]];
        }
      }
      newRetrieved.film_credits = this.film_credits.join(",");
      newRetrieved.tv_credits = this.tv_credits.join(",");

      this.$validator.validateAll().then(result => {
        if (!result) {
          this.isLoading = false;
          return;
        }
        if (!this.errors.any()) {
          // console.log(newRetrieved);
          axios
            .post(
              "/api/listings/edit_listing/" + this.$route.params.id,
              newRetrieved
            )
            .then(res => {
              this.$router.go(-1);
            });
          console.log(retrieved);
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
      if (this.listing.image != null) {
        return "/api/static/" + this.listing.image;
      }
      return this.$store.state.listingsStore.uploadedImage;
    },
    items() {
      return [
        {
          name: "name",
          label: "Name",
          placeholder: "Enter Name",
          value: this.listing.name
        },
        {
          name: "email",
          label: "Email",
          placeholder: "Enter Email",
          value: this.listing.email
        },
        {
          name: "address1",
          label: "Address",
          placeholder: "Enter Address",
          full: true,
          value: this.listing.address1
        },
        {
          name: "web",
          label: "Website",
          placeholder: "Enter Website URL",
          value: this.listing.web
        },
        {
          name: "phone",
          label: "Phone",
          placeholder: "(XXX) XXX-XXXX",
          value: this.listing.phone
        },
        {
          name: "title",
          label: "Job Title",
          placeholder: "Enter Title",
          value: this.listing.titles.join()
        },
        {
          name: "rep_email",
          label: "Rep Email",
          placeholder: "Enter Email",
          value: this.listing.rep_email
        },
        {
          name: "rep_phone",
          label: "Rep Phone",
          placeholder: "(XXX) XXX-XXXX",
          value: this.listing.rep_phone
        },
        {
          name: "company",
          label: "Company",
          placeholder: "Enter Company",
          value: this.listing.company
        },
        {
          name: "company_web",
          label: "Company Website",
          placeholder: "Enter Website",
          value: this.listing.company_web
        },
        {
          name: "deal",
          label: "Deal",
          placeholder: "Enter Deal",
          value: this.listing.deal
        },
        {
          name: "twitter",
          label: "Twitter",
          placeholder: "Enter Twitter",
          value: this.listing.twitter
        },
        {
          name: "facebook",
          label: "Facebook",
          placeholder: "Enter Facebook",
          value: this.listing.facebook
        },
        {
          name: "instagram",
          label: "Instagram",
          placeholder: "Enter Instagram",
          value: this.listing.instagram
        },
        {
          name: "note",
          label: "Note",
          placeholder: "Enter Note",
          full: true,
          value: this.listing.note
        }
      ];
    }
  }
};
</script>
<style scoped>
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