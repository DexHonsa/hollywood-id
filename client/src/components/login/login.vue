<template>
  <div style="overflow:hidden;" class="animated fadeIn">
    <LearnMore v-if="learnMore" :hide="toggleLearnMore"/>
    <UserLogin :hide="toggleUserLogin" v-if="userLogin"/>
    <Signup :hide="toggleSignup" v-if="signup"/>
    <div class="main-container">
      <div
        v-if="!mobile"
        :class="{'scrolled animated-med fadeInDown': headerScroll}"
        class="web-top-bar container"
      >
        <img src="../../img/logo_small_white.png">

        <div class="top-nav" :class="{'mobile':mobile, 'collapsed':!navOpen}">
          <ul>
            <span>Menu</span>
            <li @click="$router.push('/search')">
              <i class="fa fa-search"></i>Explore
            </li>
            <li @click="toggleDropdown('executives')">
              Executives
              <i class="fal fa-angle-down"></i>
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
              <i class="fal fa-angle-down"></i>
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
                  style="right:0; left:unset; min-width:150px"
                >
                  <div class="dropdown-chev"></div>
                  <li @click="$router.push('/admin/add_listing')">
                    <i style="margin-left:0;" class="fal fa-plus"></i>Add Listing
                  </li>
                  <li @click="$router.push('/profile')">
                    <i style="margin-left:0;" class="fal fa-user-circle"></i>Profile
                  </li>
                  <li v-if="user.role == 'admin'" @click="$router.push('/admin/pending_listings')">
                    <i style="margin-left:0;" class="fal fa-edit"></i>Pending Listings
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
        <img src="../../img/logo_small_white.png">
        <i @click="toggleMobileNav" class="fal fa-bars nav-toggle"></i>
        <div class="top-nav" :class="{'mobile':mobile, 'collapsed':!navOpen}">
          <ul>
            <span>Menu</span>
            <li @click="toggleMobileNav(),$router.push('/search')">
              <i class="fa fa-search"></i>Explore
            </li>
            <li @click="toggleMobileNav(),$router.push('/network/executives')">Network Executives</li>
            <li @click="toggleMobileNav(),$router.push('/studio/executives')">Studio Executives</li>
            <li @click="toggleMobileNav(),$router.push('/network/deals')">Network Deals</li>
            <li @click="toggleMobileNav(),$router.push('/studio/deals')">Studio Deals</li>
            <li @click="toggleMobileNav(),$router.push('/ifp')">Independent Film Producers</li>
            <li v-if="isLoggedIn" @click="logout">Logout</li>
            <li v-if="isLoggedIn" @click="$router.push('/profile')" class="get-started">
              <i class="fal fa-user-circle"></i>
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

      <!-- <div v-if="headerScroll" class="web-top-bar scrolled" :class="{'animated-med fadeInDown': headerScroll}">
       
        <img src="../../img/logo_small_white.png"/>
        <i v-if="mobile" @click="toggleMobileNav" class="fa fa-bars nav-toggle"></i>
        <div class="top-nav" :class="{'mobile':mobile, 'collapsed':!navOpen}">
          <ul>
            <span>Menu</span>
            <li @click="$router.push('/search')"><i class="fa fa-search"></i> Explore</li>
            <li>Network Executives</li>
            <li>Studio Executives</li>
            <li>Network Deals</li>
            <li>Studio Deals</li>
            <li>Independent Film Producers</li>
            <li v-if="isLoggedIn" @click="logout">Logout</li>
            <li v-if="isLoggedIn" class="get-started"><i class="fa fa-user-circle"></i>&nbsp;{{user.username}}</li>
            <li v-if="!isLoggedIn" @click="toggleUserLogin">User Login</li>
            <li v-if="!isLoggedIn" class="get-started" @click="signup = !signup">Sign Up</li>
          </ul>
        </div>
      
      </div>-->
    </div>
    <div id="login-panel" class="login-panel">
      <div class="net2"></div>
      <div class="main-splash container">
        <div style="flex:1; max-width:600px">
          <h1>Search for TV and Film Professionals</h1>
          <span>All of Hollywood's key decision makers in one place including comprehensive lists of writer deals at networks and production companies with first look deals at studios.</span>
          <br>
          <div @click="$router.push('/search')" class="main-btn">Get Started</div>
        </div>
        <div
          v-if="$mq == 'lg'"
          style="flex:1; display:flex;align-items:center;justify-content:center;"
        >
          <img style="width:400px;" src="../../img/logo_white.png" alt>
        </div>
      </div>
    </div>
    <div class="wave-container">
      <img src="../../img/wave.svg" alt>
    </div>
    <div class="section-1">
      <div class="container">
        <div class="row" style="padding-top:25px;">
          <div v-if="$mq != 'sm'" class="col-sm-12">
            <img style="width:100%;" src="../../img/sample_pages.png" alt>
          </div>
          <div v-if="$mq == 'sm'" class="col-sm-12">
            <img style="width:100%;" src="../../img/sample_page.png" alt>
          </div>
          <div
            class="col-sm-12"
            style="display:flex;align-items:center; justify-content:center; text-align:center; color:#fff; "
          >
            <div>
              <h1>Connect with decision makers who can help you reach your goal</h1>
              <br>
              <span
                class="sub-text"
                style="text-align:center;"
              >Find thousands of people in our online directory of Hollywood decision makers. We want our platform to manage and advance your career or projects.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section-2">
      <div class="container">
        <div class="row" style="padding-top:25px;">
          <div class="col-sm-12">
            <h1>Plans and Pricing</h1>
          </div>
          <div class="col-sm-6">
            <div class="price-panel">
              <div class="price-circle">$9.99</div>
              <div class="price-panel-title">Monthly Subscription</div>
              <div class="price-panel-inner">
                <div class="price-panel-item">
                  <i class="fa fa-check"></i> Monthly Subscription
                </div>
                <div class="price-panel-item">
                  <i class="fa fa-check"></i> Access to all the content
                </div>
                <div class="price-panel-item">
                  <i class="fa fa-check"></i> 24/7 access to Hollywood's best talent
                </div>
                <div class="price-panel-btn">Select Plan</div>
              </div>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="price-panel">
              <div class="best-value">
                <i class="fa fa-grin-stars"></i> Best Value!
              </div>
              <div class="price-circle" style="border-color:#00b4ff">$99.99</div>
              <div class="price-panel-title">Yearly Subscription</div>
              <div class="price-panel-inner">
                <div class="price-panel-item">
                  <i class="fal fa-check"></i> Yearly Subscription
                </div>
                <div class="price-panel-item">
                  <i class="fal fa-check"></i> Access to all the content
                </div>
                <div class="price-panel-item">
                  <i class="fal fa-check"></i> 24/7 access to Hollywood's best talent
                </div>
                <div class="price-panel-btn">Select Plan</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import StandardInput from "../form_elements/standard_input";
