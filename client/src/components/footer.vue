<template>
  <div class="footer">
    <div class="container">
      <div class="row" style="padding:25px 0px;">
        <div
          class="col-sm-6"
          style="display:flex;align-items:center;  justify-content:center; text-align:center; "
        >
          <div class="footer-links">
            <div @click="$router.push('/about_us')" class="footer-link">About</div>
            <div @click="$router.push('/tos')" class="footer-link">Terms of Service</div>
          </div>
        </div>
        <div
          class="col-sm-6"
          style="display:flex;align-items:center; justify-content:center; text-align:left; "
        >
          <div class="footer-links">
            <div @click="$router.push('/contact_us')" class="footer-link">Contact Us</div>
            <div @click="$router.push('/privacy_policy')" class="footer-link">Privacy Policy</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-footer">
      <div class="container">Copyright The Hollywood Insider Directory © 2017. All Rights Reserved</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "footer",
  data() {
    return {};
  }
};
</script>
<style>
.bottom-footer {
  height: 45px;
  width: 100%;
  background: #414a4e;
  display: flex;
  align-items: center;
  color: #859197;
}
</style>