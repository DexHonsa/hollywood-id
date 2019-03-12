<template>
  <div>
    <cancel-sub v-if="cancelSub" :hide="toggleCancelSub"/>
    <upload-image v-if="uploadImage" :hide="toggleUploadImage"/>
    <change-password v-if="changePassword" :hide="toggleChangePassword"/>
    <div
      class="net"
      :style="'background-image:url('+require('../../img/hollywood_blue_blur.jpg')+')'"
    ></div>
    <div class="container">
      <div class="search-panel animated-med fadeInUp" style="background:transparent">
        <div class="profile-top">
          <div class="profile-image">
            <img v-if="user.image != null" :src="'/api/user_uploads/' + user.image" alt>
            <div v-else class="image-placeholder">
              <i class="fa fa-user-circle"></i>
            </div>
            <div @click="toggleUploadImage" class="update-image">
              <i class="fal fa-camera"></i> Update
            </div>
          </div>
          <div class="profile-details">
            <div class="profile-name">{{user.first_name + ' ' + user.last_name}}</div>
            <!-- <div class="profile-tags">
              <div class="type-tag actor">actor</div>
              <div class="type-tag producer">producer</div>
              <div class="type-tag writer">writer</div>
            </div>-->
          </div>
        </div>
        <div class="profile-tabs">
          <div
            @click="activateTab(0)"
            class="profile-tab"
            :class="{'active':activeTab == 0}"
          >Basic Details
            <div class="profile-tab-bottom-bar"></div>
          </div>
          <div
            @click="activateTab(1)"
            class="profile-tab"
            :class="{'active':activeTab == 1}"
            v-if="user.sub_id != null"
          >Subscription
            <div class="profile-tab-bottom-bar"></div>
          </div>
          <!-- <div
            @click="activateTab(2)"
            class="profile-tab"
            :class="{'active':activeTab == 2}"
          >Transactions
            <div class="profile-tab-bottom-bar"></div>
          </div>-->
        </div>
        <transition enter-active-class="fadeInRight" leave-active-class="fadeOutLeft" mode="out-in">
          <div :key="0" v-if="activeTab == 0" class="profile-content basic-info animated-fast">
            <form class="basic-info-form" @submit="submit">
              <div class="title-1" style="margin:0; margin-bottom:15px;">Update Profile Information</div>
              <!-- <div class="input-row">
              <StandardInput field="Username" :value="user.username" width="100%"/>
              </div>-->
              <div class="result-content-item">
                <div class="result-content-item-title">Name</div>

                <div class="result-content-item-value">{{user.first_name + ' ' + user.last_name}}</div>
              </div>

              <div class="result-content-item">
                <div class="result-content-item-title">Account Email</div>

                <div class="result-content-item-value">{{user.email}}</div>
              </div>
              <div style="margin-top:15px" class="input-row">
                <div
                  @click="toggleChangePassword"
                  class="modal-btn delete"
                  style="margin:0;"
                >Change Password</div>
              </div>
            </form>
          </div>

          <div :key="1" v-if="activeTab == 1" class="profile-content basic-info animated-fast">
            <form class="basic-info-form" @submit="submit">
              <div class="title-1" style="margin:0; margin-bottom:15px;">Subscription Information</div>
              <div v-if="!user.is_active">
                <div style="padding-top:15px;" class="input-row">
                  <div
                    @click="$router.push('paywall')"
                    class="modal-btn confirm"
                  >Activate Subscription</div>
                </div>
              </div>
              <div v-else>
                <div class="result-content-item">
                  <div class="result-content-item-title">Subscription Start Date</div>
                  <div class="result-content-item-value">{{formatDate(sub.start)}}</div>
                </div>
                <div class="result-content-item">
                  <div
                    v-if="!sub.cancel_at_period_end"
                    class="result-content-item-title"
                  >Next Billing Date</div>
                  <div
                    v-if="sub.cancel_at_period_end"
                    class="result-content-item-title"
                  >Account Active Through</div>
                  <div class="result-content-item-value">{{formatDate(sub.current_period_end)}}</div>
                </div>
                <div class="result-content-item">
                  <div class="result-content-item-title">Subscription Status</div>
                  <div class="result-content-item-value">{{sub.status}}</div>
                </div>
                <div v-if="sub.cancel_at_period_end" class="result-content-item">
                  <div class="result-content-item-title">Canceled</div>
                  <div
                    class="result-content-item-value"
                    style="color:#e25f6b"
                  >{{sub.cancel_at_period_end}}</div>
                </div>
                <div v-if="last4 != ''" class="result-content-item">
                  <div class="result-content-item-title">Card</div>
                  <div class="result-content-item-value">**** **** **** {{last4}}</div>
                </div>
                <br>
                <div
                  v-if="!sub.cancel_at_period_end"
                  @click="toggleCancelSub"
                  class="modal-btn delete"
                  style="margin:0;"
                >Cancel My Subscription</div>

                <div
                  v-if="sub.cancel_at_period_end"
                  @click="restartSub"
                  class="modal-btn confirm"
                  style="margin:0;"
                >
                  <span v-if="!isLoading">Restart My Subscription</span>
                  <img v-if="isLoading" style="width:25px" src="../../img/spinner_white.svg">
                </div>

                <div
                  @click="changePayment"
                  class="modal-btn delete"
                  style="margin:0; margin-top:10px;"
                >Change Payment Method</div>
              </div>
            </form>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import StandardInput from "../form_elements/standard_input";
