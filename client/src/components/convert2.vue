<template>
  <div class="convert-container">
    <textarea id="convert-me" class="convert-text"></textarea>
    <div @click="convert4" class="convert-btn">Convert</div>
    <textarea id="converted" class="converted"></textarea>
  </div>
</template>
<script>
import meta from "./wp_postmeta.json";
import postData from "../xlsxFiles/wp_posts.json";

import boiledDown from "../xlsxFiles/wp_posts.4.json";

import complete from "../xlsxFiles/AA.2.json";

import Promise from "bluebird";

export default {
  name: "convert",
  data() {
    return {};
  },
  methods: {
    convert4() {
      for (var i = 0; i < complete.length; i++) {
        for (var p = 0; p < postData.length; p++) {
          if (postData[p].ID == complete[i].id) {
            complete[i].job_titles = postData[p].post_content;
          }
        }
      }
      document.getElementById("converted").innerHTML = JSON.stringify(complete);
    },
    convert() {
      var newArr = [];
      for (var i = 0; i < boiledDown.length; i++) {
        var obj = boiledDown[i];
        var id = boiledDown[i].id;
        var imageId = boiledDown[i].image_id;
        obj.name = boiledDown[i].post_title;
        for (var p = 0; p < meta.length; p++) {
          if (meta[p].post_id == imageId) {
            if (meta[p].meta_key == "_wp_attached_file") {
              obj.image = meta[p].meta_value.split("/")[
                meta[p].meta_value.split("/").length - 1
              ];
            }
          }
          if (meta[p].post_id == id) {
            if (meta[p].meta_key == "_talent_credits") {
              obj.film_credits = meta[p].meta_value;
            }
            if (meta[p].meta_key == "_talent_tv_credits") {
              obj.tv_credits = meta[p].meta_value;
            }
            if (meta[p].meta_key == "_phone") {
              obj.phone = meta[p].meta_value;
            }
            if (meta[p].meta_key == "_talent_company") {
              obj.company = meta[p].meta_value;
            }
            if (meta[p].meta_key == "_talent_deal") {
              obj.deal = meta[p].meta_value;
            }
            if (meta[p].meta_key == "_talent_representation_phone") {
              obj.rep_phone = meta[p].meta_value;
            }
            if (meta[p].meta_key == "_talent_representation_email") {
              obj.rep_email = meta[p].meta_value;
            }
            if (meta[p].meta_key == "_talent_mailing_address") {
              obj.address1 = meta[p].meta_value;
            }
            if (meta[p].meta_key == "_talent_email") {
              obj.email = meta[p].meta_value;
            }
            if (meta[p].meta_key == "_company_twitter") {
              obj.twitter = meta[p].meta_value;
            }
            if (meta[p].meta_key == "_thd_type") {
              obj.type = meta[p].meta_value;
            }
            if (meta[p].meta_key == "_talent_representation") {
              obj.representation = meta[p].meta_value;
            }
            if (meta[p].meta_key == "_talent_representation_url") {
              obj.rep_web = meta[p].meta_value;
            }
            if (meta[p].meta_key == "_talent_website_url") {
              obj.web = meta[p].meta_value;
            }
            if (meta[p].meta_key == "_talent_imdb_url") {
              obj.imdb_web = meta[p].meta_value;
            }
            if (meta[p].meta_key == "_talent_company_url") {
              obj.company_web = meta[p].meta_value;
            }
          }
        }
        newArr.push(obj);
      }
      document.getElementById("converted").innerHTML = JSON.stringify(newArr);
      console.log(newArr);
    },
    convert2() {
      var newArr = [];
      for (var i = 0; i < boiledDown.length; i++) {
        var newEntry = boiledDown[i];
        var name = newEntry.post_name;
        var obj = postData.filter(item => {
          return item.post_name == name;
        });
        var id = obj[0].ID;
        newEntry.id = id;
        newArr.push(newEntry);
      }

      document.getElementById("converted").innerHTML = JSON.stringify(newArr);
    },
    convert3() {
      var newArr = [];
      var boil = boiledDown;
      for (var i = 0; i < postData.length; i++) {
        // var obj = {
        //   id: "",
        //   post_title: "",
        //   post_name: "",
        //   image: ""
        // };
        if (postData[i].post_type == "attachment") {
          if (postData[i].post_parent != null) {
            for (var p = 0; p < boil.length; p++) {
              if (boil[p].id == postData[i].post_parent) {
                boil[p].image_id = postData[i].ID;
              }
            }
          }
          //newArr.push(obj);
        }
      }
      document.getElementById("converted").innerHTML = JSON.stringify(boil);
    },
    clearBlanks() {
      var newArr = [];
      for (var i = 0; i < complete.length; i++) {
        var obj = {};
        for (var p = 0; p < Object.keys(complete[i]).length; p++) {
          if (complete[i][Object.keys(complete[i])[p]] != "") {
            obj[Object.keys(complete[i])[p]] =
              complete[i][Object.keys(complete[i])[p]];
          }
        }
        newArr.push(obj);
      }
      document.getElementById("converted").innerHTML = JSON.stringify(newArr);
    }
  },
  computed: {},
  components: {}
};
</script>

<style>
.convert-container {
  width: 100%;
}
.convert-text {
  width: 100%;
  height: 500px;
  padding: 5px;
  font-size: 7pt;
}
.converted {
  width: 100%;
  height: 500px;
  padding: 5px;
  font-size: 7pt;
}
.convert-btn {
  background: #3080e8;
  border-radius: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  height: 40px;
  padding: 0px 15px;
  color: #fff;
  font-size: 10pt;
  margin: 15px;
}
</style>
