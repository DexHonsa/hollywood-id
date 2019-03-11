<template>
  <div>
    <add-admin v-if="addAdmin" :hide="toggleAddAdmin"/>
    <create-user v-if="createUser" :hide="toggleCreateUser"/>
    <div
      class="net"
      :style="'background-image:url('+require('../../img/hollywood_blue_blur.jpg')+')'"
    ></div>
    <div class="container">
      <div class="search-panel animated-med fadeInUp" style="background:transparent">
        <div class="profile-tabs">
          <div @click="activateTab(0)" class="profile-tab" :class="{'active':activeTab == 0}">Admins
            <div class="profile-tab-bottom-bar"></div>
          </div>
        </div>
        <transition enter-active-class="fadeInRight" leave-active-class="fadeOutLeft" mode="out-in">
          <div :key="0" v-if="activeTab == 0" class="profile-content basic-info animated-fast">
            <div class="basic-info-form">
              <div class="title-1" style="margin:0; margin-bottom:15px;">Admins</div>
              <!-- <div class="input-row">
              <StandardInput field="Username" :value="user.username" width="100%"/>
              </div>-->
              <div v-if="admins.length > 0">
                <div
                  v-for="(admin, index) in admins"
                  :key="index"
                  class="result-content-item"
                  style="align-items:center;"
                >
                  <div class="result-content-item-title">email</div>

                  <div class="result-content-item-value">{{admin.email}}</div>
                  <div
                    v-tooltip="'remove admin'"
                    v-if="admin.email != user.email"
                    class="remove-btns"
                  >
                    <i @click="removeAdmin(admin.email)" class="fa fa-times"></i>
                  </div>
                </div>
              </div>

              <div style="margin-top:15px" class="input-row">
                <div @click="toggleAddAdmin" class="modal-btn confirm" style="margin:0;">Add Admin</div>
              </div>
              <div style="margin-top:15px" class="input-row">
                <div
                  @click="toggleCreateUser"
                  class="modal-btn confirm"
                  style="margin:0;"
                >Create User</div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import StandardInput from "../form_elements/standard_input";
import AddAdmin from "./add_admin";
import axios from "axios";
import CreateUser from "./create_user";

export default {
  name: "manage_admins",
  data() {
    return {
      activeTab: 0,
      isLoading: false,
      admins: [],
      addAdmin: false,
      createUser: false
    };
  },
  components: {
    StandardInput,
    AddAdmin,
    CreateUser
  },
  mounted() {
    this.getAdmins();
  },
  methods: {
    getAdmins() {
      axios.get("/api/users/get_admins").then(res => {
        this.admins = res.data.result;
      });
    },
    toggleAddAdmin() {
      this.addAdmin = !this.addAdmin;
      if (this.addAdmin == false) {
        // this.getAdmins();
      }
    },
    toggleCreateUser() {
      this.createUser = !this.createUser;
      if (this.createUser == false) {
        this.getAdmins();
      }
    },
    activateTab(tab) {
      this.activeTab = tab;
    },
    removeAdmin(email) {
      axios.post("/api/users/remove_admin", { email }).then(res => {
        window.location.reload();
      });
    }
  },
  computed: {
    user() {
      return this.$store.state.userStore.user;
    }
  }
};
</script>
<style>
</style>
