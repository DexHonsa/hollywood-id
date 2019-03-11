<template>
  <div>
    <div>
      <div
        class="net"
        :style="'background-image:url('+require('../../img/hollywood_blue_blur.jpg')+')'"
      ></div>
      <div class="container">
        <div class="search-panel animated-med fadeInUp">
          <div class="search-panel-top">
            <div class="search-panel-title">Pending Listings</div>
          </div>
          <div class="search-panel-filters">
            <form class="search-panel-search-bar" @submit.prevent="submitForm">
              <div class="row">
                <div class="col-sm-12 col-md-4 middle-align" style="position:relative;">
                  <StandardInput
                    name="term"
                    width="100%"
                    placeholder="Search"
                    v-model="searchTerm"
                    :value="searchTerm"
                    :onFocus="inputFocus"
                    :onChange="updateSearchTerm"
                    icon="fa-search"
                  />
                </div>
                <div class="col-sm-12 col-md-4 middle-align">
                  <MultiSelect
                    name="categories"
                    placeholder="Category"
                    width="100%"
                    :value="categoryOptions"
                    :options="[
                                {label:'Actor', value:'actor'},
                                {label:'Actress', value:'actress'},
                                {label:'Producer', value:'producer'},
                                {label:'Writer', value:'writer'},
                                {label:'Partner', value:'partner'},
                                {label:'Agent', value:'agent'},
                                {label:'Production', value:'production'},
                                {label:'Company', value:'company'}
                                
                                ]"
                    :onChange="selectCategory"
                  />
                </div>
                <div class="col-sm-12 col-md-4 middle-align">
                  <button id="searchBtn" type="submit" class="modal-btn search-term-btn confirm">
                    <img v-if="isLoading" style="width:20px;" src="../../img/spinner_white.svg" alt>
                    <span v-if="!isLoading">Search</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div v-if="totalResults > 0" class="row">
            <div class="col-sm-12">
              <div class="total-results">{{totalResults}} Results Found</div>
            </div>
          </div>
          <div class="search-panel-results">
            <div v-if="isLoading" class="search-results-loading">
              <img style="width:100px;" src="../../img/search_spinner.svg" alt>
            </div>
            <div v-if="!isLoading" class="table-container">
              <table class="project-view-table">
                <tbody>
                  <tr>
                    <th></th>
                    <th @click="sortBy('name')">
                      Name
                      <i
                        v-if="sortKey == 'name'"
                        v-bind:class="{'fa fa-caret-down':!reverse,'fa fa-caret-up': reverse }"
                      ></i>
                    </th>
                    <th @click="sortBy('type')">
                      Created By
                      <i
                        v-if="sortKey == 'type'"
                        v-bind:class="{'fa fa-caret-down':!reverse,'fa fa-caret-up': reverse }"
                      ></i>
                    </th>
                    <th>Approval</th>
                    <!-- <th @click="sortBy('representation')">
                      Representation
                      <i
                        v-if="sortKey == 'representation'"
                        v-bind:class="{'fa fa-caret-down':!reverse,'fa fa-caret-up': reverse }"
                      ></i>
                    </th>-->
                  </tr>
                  <tr
                    v-for="(result, i) in orderedResults"
                    :key="i"
                    @click="$router.push('/admin/pending_results/' + result._id)"
                  >
                    <td class="icon">
                      <div
                        class="result-image"
                        v-if="result.image != null"
                        :style="'background-image:url(/api/static/' + result.image + ')'"
                      ></div>
                      <div v-if="result.image == undefined" class="result-image">
                        <div
                          style="height:100%; width:100%; display:flex;align-items:center; justify-content:center; background:#d3dbde"
                        >
                          <i style="color:#fff; font-size:20pt" class="fa fa-user-circle"></i>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span>
                        {{result.name}}
                        <div
                          style="display:flex; align-items:center;  font-weight:300; color:#808080"
                        >
                          <span
                            style="margin-right:5px; font-size:8pt;"
                            v-for="(title, index) in result.titles"
                            :key="index"
                          >{{title}}</span>
                        </div>
                      </span>
                    </td>
                    <td>
                      <div>{{result.user_email}}</div>
                    </td>
                    <td>
                      <div style="display:flex;align-items:center;">
                        <div
                          style="max-width:150px;margin-left:auto;"
                          class="modal-btn confirm"
                          @click.stop="approveListing(result._id)"
                          v-tooltip="'Approve Listing'"
                        >
                          <img
                            v-if="approvalLoading"
                            style="width:20px;"
                            src="../../img/spinner_white.svg"
                            alt
                          >
                          <div v-if="!approvalLoading">
                            <i class="fa fa-thumbs-up"></i>
                          </div>
                        </div>
                        <div
                          style="max-width:150px;margin-left:15px;"
                          class="modal-btn delete"
                          @click.stop="rejectListing(result._id)"
                          v-tooltip="'Reject Listing'"
                        >
                          <img
                            v-if="rejectLoading"
                            style="width:20px;"
                            src="../../img/spinner_white.svg"
                            alt
                          >
                          <div v-if="!rejectLoading">
                            <i class="fa fa-thumbs-down"></i>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr class="blank-row" v-if="results.length == 0">
                    <td colspan="4" style="text-align:center; padding: 100px 0px !important;">
                      <img style="width:100px;" src="../../img/search_results.svg" alt>
                      <br>
                      <span
                        style="font-size:12pt; font-weight:bold; margin-top:10px; display:inline-block"
                      >No Results Found</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="pages">
                Viewing {{orderedResults.length}} of {{totalResults}}
                <ul>
                  <li
                    v-for="(page,i) in pageNumbers"
                    :key="i"
                    v-bind:class="{'active':checkActivePage(page)}"
                    @click="activatePage(page)"
                  >{{page}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import StandardInput from "../form_elements/standard_input_icon";
import StandardSelect from "../form_elements/custom_select";
import MultiSelect from "../form_elements/multi_select";
import axios from "axios";
import _ from "lodash";

export default {
  name: "search_home",
  data() {
    return {
      count: "",
      sortKey: "result_name",
      reverse: false,
      blank: false,
      pageNumbers: [],
      pageActive: Number(this.$route.query.page),
      searchTerm: "",
      suggestions: [],
      isLoading: false,
      categories: [],
      categoryOptions: [],
      results: [],
      totalResults: 0,
      activePage: null,
      suggestionsOpen: false,
      suggestionsLoaded: true,
      approvalLoading: false,
      rejectLoading: false
    };
  },
  $_veeValidate: {
    validator: "new" // give me a new validator each time.
  },
  created() {
    window.scrollTo(0, 0);
    this.activePage = this.$route.query.page;
    if (this.$route.query.term != null) {
      this.searchTerm = this.$route.query.term;

      if (this.$route.query.categories[0] == undefined) {
        this.categories = [];
        this.categoryOptions = [];
      } else {
        this.categories = this.$route.query.categories.split(",");

        var cat = this.$route.query.categories;
        var cats = cat.split(",");
        var arr = [];
        for (var i = 0; i < cats.length; i++) {
          var obj = { label: "", value: "" };
          obj.label = this.cap(cats[i]);
          obj.value = cats[i];
          arr.push(obj);
        }
        this.categoryOptions = arr;
      }
    }
  },
  mounted() {
    var btn = window.document.getElementById("searchBtn");
    btn.click();
  },
  computed: {
    orderedResults() {
      return this.orderResults();
    }
  },
  methods: {
    async getUser(id) {
      let res = await axios.get("/api/users/" + id);

      return res.data.user.email;
    },
    approveListing(id) {
      console.log(id);
      this.approvalLoading = true;
      axios
        .get("/api/professionals/approve_pending_listing/" + id)
        .then(res => {
          window.location.reload();
        });
    },
    rejectListing(id) {
      this.approvalLoading = true;
      axios.get("/api/professionals/reject_pending_listing/" + id).then(res => {
        window.location.reload();
      });
    },
    selectSuggestion(name) {
      this.searchTerm = name;
      this.suggestionsOpen = false;
      // this.getSuggestions();
      var btn = window.document.getElementById("searchBtn");
      btn.click();
    },
    inputFocus(val) {
      setTimeout(() => {
        this.suggestionsOpen = val;
      }, 100);
    },
    getSuggestions() {
      this.suggestionsLoaded = false;
      if (this.searchTerm != "") {
        axios
          .get("/api/professionals/autocomplete?term=" + this.searchTerm)
          .then(res => {
            this.suggestionsLoaded = true;
            this.suggestions = res.data;
          });
      } else {
        this.suggestions = [];
      }
    },
    cap(string) {
      if (typeof string == "string") {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    },
    selectCategory(val) {
      this.categoryOptions = val;
      var cats = [];
      for (var i = 0; i < val.length; i++) {
        cats.push(val[i].value);
      }
      this.categories = cats;
    },
    submitForm(event) {
      this.suggestionsOpen = false;
      var that = this;
      this.isLoading = true;

      if (
        this.searchTerm != this.$route.query.term ||
        this.categories.join() != this.$route.query.categories
      ) {
        this.activePage = 1;
      }
      setTimeout(function() {}, 2000);
      event.preventDefault();
      var form = event.target;
      var data = new FormData(form);
      data = data.entries();
      var obj = data.next();
      var retrieved = {};
      while (undefined !== obj.value) {
        retrieved[obj.value[0]] = obj.value[1];
        obj = data.next();
      }

      retrieved.categories = this.categories;
      retrieved.term = this.searchTerm;
      retrieved.page = this.activePage;
      // if (retrieved.categories[0] == null) {
      //   retrieved.categories = [];
      // }

      this.$router.push({
        query: {
          term: this.searchTerm,
          categories: this.categories.join(),
          page: this.activePage
        }
      });
      this.$validator.validateAll().then(result => {
        if (!result) {
          return;
        }

        axios
          .post("/api/professionals/search_pending", retrieved)
          .then(async res => {
            var newList = res.data.items;
            for (var i = 0; i < newList.length; i++) {
              newList[i].user_email = await this.getUser(newList[i].created_by);
            }
            this.results = newList;
            this.totalResults = res.data.total;
            this.isLoading = false;
          });
      });
    },
    updateSearchTerm: _.debounce(function(val) {
      if (this.suggestionsOpen == false) {
        // this.suggestionsOpen = true;
      }
      this.searchTerm = val;

      // this.getSuggestions();
    }, 300),
    checkActivePage(page) {
      if (page === this.pageActive) {
        return true;
      } else {
        return false;
      }
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
    orderResults() {
      this.pageNumbers = [];
      var activePage = this.pageActive;
      var numberPerPage = 10;

      var order;
      if (this.reverse) {
        order = "desc";
      } else {
        order = "asc";
      }
      var ordered = _.orderBy(this.results, this.sortKey, order);

      var numberOfPages = Math.ceil(this.totalResults / numberPerPage);
      for (var i2 = 1, len2 = numberOfPages; i2 <= len2; i2++) {
        var number = i2;
        this.pageNumbers.push(number);
      }

      var pageToShow = [];
      this.count = ordered.length;
      for (var i = 0, len = this.totalResults; i < len; i++) {
        var itemsToShow = activePage * numberPerPage;
        var startingPoint = itemsToShow - numberPerPage;
        if (startingPoint <= i && i < itemsToShow) {
          pageToShow.push(ordered[i]);
        }
      }
      // console.log(ordered);
      // console.log(pageToShow);
      return ordered;
    },
    activatePage(page) {
      this.isLoading = true;
      var retrieved = {};
      retrieved.categories = this.categories;
      retrieved.term = this.searchTerm;
      retrieved.page = page;

      this.pageActive = page;
      this.$router.push({
        query: {
          term: this.searchTerm,
          categories: this.categories.join(),
          page: page
        }
      });

      axios.post("/api/professionals/search", retrieved).then(res => {
        this.results = res.data.items;
        // this.orderResults();
        this.totalResults = res.data.total;
        this.isLoading = false;
      });
    },
    sortBy: function(field) {
      this.sortKey = field;
      if (this.sortKey === field) {
        this.reverse = !this.reverse;
      } else {
        this.reverse = false;
      }
    }
  },
  components: {
    StandardInput,
    StandardSelect,
    MultiSelect
  }
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
