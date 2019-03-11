<template lang="html">
  <div class="overlay animated-fast fadeIn" >
    <div class="modal-1 animated-fast zoomIn" style="width: 400px">
      <div class="modal-top">
        <div class="modal-title"> Change Logo / Image</div>
        <div v-on:click="hide" class="modal-close"><img src="../../img/close.svg"/></div>
      </div>
      <div class="modal-inner">
        <div v-bind:class="{'hide':pic}" class="pic-button modal-btn cancel" style="text-align:center;position:relative">Choose Picture<input style="width:100%; height:100%;position:absolute;top:0;left:0; opacity:0;cursor:pointer;"  ref="imageUpload" @change="uploadImage" type="file"></div>

        <vue-croppie
            v-if="pic"
            ref=croppieRef
            :enableOrientation="true"
            :enableResize="false"
            :enforceBoundary="true"
            @result="result"
            :viewport="{ width: 200, height: 200, type:'circle' }"
            :boundary="{width:250,height:250, type:'circle'}"
            @update="update">
        </vue-croppie>
        
        <div v-if="hasError" class="has-error"> <i class="fal fa-exclamation-triangle"></i>&nbsp; {{errorMessage}}</div>

        <div class="modal-btn-container">
          <div @click="hide"  class="modal-btn cancel">Cancel</div>
          <div @click="crop()"  class="modal-btn confirm"><span v-if="!isLoading">Confirm</span> <img v-if="isLoading" style="width:25px" src="../../img/spinner_white.svg"/></div>
        </div>
      </div>
    </div>
    </div>
</template>

<script>
import axios from "axios";
import auth from "../../auth";
import { mapActions } from "vuex";
export default {
  props: ["hide", "upload"],
  data() {
    return {
      cropped: null,
      pic: false,
      hasError: false,
      errorMessage: "",
      isLoading: false
    };
  },
  methods: {
    ...mapActions(["setProfileUploadedImage", "setProfileUploadedFilename"]),
    uploadImage() {
      this.pic = true;
      var that = this;
      setTimeout(function() {
        var reader = new FileReader();
        reader.onload = function(e) {
          that.$refs.croppieRef.bind({
            url: e.target.result
          });
        };
        reader.readAsDataURL(that.$refs.imageUpload.files[0]);
      }, 100);
    },
    bind() {
      // Randomize cat photos, nothing special here.
      //let url = this.images[Math.floor(Math.random() * 4)];
      // Just like what we did with .bind({...}) on
      // the mounted() function above.
      // this.$refs.croppieRef.bind({
      //   url: url
      // });
    },
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(",");
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    crop() {
      this.isLoading = true;
      const options = {
        format: "png",
        circle: false
      };
      this.$refs.croppieRef.result(options, output => {
        this.cropped = output;
        var file = this.dataURLtoFile(
          this.cropped,
          this.$refs.imageUpload.files[0].name
        );
        var formData = new FormData();
        formData.append("file", file);
        //console.log(this.$refs.imageUpload.files[0].name);
        this.$refs.croppieRef.result({ type: "base64" }, output => {
          // this.setUploadedImage(output);
          // this.setUploadedFilename(this.$refs.imageUpload.files[0].name);
        });

        setTimeout(() => {
          axios
            .post(
              "/api/users/add_image/" + this.$store.state.userStore.user.id,
              formData
            )
            .then(
              res => {
                auth.getUser(this.$store.state.userStore.user.id).then(() => {
                  this.hide();
                });
              },
              err => {
                this.isLoading = false;
                this.hasError = true;
                this.errorMessage =
                  "filename already exists. Please try again.";
              }
            );
        }, 500);
      });
    },
    cropViaEvent() {
      //this.$refs.croppieRef.result(options);
    },
    result(output) {
      this.cropped = output;
    },
    update(val) {},
    rotate(rotationAngle) {
      this.$refs.croppieRef.rotate(rotationAngle);
    },
    confirmUpload() {}
  },
  computed: {}
};
</script>
<style>
.hide {
  opacity: 0;
  pointer-events: none;
  position: absolute;
}
</style>
