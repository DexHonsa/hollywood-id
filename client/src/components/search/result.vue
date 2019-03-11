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
            @click="$router.push('/admin/edit_listing/' + $route.params.id)"
            v-if="user.role == 'admin' && $mq  != 'sm'"
            class="edit-listing-btn"
          >
            <i class="fal fa-edit"></i>&nbsp;&nbsp;Edit Listing
          </div>

          <div
            v-if="result.image != null"
            class="result-panel-image"
            :style="'background-image:url(/api/static/' + result.image + ')'"
          ></div>
          <div v-if="result.image == undefined" class="result-panel-image">
            <div
              style="height:250px; width:250px; display:flex;align-items:center; justify-content:center; background:#d3dbde"
            >
              <i class="fa fa-user-circle"></i>
            </div>
          </div>
          <div class="result-panel-title-box">
            <div class="result-panel-title">{{result.name}}</div>

            <div class="row">
              <div
                v-if="result.titles != null && result.titles != ''"
                class="result-panel-types col-sm-12 col-md-6"
              >
                <div
                  v-for="(typ, index) in result.titles"
                  :key="index"
                  :class="'actor'"
                  class="result-panel-type"
                >{{typ}}</div>
              </div>
            </div>
            <stars
              :rating="Math.round(result.rating * 10) / 10"
              :numberOfRatings="result.number_of_ratings"
            />
            <hr v-if="$mq != 'sm'" style="border-color:#eaeaea; border-width:2px;">
          </div>
        </div>
        <div class="result-main-content">
          <div class="side-bar-details">
            <div v-if="result.address1 != null">
              <div class="result-content-item">
                <div class="result-content-item-title">Street Address</div>
                <div class="result-content-item-value">{{result.address1}}</div>
              </div>
            </div>
            <div v-if="result.email != null">
              <div class="result-content-item">
                <div class="result-content-item-title">Email</div>
                <div class="result-content-item-value" v-html="emailThis(result.email)"></div>
              </div>
            </div>
            <div v-if="result.deal != null">
              <div class="result-content-item">
                <div class="result-content-item-title">Deal</div>
                <div class="result-content-item-value">{{result.deal}}</div>
              </div>
            </div>
            <div v-if="result.company_web != null">
              <div class="result-content-item">
                <div class="result-content-item-title">Company Website</div>
                <div class="result-content-item-value" v-html="linkThis(result.company_web)"></div>
              </div>
            </div>

            <div v-if="result.rep_name != null">
              <div class="result-content-item">
                <div class="result-content-item-title">Representation</div>
                <div class="result-content-item-value">{{result.rep_name}}</div>
              </div>
            </div>
            <div v-if="result['rep_email'] != null">
              <div class="result-content-item">
                <div class="result-content-item-title">Representation Email</div>
                <div class="result-content-item-value" v-html="emailThis(result['rep_email'])"></div>
              </div>
            </div>
            <div v-if="result['rep_phone'] != null">
              <div class="result-content-item">
                <div class="result-content-item-title">Rep Number</div>
                <div class="result-content-item-value">{{result['rep_phone']}}</div>
              </div>
            </div>
            <div v-if="result.representation != null">
              <div class="result-content-item">
                <div class="result-content-item-title">Representation</div>
                <div class="result-content-item-value">{{result.representation}}</div>
              </div>
            </div>
            <div v-if="result.rep_phone != null">
              <div class="result-content-item">
                <div class="result-content-item-title">Representation Phone</div>
                <div class="result-content-item-value">{{result.rep_phone}}</div>
              </div>
            </div>
            <div v-if="result.title != null">
              <div class="result-content-item">
                <div class="result-content-item-title">Title</div>
                <div class="result-content-item-value">{{result.title}}</div>
              </div>
            </div>
            <div v-if="result.company != null">
              <div class="result-content-item">
                <div class="result-content-item-title">Company</div>
                <div class="result-content-item-value">{{result.company}}</div>
              </div>
            </div>
            <div v-if="result.studio_executive != null">
              <div class="result-content-item">
                <div class="result-content-item-title">Executive</div>
                <div
                  class="result-content-item-value"
                >Studio Executive at {{result.studio_executive}}</div>
              </div>
            </div>
            <div v-if="result.network_executive != null">
              <div class="result-content-item">
                <div class="result-content-item-title">Executive</div>
                <div
                  class="result-content-item-value"
                >Network Executive at {{result.network_executive}}</div>
              </div>
            </div>
          </div>
          <div class="result-content">
            <div style="min-width:100%;" class="row">
              <div v-if="worksLoading" class="works-loading">
                <img style="width:55px;" src="../../img/double_loader.svg" alt>
              </div>
              <div v-if="films.length > 0" class="col-sm-12">
                <div class="credits-item film">
                  <div class="credits-icon">
                    <img src="../../img/film_icon.png" alt>
                  </div>
                  <div class="credits-container">
                    <div class="credits-item-title">Acted In</div>
                    <div class="credits-item-value">
                      <div class="film-item" v-for="(film, i) in films" :key="i">
                        <div v-if="film.poster_path != 'N/A'" class="film-poster">
                          <!-- <a :href="film.imdburl"> -->
                          <img
                            :src="`https://image.tmdb.org/t/p/w150_and_h225_bestv2${film.poster_path}`"
                            alt
                          >
                          <!-- </a> -->
                        </div>
                        <div v-else class="film-poster">
                          <div class="no-credit">
                            <i class="fal fa-film"></i>
                          </div>
                        </div>
                        <div class="film-content">
                          <div class="film-title">{{film.title}}</div>
                          <div class="film-details">{{film.character}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style="min-width:100%;" class="row">
              <div v-if="crewCredits.length > 0" class="col-sm-12">
                <div class="credits-item film">
                  <div class="credits-icon">
                    <img src="../../img/film_icon.png" alt>
                  </div>
                  <div class="credits-container">
                    <div class="credits-item-title">Worked On Films</div>
                    <div class="credits-item-value">
                      <div class="film-item" v-for="(film, i) in crewCredits" :key="i">
                        <div v-if="film.poster_path != 'N/A'" class="film-poster">
                          <!-- <a :href="film.imdburl"> -->
                          <img
                            :src="`https://image.tmdb.org/t/p/w150_and_h225_bestv2${film.poster_path}`"
                            alt
                          >
                          <!-- </a> -->
                        </div>
                        <div v-else class="film-poster">
                          <div class="no-credit">
                            <i class="fal fa-film"></i>
                          </div>
                        </div>
                        <div class="film-content">
                          <div class="film-title">{{film.title}}</div>
                          <div class="film-details">{{film.job}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div v-if="tv.length > 0" class="col-sm-12">
                <div class="credits-item film">
                  <div class="credits-icon">
                    <img src="../../img/film_icon.png" alt>
                  </div>
                  <div class="credits-container">
                    <div class="credits-item-title">Appeared in TV</div>
                    <div class="credits-item-value">
                      <div class="film-item" v-for="(film, i) in tv" :key="i">
                        <div v-if="film.poster_path != 'N/A'" class="film-poster">
                          <!-- <a :href="film.imdburl"> -->
                          <img
                            :src="`https://image.tmdb.org/t/p/w150_and_h225_bestv2${film.poster_path}`"
                            alt
                          >
                          <!-- </a> -->
                        </div>
                        <div v-else class="film-poster">
                          <div class="no-credit">
                            <i class="fal fa-film"></i>
                          </div>
                        </div>
                        <div class="film-content">
                          <div class="film-title">{{film.name}}</div>
                          <div class="film-details">{{film.character}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style="min-width:100%;" class="row">
              <div v-if="tvCredits.length > 0" class="col-sm-12">
                <div class="credits-item film">
                  <div class="credits-icon">
                    <img src="../../img/film_icon.png" alt>
                  </div>
                  <div class="credits-container">
                    <div class="credits-item-title">Worked On TV</div>
                    <div class="credits-item-value">
                      <div class="film-item" v-for="(film, i) in tvCredits" :key="i">
                        <div v-if="film.poster_path != 'N/A'" class="film-poster">
                          <!-- <a :href="film.imdburl"> -->
                          <img
                            :src="`https://image.tmdb.org/t/p/w150_and_h225_bestv2${film.poster_path}`"
                            alt
                          >
                          <!-- </a> -->
                        </div>
                        <div v-else class="film-poster">
                          <div class="no-credit">
                            <i class="fal fa-film"></i>
                          </div>
                        </div>
                        <div class="film-content">
                          <div class="film-title">{{film.name}}</div>
                          <div class="film-details">{{film.job}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="more.length > 0" class="result-more">
              <div style="color:#000" class="result-more-title">More People at {{result.company}}</div>
              <div class="executives-container">
                <div
                  class="executive-item"
                  @click="$router.push('/results/' + exec._id)"
                  v-for="(exec, index) in more"
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

            <!--Comments-->
            <div v-if="comments.length > 0 && commentsLoaded" class="result-more">
              <div style="color:#000" class="result-more-title">Comments About {{result.name}}</div>
              <div class="executives-container">
                <div class="comment-item" v-for="(comment, index) in comments" :key="index">
                  <div
                    v-if="comment.user_image != null"
                    class="executive-image"
                    :style="'background-image:url(/api/user_uploads/' + comment.user_image + ')'"
                  ></div>
                  <div v-if="comment.user_image == undefined" class="executive-image">
                    <div
                      style="height:50px; width:50px; display:flex;align-items:center; border-radius:100px; justify-content:center; background:#d3dbde"
                    >
                      <i style="color:#fff; font-size:22pt" class="fa fa-user-circle"></i>
                    </div>
                  </div>
                  <div>
                    {{comment.user_name}}
                    <span
                      style="font-size:10pt; color:#808080; margin-left:10px; display:inline-block; font-weight:normal"
                    >{{formatDate(comment.created_at)}}</span>
                    <div class="comment-stars">
                      <i class="fa fa-star" :class="{'active' : comment.rating >= 1}"></i>
                      <i class="fa fa-star" :class="{'active' : comment.rating >= 2}"></i>
                      <i class="fa fa-star" :class="{'active' : comment.rating >= 3}"></i>
                      <i class="fa fa-star" :class="{'active' : comment.rating >= 4}"></i>
                      <i class="fa fa-star" :class="{'active' : comment.rating >= 5}"></i>
                    </div>
                    <div
                      style="display:flex; align-items:center; font-size:8pt; font-weight:300; color:#808080"
                    >
                      <span>{{comment.comment}}</span>
                    </div>
                  </div>
                  <div
                    @click="removeComment(comment._id, comment.listing_id)"
                    v-if="comment.user_id == $store.state.userStore.user.id"
                    class="modal-btn delete"
                  >
                    <span v-if="!commentDeleteLoading">Delete Comment</span>
                    <img
                      v-if="commentDeleteLoading"
                      style="width:25px"
                      src="../../img/spinner_white.svg"
                    >
                  </div>
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
import Stars from "./stars";
import { mapActions } from "vuex";
import axios from "axios";
export default {
  name: "result",
  data() {
    return {
      isLoading: true,
      films: [],
      crew: [],
      tv: [],
      tvCrew: [],
      more: [],
      comments: [],
      commentsLoaded: false,
      commentDeleteLoading: false,
      worksLoading: true
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(["getProfessional"]),
    removeComment(id, listing) {
      this.commentDeleteLoading = true;
      axios
        .post("/api/ratings/remove_rating", { id: id, listing_id: listing })
        .then(res => {
          this.commentDeleteLoading = false;
          window.location.reload();
        });
    },
    formatDate: function(date2) {
      var date = new Date(date2);
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
    init() {
      this.worksLoading = true;
      window.scrollTo(0, 0);
      this.getProfessional(this.$route.params.id).then(result => {
        axios.get(`/api/get_credits?name=${result.name}`).then(
          res => {
            var movies = res.data.movie;
            var tv = res.data.tv;
            var mC = [];
            this.films = movies.cast;
            this.crew = movies.crew;
            if (tv.cast != null) {
              this.tv = tv.cast;
            }
            this.tvCrew = tv.crew;
            this.worksLoading = false;
          },
          err => {
            this.worksLoading = false;
          }
        );
        axios
          .get("/api/ratings/get_comments/" + this.$route.params.id)
          .then(res => {
            this.comments = res.data.results;
            for (let i = 0; i < this.comments.length; i++) {
              axios.get("/api/users/" + this.comments[i].user_id).then(res => {
                this.comments[i].user_name =
                  res.data.user.first_name + " " + res.data.user.last_name;
                this.comments[i].user_image = res.data.user.image;
                if (i == this.comments.length - 1) {
                  setTimeout(() => {
                    this.commentsLoaded = true;
                  }, 500);
                }
              });
            }
          });
        this.isLoading = false;

        if (this.result.company != "" && this.result.company != null) {
          axios
            .post("/api/executives/get_executives", {
              company: this.result.company
            })
            .then(res => {
              this.more = res.data;
            });
        }
      });
    },
    linkThis(item) {
      return `<a target="_blank" href='https://` + item + `'>` + item + `</a>`;
    },
    emailThis(word) {
      return `<a href='mailto:` + word + `'>` + word + `</a>`;
    },
    getMovie(movie, type) {
      console.log(type);
      axios.get("/api/get_movie?movie=" + movie).then(
        res => {
          //console.log(res.data);
          this[type].push(res.data);
        },
        err => {
          this[type].push({ name: movie, poster: "N/A" });
          console.log("error bruh");
        }
      );
    }
  },
  computed: {
    crewCredits() {
      var credits = this.crew;
      var newCredits = [];
      for (let i = 0; i < credits.length; i++) {
        var credit = newCredits.filter(item => {
          return item.title == credits[i].title;
        });
        if (credit.length > 0) {
          credit[0].job = credit[0].job + ", " + credits[i].job;
        } else {
          newCredits.push(credits[i]);
        }
      }
      return newCredits;
    },
    tvCredits() {
      var credits = this.tvCrew;
      var newCredits = [];
      for (let i = 0; i < credits.length; i++) {
        var credit = newCredits.filter(item => {
          return item.title == credits[i].title;
        });
        if (credit.length > 0) {
          credit[0].job = credit[0].job + ", " + credits[i].job;
        } else {
          newCredits.push(credits[i]);
        }
      }
      return newCredits;
    },
    user() {
      return this.$store.state.userStore.user;
    },
    path() {
      return this.$route.path;
    },
    result() {
      return this.$store.state.professionalStore.activeProfessional;
    }
  },
  watch: {
    path() {
      this.isLoading = true;
      this.films = [];
      this.tv = [];
      this.crew = [];
      this.init();
    }
  },
  components: {
    Stars
  }
};
</script>
<style scoped>
.result-content {
  margin-left: 15px;
}
.fa-user-circle {
  font-size: 140pt;
  color: #fff;
}
.modal-btn {
  margin-left: auto;
}
.fa-star {
  color: #eaeaea;
}
.fa-star.active {
  color: rgb(255, 166, 0);
}
.result-content-item {
  display: block !important;
  background: none;
  border: none;
  padding-left: 35px;
}

@media (max-width: 725px) {
  .search-panel {
    border-radius: 0px;
  }
  .container {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
  .fa-user-circle {
    font-size: 50pt;
    color: #fff;
  }
}
</style>
<style>
.works-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 15px;
}
.result-main-content {
  position: relative;
  margin-top: 0px;
  display: flex;
}
.side-bar-details {
  min-width: 250px;
  max-width: 250px;
  background: #f1f1f1;
}
.comment-item {
  background: #fff;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  padding: 15px;
  color: #000;
  font-weight: bold;
  width: 100%;
  border: solid 1px #eaeaea;
  border-radius: 3px;
}
.comment-item span {
  font-size: 12pt;
}
.edit-listing-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  color: #5d9ab1;
  padding: 15px;
  font-weight: bold;
  transition: all 0.3s ease;
  user-select: none;
}
.edit-listing-btn:hover {
  color: #000;
  cursor: pointer;
  transform: translateY(-5px);
}
.edit-listing-btn:active {
  color: #5d9ab1;
  transition: none;
}
.result-more-title {
  font-size: 15pt;
  font-weight: bold;
  color: #000;
  text-align: left;
  padding: 15px;
}
.result-more {
  border-top: solid 1px rgb(234, 234, 234);
  margin-bottom: 15px;
}
.double-loader {
  position: relative;
  z-index: 100000000;
  height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.double-loader img {
  width: 50px;
}
.result-panel-top {
  display: flex;
  margin-top: 30px;
  align-items: center;
  position: relative;
  width: 100%;
}
.result-panel-title-box {
  width: 100%;
  position: relative;
  margin-left: 15px;
}
.result-panel-title {
  color: #000;
  font-size: 34pt;
  font-weight: bold;
  color: #000;
  /* text-shadow: 0px 3px 11px rgba(0, 0, 0, 0.3), 3px -1px 2px rgba(0, 0, 0, 0.16); */
}
.result-panel-image {
  height: 250px;
  background: #fff;
  min-width: 250px;
  border-radius: 250px;
  border: solid 5px #fff;
  transform: translateY(-50px);
  box-shadow: 0px 22px 30px -8px rgba(0, 0, 0, 0.6);
  background-size: cover;
  background-position: center;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.result-panel-image img {
  height: 100%;
}
.result-panel-types {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.result-content {
  color: #000;
  flex: 1;
}
.result-panel-type {
  padding: 0px 10px;
  margin-bottom: 5px;
  height: 25px;
  display: flex;
  align-items: center;
  border-radius: 40px;
  justify-content: center;
  margin-right: 10px;
  font-weight: bold;
}
.result-panel-star-box {
  margin-left: auto;
  display: flex;
  align-items: center;
}
.result-panel-star-box i {
  font-size: 25pt;
  margin-left: 10px;
  color: #ffb300;
}
.result-content-item {
  display: flex;
  align-items: flex-start;
  padding: 10px 0px;
  background: #fff;
  padding: 15px;
  border: solid 1px #eaeaea;
  margin-top: -1px;
}

.result-content-item-title {
  font-size: 1em;
  font-weight: bold;
  position: relative;
  display: block;
  padding-right: 10px;
  z-index: 10000;
  color: #000;
}
.result-content-item-value {
  font-size: 0.9em;
  font-weight: 300;
  color: #000;
  overflow: hidden;
  width: 100%;
  text-overflow: ellipsis;
  max-width: 100%;
  text-align: left;
}
.credits-item {
  max-height: 700px;
  background: #fff;
  border: solid 1px #eaeaea;
  display: flex;
  margin-bottom: 10px;
  position: relative;
}
.credits-item.tv {
  border-color: #a6e45e;
}
.credits-item.tv .credits-icon {
  color: #a6e45e;
}
.credits-icon {
  color: #5d9bb2;
  display: none;
  left: 0;
  margin-right: 15px;
  position: absolute;
  top: 0;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 10px;
}
.credits-icon img {
  width: 50px;
}
.credits-item-title {
  font-weight: bold;
  font-size: 15pt;
  background: #f8fafb;
  text-align: left;
  padding: 15px;
}
.credits-item-value {
  font-weight: bold;
  font-size: 10pt;
  display: flex;
  height: calc(100% - 60px);
  overflow: auto;
  flex-wrap: wrap;
}
.film-item {
  padding: 10px;
  font-weight: bold;
  display: flex;
  flex-basis: 33.33333%;
  align-items: center;
}
.film-poster {
  height: 100px;
  position: relative;
}
.film-poster img {
  height: 100%;
}
.film-title {
  font-size: 11pt;
  font-weight: bold;
}
.film-content {
  margin-left: 10px;
}
.film-details {
  font-size: 0.9em;
  color: #808080;
  font-weight: 300;
}
.no-credit {
  background: rgb(234, 234, 234);
  height: 200px;
  width: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25pt;
  color: rgb(128, 128, 128);
}
.credits-container {
  width: 100%;
}
@media (max-width: 720px) {
  .credits-container {
    padding-top: 0px;
  }

  .side-bar-details {
    width: 100%;
    max-width: 100%;
    min-width: 100%;
    background: transparent;
  }
  .result-main-content {
    flex-direction: column;
  }
  .search-panel {
    border-radius: 0px;
    margin-bottom: unset;
    position: relative;
    padding-bottom: 300px;
  }
  .container {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
  .film-item {
    flex-direction: row;
    margin-bottom: 0px;
    margin-top: -1px;
    flex-basis: 100%;
    border-top: solid 1px #eaeaea;
  }
  .film-title {
    font-size: 10pt;
    font-weight: bold;
    text-align: left;
  }
  .film-content {
    margin-left: 10px;
    text-align: left;
  }
  .film-details {
    font-size: 8pt;
    color: #808080;
    text-align: left;
  }
  .film-poster {
    width: 60px !important;

    position: relative;
  }
  .no-credit {
    width: 60px;
    height: 100px;
  }
  .film-poster a {
    width: 100%;
    height: unset;
  }
  .film-poster a img {
    width: 100%;
  }
  .result-content-item-title {
    font-size: 10pt;
    padding-right: 10px;
  }
  .result-content-item-value {
    font-size: 10pt;
    text-align: left;
  }
  .credits-item {
    padding: 0;
  }
  .credits-item-title {
    font-size: 15pt;
    text-align: center;
  }
  .credits-item-value {
    font-size: 9pt;
  }
  .result-content {
    padding: 5px;
    color: #000;
  }
  .result-panel-title {
    font-size: 16pt;
  }
  .result-panel-image {
    transform: translateY(-10px);
    height: 80px !important;
    width: 110px !important;
    min-width: unset;
    min-height: unset;
    border-radius: 70px;
    border: solid 3px #fff;
    box-shadow: 0px 8px 10px -8px rgba(0, 0, 0, 0.6);
  }
  .result-panel-type {
    padding: 0px 5px;
    min-width: 50px;
    height: 18px;
    font-size: 8pt;
    display: flex;
    align-items: center;
    border-radius: 40px;
    justify-content: center;
    margin-right: 3px;
    font-weight: bold;
  }
  .result-panel-star-box i {
    font-size: 15pt;
    margin-top: 10px;
    margin-left: unset;
    margin-right: 10px;
    color: #cae7f2;
  }
  .result-content {
    margin-left: 0 !important;
  }
  .result-panel-top {
    margin-top: 0;
  }
}
</style>