import UploadImage from "./add_profile_image";
import ChangePassword from "./change_password";
import CancelSub from "./cancel_sub";
import axios from "axios";

export default {
  name: "profile",
  data() {
    return {
      activeTab: 0,
      changePassword: false,
      uploadImage: false,
      sub: "",
      cus: "",
      cancelSub: false,
      isLoading: false,
      last4: ""
    };
  },
  components: {
    StandardInput,
    UploadImage,
    CancelSub,
    ChangePassword
  },
  mounted() {
    axios
      .post("/api/stripe/get_sub", {
        sub_id: this.$store.state.userStore.user.sub_id
      })
      .then(res => {
        if (!res.data.success) {
        } else {
          this.sub = res.data.subscriptions;
        }
        axios
          .post("/api/stripe/get_cus", {
            cus_id: this.$store.state.userStore.user.cus_id
          })
          .then(res2 => {
            if (!res2.data.success) {
            } else {
              this.cus = res2.data.cus;
              this.last4 = res2.data.cus.sources.data[0].last4;
            }
          });
      });
  },
  methods: {
    changePayment() {
      this.$router.push("/change_payment");
    },
    restartSub() {
      this.isLoading = true;
      axios
        .post("/api/stripe/restart_sub", {
          sub_id: this.$store.state.userStore.user.sub_id
        })
        .then(
          res => {
            window.location.reload();
          },
          err => {
            this.isLoading = false;
          }
        );
    },
    toggleCancelSub() {
      this.cancelSub = !this.cancelSub;
    },
    formatDate(date2) {
      // var date = new Date(date2 * 1000);
      // // Hours part from the timestamp
      // var hours = date.getHours();
      // // Minutes part from the timestamp
      // var minutes = "0" + date.getMinutes();
      // // Seconds part from the timestamp
      // var seconds = "0" + date.getSeconds();

      // // Will display time in 10:30:23 format
      // return hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

      var date = new Date(date2 * 1000);
      var monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
      ];

      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();

      return monthNames[monthIndex] + " " + day + " " + year;
    },
    toggleUploadImage() {
      this.uploadImage = !this.uploadImage;
    },
    toggleChangePassword() {
      this.changePassword = !this.changePassword;
    },
    activateTab(tab) {
      this.activeTab = tab;
    },
    submit() {
      console.log("yey");
    }
  },
  computed: {
    user() {
      return this.$store.state.userStore.user;
    }
  }
};
</script>
<style scoped>
.basic-info-form {
  box-shadow: none;
}
.result-content-item-title {
  white-space: nowrap;
}
.result-content-item-value {
  text-align: right;
}
</style>
<style>
.profile-tabs {
  display: flex;
  align-items: flex-end;
  height: 30px;
  justify-content: center;
  margin-top: 15px;
}
.update-image {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  border-radius: 30px;
  height: 24px;
  color: #000;
  font-size: 8pt;
  justify-content: center;
  background: linear-gradient(#d1d9dd, #939ba0);
  border: solid 1px #a5a5a5;
  padding: 0px 10px;
  transition: all 0.3s ease;
  opacity: 0;
  z-index: 1000;
  cursor: pointer;
  user-select: none;
  box-shadow: 1px 9px 22px -7px rgba(0, 0, 0, 0.3);
}
.update-image:active {
  background: linear-gradient(#939ba0, #d1d9dd);
}
.update-image i {
  margin-right: 5px;
}
.profile-image:hover .update-image {
  opacity: 0.8;
}
.profile-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  color: #00000050;
  font-weight: bold;
  padding: 0px 15px;
  position: relative;
  cursor: pointer;
}
.profile-tab:hover {
  color: #000;
}
.profile-tab:hover .profile-tab-bottom-bar {
  transform: scaleX(1);
  background: #ffffff66;
}
.profile-tab.active {
  color: #000;
}
.profile-tab.active .profile-tab-bottom-bar {
  transform: scaleX(1);
  background: #000 !important;
}
.profile-tab-bottom-bar {
  height: 2px;
  width: 100%;
  position: absolute;
  background: #000;
  bottom: 0;
  left: 0;
  transform-origin: 50%;
  transform: scale(0);
  transition: all 0.3s ease;
}
.profile-top {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 120px;
}
.profile-image {
  height: 150px;
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 2px #fff;
  box-shadow: 1px 9px 22px -7px rgba(0, 0, 0, 0.3);
  border-radius: 100px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}
.profile-image:hover {
  transform: translateY(-10px);
  box-shadow: 1px 19px 22px -7px rgba(0, 0, 0, 0.3);
}
.profile-image img {
  height: 100%;
}
.profile-details {
  padding: 15px;
  color: #000;
}
.profile-name {
  font-size: 18pt;
  font-weight: bold;
}
.profile-content {
  padding: 15px 0px;
  color: #000;
}
.basic-info {
  background: transparent;
  display: flex;
  margin-top: 15px;
  justify-content: center;
  border-radius: 5px;
}
.basic-info-form {
  background: #f8fafb;
  max-width: 500px;
  width: 100%;
  padding: 15px;
  box-shadow: 1px 9px 22px -7px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
}
.image-placeholder {
  background: #fff;
  color: #939ba0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 140pt;
}
@media (max-width: 728px) {
  .image-placeholder {
    font-size: 50pt;
  }
}
</style>
