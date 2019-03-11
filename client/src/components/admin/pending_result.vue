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
          <!-- <div
            @click="$router.push('/admin/edit_listing/' + $route.params.id)"
            v-if="user.role == 'admin' && $mq  != 'sm'"
            class="edit-listing-btn"
          >
            <i class="fal fa-edit"></i>&nbsp;&nbsp;Edit Listing
          </div>-->
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

            <hr v-if="$mq != 'sm'" style="border-color:#eaeaea; border-width:2px;">
          </div>
        </div>
        <div class="result-content">
          <div class="row">
            <div v-if="result.address1 != null" class="col-sm-6">
              <div class="result-content-item">
                <div class="result-content-item-title">Street Address</div>
                <div class="result-content-item-value">{{result.address1}}</div>
              </div>
            </div>
            <div v-if="result.email != null" class="col-sm-6">
              <div class="result-content-item">
                <div class="result-content-item-title">Email</div>
                <div class="result-content-item-value" v-html="emailThis(result.email)"></div>
              </div>
            </div>
            <div v-if="result.deal != null" class="col-sm-6">
              <div class="result-content-item">
                <div class="result-content-item-title">Deal</div>
                <div class="result-content-item-value">{{result.deal}}</div>
              </div>
            </div>
            <div v-if="result.company_web != null" class="col-sm-6">
              <div class="result-content-item">
                <div class="result-content-item-title">Company Website</div>
                <div class="result-content-item-value" v-html="linkThis(result.company_web)"></div>
              </div>
            </div>

            <div v-if="result.rep_name != null" class="col-sm-6">
              <div class="result-content-item">
                <div class="result-content-item-title">Representation</div>
                <div class="result-content-item-value">{{result.rep_name}}</div>
              </div>
            </div>
            <div v-if="result['rep_email'] != null" class="col-sm-6">
              <div class="result-content-item">
                <div class="result-content-item-title">Representation Email</div>
                <div class="result-content-item-value" v-html="emailThis(result['rep_email'])"></div>
              </div>
            </div>
            <div v-if="result['rep_phone'] != null" class="col-sm-6">
              <div class="result-content-item">
                <div class="result-content-item-title">Rep Number</div>
                <div class="result-content-item-value">{{result['rep_phone']}}</div>
              </div>
            </div>
            <div v-if="result.representation != null" class="col-sm-6">
              <div class="result-content-item">
                <div class="result-content-item-title">Representation</div>
                <div class="result-content-item-value">{{result.representation}}</div>
              </div>
            </div>
            <div v-if="result.rep_phone != null" class="col-sm-6">
              <div class="result-content-item">
                <div class="result-content-item-title">Representation Phone</div>
                <div class="result-content-item-value">{{result.rep_phone}}</div>
              </div>
            </div>
            <div v-if="result.title != null" class="col-sm-6">
              <div class="result-content-item">
                <div class="result-content-item-title">Title</div>
                <div class="result-content-item-value">{{result.title}}</div>
              </div>
            </div>
            <div v-if="result.company != null" class="col-sm-6">
              <div class="result-content-item">
                <div class="result-content-item-title">Company</div>
                <div class="result-content-item-value">{{result.company}}</div>
              </div>
            </div>
            <div v-if="result.studio_executive != null" class="col-sm-6">
              <div class="result-content-item">
                <div class="result-content-item-title">Executive</div>
                <div
                  class="result-content-item-value"
                >Studio Executive at {{result.studio_executive}}</div>
              </div>
            </div>
            <div v-if="result.network_executive != null" class="col-sm-6">
              <div class="result-content-item">
                <div class="result-content-item-title">Executive</div>
                <div
                  class="result-content-item-value"
                >Network Executive at {{result.network_executive}}</div>
              </div>
            </div>
          </div>
          <div style="min-width:100%;" class="row">
            <div v-if="result['film_credits'] != null" class="col-sm-6">
              <div class="credits-item film">
                <div class="credits-icon">
                  <img src="../../img/film_icon.png" alt>
                </div>
                <div class="credits-container">
                  <div class="credits-item-title">Film Credits</div>
                  <div class="credits-item-value">
                    <div class="film-item" v-for="(film, i) in films" :key="i">
                      <div v-if="film.poster != 'N/A'" class="film-poster">
                        <a :href="film.imdburl">
                          <img :src="film.poster" alt>
                        </a>
                      </div>
                      <div v-else class="film-poster">
                        <div class="no-credit">
                          <i class="fal fa-film"></i>
                        </div>
                      </div>
                      <div class="film-content">
                        <div class="film-title">{{film.name}}</div>
                        <div class="film-details">{{film.production}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="result['tv_credits'] != null" class="col-sm-6">
              <div class="credits-item tv">
                <div class="credits-icon">
                  <img src="../../img/tv_icon.png" alt>
                </div>
                <div class="credits-container">
                  <div class="credits-item-title">TV Credits</div>
                  <div class="credits-item-value">
                    <div class="film-item" v-for="(film, i) in tv" :key="i">
                      <div v-if="film.poster != 'N/A'" class="film-poster">
                        <a :href="film.imdburl">
                          <img :src="film.poster" alt>
                        </a>
                      </div>
                      <div v-else class="film-poster">
                        <div class="no-credit">
                          <i class="fal fa-film"></i>
                        </div>
                      </div>
                      <div class="film-content">
                        <div class="film-title">{{film.name}}</div>
                        <div class="film-details">{{film.genres}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--Comments-->
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import axios from "axios";
export default {
  name: "result",
  data() {
    return {
      isLoading: true,
      films: [],
      tv: [],
      more: [],
      comments: [],
      commentsLoaded: false,
      commentDeleteLoading: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(["getPendingProfessional"]),

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
      window.scrollTo(0, 0);
      this.getPendingProfessional(this.$route.params.id).then(() => {
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
            //this.commentsLoaded = true;
          });
        this.isLoading = false;
        if (this.result["film_credits"] != null) {
          var films = this.result["film_credits"].split(",");
          if (films.length == 0 && this.result["film_credits"] != null) {
            films = [this.result["film_credits"]];
            for (var i = 0; i < films.length; i++) {
              this.getMovie(films[i], "films");
            }
          } else if (this.result["film_credits"] != "") {
            for (var i = 0; i < films.length; i++) {
              this.getMovie(films[i], "films");
            }
          }
        }

        if (this.result["tv_credits"] != null) {
          var tvs = this.result["tv_credits"].split(",");
          if (tvs.length == 0 && this.result["tv_credits"] != null) {
            tvs = [this.result["tv_credits"]];
            for (var i = 0; i < tvs.length; i++) {
              this.getMovie(tvs[i], "tv");
            }
          } else if (this.result["tv_credits"] != "") {
            for (var i = 0; i < tvs.length; i++) {
              this.getMovie(tvs[i], "tv");
            }
          }
          //console.log(tvs);
        }
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
    user() {
      return this.$store.state.userStore.user;
    },
    path() {
      return this.$route.path;
    },
    result() {
      return this.$store.state.professionalStore.activePendingProfessional;
    },
    tvCredits() {
      return this.$store.state.professionalStore.activePendingProfessional[
        "tv_credits"
      ];
    },
    filmCredits() {
      return this.$store.state.professionalStore.activePendingProfessional[
        "film_credits"
      ];
    }
  },
  watch: {
    path() {
      this.isLoading = true;
      this.init();
    }
  }
};
</script>
<style scoped>
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
