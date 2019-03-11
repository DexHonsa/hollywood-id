<template>
  <div>
    <div
      class="net"
      :style="'background-image:url('+require('../../img/hollywood_blue_blur.jpg')+'); filter:hue-rotate(270deg)'"
    ></div>
    <div class="container">
      <div class="search-panel animated-med fadeInUp">
        <div class="title-1">Studio Deals</div>

        <div class="companies-container">
          <div
            @click="$router.push('/studio/deals/result?company=' + comp.name )"
            v-for="(comp, index) in companies"
            :key="index"
            class="company-item"
          >
            <div class="company-image">
              <img :src="comp.img" alt>
            </div>
            <div class="company-name">{{comp.name}}</div>
            <div class="go-company">
              <i class="fal fa-angle-right"></i>
            </div>
            <div class="bottom-bar"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import companies from "../../studios.json";
export default {
  name: "studio_deals",
  data() {
    return {
      companies
    };
  },
  methods: {},
  computed: {},
  components: {}
};
</script>
<style scoped>
@media (max-width: 725px) {
  .search-panel {
    border-radius: 0px;
  }
  .container {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
}
</style>
<style>
</style>
