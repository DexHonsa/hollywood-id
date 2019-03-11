<template>
  <div
    v-click-outside="resetStars"
    v-if="$mq != 'sm'"
    class="result-panel-star-box col-sm-12 col-md-6"
  >
    <div v-click-outside="hideBox" class="comment-box" :class="{'open' : commentBox}">
      <div style="display:flex; align-items:center;">
        <div
          v-for="(star, index) in stars"
          :key="index"
          class="star-container"
          @mouseenter="hoverStar(index)"
          @click="starClick"
        >
          <i v-if="star == 2" class="fa fa-star full-star"></i>
          <i v-if="star == 0" class="far fa-star empty-star"></i>
          <i v-if="star == 1" class="fa fa-star-half-alt half-star"></i>
        </div>
        <div class="star-rating">{{rating}}</div>
        <div class="star-counter">({{numberOfRatings}})</div>
      </div>
      <div v-if="commentBox" class="comment-area">
        <textarea ref="commentBox" class="comment-text-area"></textarea>
        <div @click.stop="submit" style="margin-left:0;" class="modal-btn confirm">
          <span v-if="!isLoading">Submit</span>
          <img v-if="isLoading" style="width:25px" src="../../img/spinner_white.svg">
        </div>
        <div class="is-danger" style="margin-top:10px;" v-if="hasError">{{errorMessage}}</div>
      </div>
    </div>
    <!-- <i class="fa fa-star-half-alt"></i>
    <i class="far fa-star"></i>
    <i class="fa fa-star-half-alt"></i>
    <i class="far fa-star"></i>
    <i class="fa fa-star-half-alt"></i>
    <i class="far fa-star"></i>
    <i class="fa fa-star-half-alt"></i>
    <i class="far fa-star"></i>
    <i class="fa fa-star-half-alt"></i>
    <i class="far fa-star"></i>-->
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "stars",
  props: ["numberOfRatings", "rating"],

  data() {
    return {
      stars: [],
      originalStars: [],
      commentBox: false,
      hasError: false,
      errorMessage: "",
      isLoading: false
    };
  },
  mounted() {
    this.getStars();
  },
  methods: {
    hideBox() {
      if (this.commentBox) {
        this.commentBox = false;
        this.resetStars();
      }
    },
    resetStars() {
      //console.log("reseting");
      for (let i = 0; i < this.stars.length; i++) {
        this.$set(this.stars, i, this.originalStars[i]);
      }
      // this.$set(this.stars, this.originalStars);
    },
    submit() {
      this.hasError = false;
      this.isLoading = true;
      var comment = this.$refs.commentBox.value;
      var rating = 1;
      for (let i = 1; i < 5; i++) {
        //console.log(this.rating[])
        if (this.stars[i] == 2) {
          rating++;
        }
      }
      var obj = {
        listing_id: this.$route.params.id,
        user_id: this.$store.state.userStore.user.id,
        rating,
        comment
      };

      axios.post("api/ratings/add_rating", obj).then(
        res => {
          window.location.reload();
          this.isLoading = false;
        },
        err => {
          this.hasError = true;
          this.errorMessage = err.response.data.message;
          this.isLoading = false;
        }
      );
    },
    hoverStar(star) {
      // star++;
      for (var i = 0; i < star + 1; i++) {
        this.$set(this.stars, i, 2);
      }
      var dif = 4 - star;
      for (var p = 4; star < p < dif; p--) {
        //console.log(p);
        if (p <= star) {
          break;
        }
        this.$set(this.stars, p, 0);
        //this.stars[p] = 0;
      }
      //console.log(this.stars);
    },
    starClick() {
      //console.log(this.stars);
      var rate = 0;
      for (let i = 0; i < 4; i++) {
        if (this.stars[i] == 2) {
          rate++;
        }
      }
      //console.log(rate);
      this.commentBox = true;
    },
    getStars() {
      let starArr = [0, 0, 0, 0, 0];
      // let dif = 5 - this.rating; // 1.5
      for (let i = 0; i < this.rating; i++) {
        starArr[i] = 2;
      }
      if (Math.round(this.rating - 0.01) != Math.ceil(this.rating)) {
        starArr[Math.round(this.rating - 0.01)] = 1;
      }
      this.stars = starArr;
      this.originalStars = JSON.parse(JSON.stringify(starArr));
    }
  },
  computed: {}
};
</script>
<style>
.star-container:hover .full-star {
}
.result-panel-star-box {
  position: absolute !important;
  right: 0 !important;
  z-index: 100000;
  top: 0;
}
.star-container {
  cursor: pointer;
}
.star-counter {
  font-size: 12pt;
  font-weight: bold;
  margin-left: 15px;
  color: #6771e4;
}
.star-rating {
  font-size: 30pt;
  margin-left: 15px;
  font-weight: bold;
  color: #6771e4;
}
.comment-box {
  padding: 15px;
}
.comment-box.open {
  background: #fff;
  border: solid 1px #eaeaea;
  border-radius: 3px;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
}
.comment-text-area {
  padding: 10px;
  font-size: 12pt;
  font-weight: bold;
  color: #6771e4;
  border: solid 1px #eaeaea;
  border-radius: 3px;
  margin-bottom: 10px;
  width: 100%;
  transition: all 0.3s ease;
}
.comment-text-area:focus {
  outline: none;
  border-color: #d3d9e4;
  box-shadow: 0px 0px 40px -20px #6771e4;
}
</style>