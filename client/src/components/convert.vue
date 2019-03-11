<template>
  <div class="convert-container">
    <textarea id="convert-me" class="convert-text"></textarea>
    <div @click="convert5" class="convert-btn">Convert</div>
    <textarea id="converted" class="converted"></textarea>
  </div>
</template>
<script>
import json from "../xlsxFiles/wp_posts.4.json";
import meta from "./wp_postmeta.json";
import json2 from "../xlsxFiles/wp_posts.json";
import json3 from "../xlsxFiles/AA.2.json";
import axios from "axios";
import listings from "../xlsxFiles/listings.json";
import Promise from "bluebird";

export default {
  name: "convert",
  data() {
    return {};
  },
  methods: {
    convert() {
      var text = json;

      var converted = json.map(item => {
        return {
          post_title: item.post_title,
          post_name: item.post_name,
          image: item.guid,
          post_type: item.post_type
        };
      });

      document.getElementById("converted").innerHTML = JSON.stringify(
        converted
      );
    },
    convert2() {
      var text = json2;

      var filtered = text.filter(item => {
        return item.post_type == "job_listing";
      });

      var people = json3;
      for (var i = 0; i < people.length; i++) {
        if (people[i].first_name != null && people[i].last_name != null) {
          var element = filtered.filter(item => {
            return (
              item.post_title == people[i].first_name + people[i].last_name
            );
          });
          if (element.length > 0) {
            people[i].post_date = element[0].post_date;
            people[i].post_status = element[0].post_status;
            people[i].post_date = element[0].post_date;
          }
          console.log(element);
        }
      }

      // var converted = text.map(item => {
      //   return {
      //     post_title: item.post_title,
      //     post_name: item.post_name,
      //     image: item.image.split("/")[item.image.split("/").length - 1],
      //     post_type: item.post_type
      //   };
      // });

      document.getElementById("converted").innerHTML = JSON.stringify(people);
    },
    convert3() {
      var people = json3;
      for (var i = 0; i < people.length; i++) {
        if (people[i].first_name != null && people[i].last_name != null) {
          var url =
            people[i].first_name.trim() +
            "-" +
            people[i].last_name.trim() +
            ".jpg";
          var element = json.filter(item => {
            return item.image == url;
          });
          // console.log(element);
          if (element.length > 0) {
            people[i].image = element[0].image;
          }
        }
      }
      // console.log(people);
      document.getElementById("converted").innerHTML = JSON.stringify(people);
    },
    convert4() {
      var newArr = [];

      var promises = [];

      // console.log(people.length);

      for (var i = 1; i < 21; i++) {
        var data = [];
        for (
          var p = Math.round((people.length / 20) * i);
          p < Math.round((people.length / 20) * (i + 1));
          p++
        ) {
          if (people[p] != null) {
            data.push(people[p]);
          }
          //console.log(people[p]);
        }
        //console.log(data);
        promises.push(axios.post("api/listings/add", data));
      }

      Promise.map(promises, promise => {}, { concurrency: 2 }).then(() => {
        console.log("done");
      });
    },
    convert5() {
      var newArr = [];

      for (let i = 0; i < listings.length; i++) {
        var allMetas = meta.filter(item => {
          return item.post_id == listings[i].id;
        });
        for (let p = 0; p < allMetas.length; p++) {
          var address = allMetas.filter(item => {
            return item.meta_key == "geolocation_formatted_address";
          });

          if (listings[i].address1 == null && address.length > 0) {
            listings[i].address1 = address[0].meta_value;
          }
        }
        listings[i].rating = 0;
        listings[i].number_of_ratings = 0;
        newArr.push(listings[i]);
      }
      document.getElementById("converted").innerHTML = JSON.stringify(newArr);
    },
    removeDuplicates() {
      var obj = {};
      var people = json3;
      for (var i = 0, len = people.length; i < len; i++) {
        if (obj[people[i]["name"]] != null) {
          if (people[i]["tv credits"] != null) {
            obj[people[i]["name"]] = people[i];
          }
        } else {
          obj[people[i]["name"]] = people[i];
        }
      }

      people = new Array();
      for (var key in obj) people.push(obj[key]);

      document.getElementById("converted").innerHTML = JSON.stringify(people);
    }
    // document.getElementById("converted").innerHTML = JSON.stringify(newArr);
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
