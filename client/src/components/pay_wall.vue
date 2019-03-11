<template>
  <div class="section-2 animated-fast fadeIn">
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
              <div @click="selectPlan('m')" class="price-panel-btn">Select Plan</div>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="price-panel">
            <div class="best-value animated tada">
              <i class="fa fa-grin-stars"></i> Best Value!
            </div>
            <div class="price-circle" style="border-color:#00b4ff">$99.99</div>
            <div class="price-panel-title">Yearly Subscription</div>
            <div class="price-panel-inner">
              <div class="price-panel-item">
                <i class="fa fa-check"></i> Yearly Subscription
              </div>
              <div class="price-panel-item">
                <i class="fa fa-check"></i> Access to all the content
              </div>
              <div class="price-panel-item">
                <i class="fa fa-check"></i> 24/7 access to Hollywood's best talent
              </div>
              <div @click="selectPlan('y')" class="price-panel-btn">Select Plan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "paywall",
  data() {
    return {};
  },
  mounted() {
    if (
      this.$store.state.userStore.user != null &&
      this.$store.state.userStore.user.is_active
    ) {
      this.$router.push("/search");
    }
    if (
      this.$store.state.userStore.user.id != null &&
      this.$store.state.userStore.user.is_active == false
    ) {
      this.$router.push("/setup_sub");
    }
    window.scrollTo(0, 0);
  },
  methods: {
    selectPlan(plan) {
      if (plan == "m") {
        if (this.user.id != null) {
          this.$router.push("/activate_sub?sub=m");
        } else {
          this.$router.push("/setup_sub?sub=m");
        }
      } else {
        if (this.user.id != null) {
          this.$router.push("/activate_sub?sub=y");
        } else {
          this.$router.push("/setup_sub?sub=y");
        }
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.userStore.user;
    }
  }
};
</script>
<style lang="">
</style>