import LearnMore from "./learn_more";
import UserLogin from "./login_form";
import Signup from "./signup";
import { mapActions } from "vuex";
import auth from "../../auth";

export default {
  name: "login",
  data() {
    return {
      hasError: false,
      navOpen: false,
      errorMessage: "",
      mobile: false,
      headerScroll: false,
      learnMore: false,
      userLogin: false,
      signup: false,
      dropdown: "blank",
      isLoading: true
    };
  },

  mounted() {
    var that = this;
    window.document.addEventListener("scroll", this.getScrollTop);
    if (this.$mq == "sm") {
      this.mobile = true;
    }
    setTimeout(function() {
      that.isLoading = false;
    }, 1000);
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
  methods: {
    ...mapActions(["setUser"]),
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
    toggleLearnMore() {
      this.learnMore = !this.learnMore;
    },
    logout() {
      auth.logout();
    },
    getScrollTop() {
      var scrollTop = window.window.scrollY;
      var loginPanel = window.document.getElementById("login-panel")
        .clientHeight;
      if (scrollTop > loginPanel - 100) {
        this.headerScroll = true;
      } else {
        this.headerScroll = false;
      }
    },
    toggleMobileNav() {
      this.navOpen = !this.navOpen;
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
  },
  components: {
    StandardInput,
    LearnMore,
    UserLogin,
    Signup
  }
};
</script>
<style>
</style>
