<template>
  <div>
    <div
      class="net"
      :style="'background-image:url('+require('../../img/hollywood_blue_blur.jpg')+')'"
    ></div>
    <div class="container">
      <div v-if="isLoading" class="double-loader">
        <img src="../../img/double_loader.svg" alt>
      </div>
      <div v-if="!isLoading" class="search-panel animated-med fadeInUp">
        <div class="result-panel-top">
          <div
            v-if="image != ''"
            class="result-panel-image"
            :style="'background-image:url('+ fixSpaces(image) + '); color:#000'"
          ></div>

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
import companies from "../../ifp.json";

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
    axios.post("/api/ifp/get_ifp", { company: this.company }).then(res => {
      this.executives = res.data;
      this.isLoading = false;
    });
  },
  methods: {
    fixSpaces(word) {
      return word.replace(/ /g, "%20");
    }
  },
  computed: {
    image() {
      var studio = this.$route.query.company;
      var img = companies.filter(item => {
        return item.name == studio;
      });
      if (img[0] != null && img[0].img != null) {
        return img[0].img;
      } else {
        return "";
      }
    },
    company() {
      return this.$route.query.company;
    }
  },
  components: {}
};
</script>
<style>
.executives-container {
  display: flex;
  /* align-items: flex-start; */
  flex-wrap: wrap;
}
.executive-item {
  display: flex;
  flex: 1;
  color: #000;
  align-items: center;
  flex-basis: calc(33.3333333% - 10px);
  margin: 5px;
  border: solid 1px #eaeaea;
  padding: 10px;
  border-radius: 3px;
  background: #fff;
  font-weight: bold;
  flex-grow: unset;
}
.executive-item:hover {
  cursor: pointer;
  color: #3080e8;
}
.executive-item:hover .executive-image {
  transform: scale(1.4, 1.4) translateX(-10px);
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
}
.executive-image {
  transition: all 0.3s ease;
  margin-right: 10px;
  height: 50px;
  width: 50px;
  border-radius: 100px;
  background-size: cover;
  background-position: center center;
}
@media (max-width: 728px) {
  .executive-item {
    font-size: 9pt;
    flex-basis: 100%;
  }
}
</style>