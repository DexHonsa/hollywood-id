<template>
  <div class="main-container">
    <UserLogin :hide="toggleUserLogin" v-if="userLogin"/>
    <Signup :hide="toggleSignup" v-if="signup"/>
    <div v-if="!mobile" class="web-top-bar container">
      <img @click="$router.push('/')" src="../img/logo_small_white.png">

      <div class="top-nav" :class="{'mobile':mobile, 'collapsed':!navOpen}">
        <ul>
          <span>Menu</span>
          <li @click="$router.push('/search')">
            <i class="fa fa-search"></i>Explore
          </li>
          <li @click="toggleDropdown('executives')">
            Executives
            <i class="fa fa-angle-down"></i>

            <transition enter-active-class="zoomIn2" leave-active-class="fadeOutDown">
              <div v-if="dropdown == 'executives'" class="basic-dropdown animated-fast">
                <div class="dropdown-chev"></div>
                <li @click="$router.push('/studio/executives')">Studio Executives</li>
                <li @click="$router.push('/network/executives')">Network Executives</li>
              </div>
            </transition>
          </li>
          <li @click="toggleDropdown('deals')">
            Deals
            <i class="fa fa-angle-down"></i>
            <transition enter-active-class="zoomIn2" leave-active-class="fadeOutDown">
              <div v-if="dropdown == 'deals'" class="basic-dropdown animated-fast">
                <div class="dropdown-chev"></div>
                <li @click="$router.push('/studio/deals')">Studio Deals</li>
                <li @click="$router.push('/network/deals')">Network Deals</li>
              </div>
            </transition>
          </li>
          <li @click="$router.push('/ifp')">Independent Film Producers</li>
          <li v-if="isLoggedIn" @click="logout">Logout</li>
          <li @click="toggleDropdown('user')" v-if="isLoggedIn" class="get-started">
            <i style="margin-left:0px; font-size:12pt" class="fal fa-user-circle"></i>
            &nbsp;{{user.first_name +' '+ user.last_name}}
            <transition enter-active-class="zoomIn2" leave-active-class="fadeOutDown">
              <div
                v-if="dropdown == 'user'"
                class="basic-dropdown animated-fast"
                style="right:0; min-width:150px"
              >
                <div class="dropdown-chev"></div>
                <!-- <li @click="$router.push('/studio/deals')">
                  <i class="fal fa-cog"></i>Account
                </li>-->
                <li @click="$router.push('/admin/add_listing')">
                  <i style="margin-left:0;" class="fal fa-plus"></i>Add Listing
                </li>
                <li @click="$router.push('/profile')">
                  <i style="margin-left:0;" class="fal fa-user-circle"></i>Profile
                </li>
                <li v-if="user.role == 'admin'" @click="$router.push('/admin/pending_listings')">
                  <i class="fal fa-edit" style="margin-left:0;"></i>Pending Listings
                </li>
                <li v-if="user.role == 'admin'" @click="$router.push('/admin/manage_admins')">
                  <i class="fal fa-edit" style="margin-left:0;"></i>Manage Admins
                </li>
              </div>
            </transition>
          </li>
          <li v-if="!isLoggedIn" @click="toggleUserLogin">User Login</li>
          <li v-if="!isLoggedIn" class="get-started" @click="$router.push('/paywall')">Sign Up</li>
        </ul>
      </div>
    </div>
    <div
      v-if="mobile"
      :class="{'scrolled animated-med fadeInDown': headerScroll}"
      class="web-top-bar container"
    >
      <img @click="$router.push('/')" src="../img/logo_small_white.png">
      <i @click="toggleMobileNav" class="fa fa-bars nav-toggle"></i>
      <div class="top-nav" :class="{'mobile':mobile, 'collapsed':!navOpen}">
        <ul>
          <span>Menu</span>
          <li @click="toggleMobileNav(),$router.push('/search')">
            <i class="fa fa-search"></i>Explore
          </li>
          <li @click="toggleMobileNav(),$router.push('/network/executives')">Network Executives</li>
          <li @click="toggleMobileNav(),$router.push('/studio/executives') ">Studio Executives</li>
          <li @click="toggleMobileNav(),$router.push('/network/deals')">Network Deals</li>
          <li @click="toggleMobileNav(),$router.push('/studio/deals')">Studio Deals</li>
          <li @click="toggleMobileNav(),$router.push('/ifp')">Independent Film Producers</li>
          <li v-if="isLoggedIn" @click="logout">Logout</li>
          <li
            v-if="isLoggedIn"
            @click="toggleMobileNav(),$router.push('/profile')"
            class="get-started"
          >
            <i class="fa fa-user-circle"></i>
            &nbsp;{{user.first_name + ' ' + user.last_name}}
          </li>
          <li v-if="!isLoggedIn" @click="toggleUserLogin">User Login</li>
          <li
            v-if="!isLoggedIn"
            class="get-started"
            @click="toggleMobileNav(),$router.push('/paywall')"
          >Sign Up</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import auth from "../auth";
import UserLogin from "./login/login_form";
import Signup from "./login/signup";
export default {
  name: "search_header",
  components: {
    UserLogin,
    Signup
  },
  data() {
    return {
      navOpen: false,
      userLogin: false,
      signup: false,
      mobile: false,
      dropdown: ""
    };
  },
  methods: {
    toggleDropdown(dropdown) {
      if (dropdown == "") {
        if (this.dropdown != "") {
          this.dropdown = "";
          return;
        }
        return;
      }
      if (this.dropdown != "" && this.dropdown == dropdown) {
        this.dropdown = "";
        return;
      }
      if (this.dropdown == dropdown) {
        this.dropdown = "";
      }

      this.dropdown = dropdown;
    },
    toggleUserLogin() {
      this.userLogin = !this.userLogin;
    },
    toggleSignup() {
      this.signup = !this.signup;
    },
    logout() {
      auth.logout();
    },
    toggleMobileNav() {
      this.navOpen = !this.navOpen;
    }
  },
  mounted() {
    if (this.$mq == "sm") {
      this.mobile = true;
    }
  },
  watch: {
    $mq(val) {
      if (val == "sm") {
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.userStore.user;
    },
    isLoggedIn() {
      if (this.$store.state.userStore.user.id != null) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>
