<template>
  <div>
    <div
      class="net"
      :style="'background-image:url('+require('../../img/hollywood_blue_blur.jpg')+'); filter:hue-rotate(180deg)'"
    ></div>
    <div class="container">
      <div v-if="isLoading" class="double-loader">
        <img src="../../img/double_loader.svg" alt>
      </div>
      <div v-if="!isLoading" class="search-panel animated-med fadeInUp">
        <div class="result-panel-top">
          <div class="result-panel-image" :style="'background-image:url('+ image + ')'"></div>

          <div class="result-panel-title-box">
            <div class="result-panel-title">{{$route.query.company}}</div>
            <hr v-if="$mq != 'sm'" style="border-color:#eaeaea; border-width:2px;">
          </div>
        </div>
        <div class="result-content">
          <div class="executives-container">
            <div
              class="executive-item"
              @click="$router.push('/results/' + exec._id)"
              v-for="(exec, index) in executives"
              :key="index"
            >
              <div
                v-if="exec.image != null"
                class="executive-image"
                :style="'background-image:url(/api/static/' + exec.image + ')'"
              ></div>
              <div v-if="exec.image == undefined" class="executive-image">
                <div
                  style="height:50px; width:50px; display:flex;align-items:center; border-radius:100px; justify-content:center; background:#d3dbde"
                >
                  <i style="color:#fff; font-size:22pt" class="fa fa-user-circle"></i>
                </div>
              </div>
              <div>
                {{exec.name}}
                <div
                  style="display:flex; align-items:center; font-size:8pt; font-weight:300; color:#808080"
                >
                  <span
                    style="margin-right:5px;"
                    v-for="(title, index) in exec.titles"
                    :key="index"
                  >{{title}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import axios from "axios";
import companies from "../../companies.json";

export default {
  name: "executiveResults",
  data() {
    return {
      executives: [],
      isLoading: true
    };
  },
  mounted() {
    window.scrollTo(0, 0);
    axios.post("/api/deals/get_deals", { company: this.company }).then(res => {
      this.executives = res.data;
      this.isLoading = false;
    });
  },
  methods: {},
  computed: {
    image() {
      var studio = this.$route.query.company;
      var img = companies.filter(item => {
        return item.name == studio;
      });

      return img[0].img;
    },
    company() {
      return this.$route.query.company;
    }
  },
  components: {}
};
</script>
<style>
</style>