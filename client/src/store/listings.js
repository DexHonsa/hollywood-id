import axios from "axios";
var initialState = {
  projects: []
};

export default {
  state: {
    uploadedImage: "",
    uploadedFilename: ""
  },
  mutations: {
    SET_UPLOADED_IMAGE(state, payload) {
      state.uploadedImage = payload;
    },
    SET_UPLOADED_FILENAME(state, payload) {
      state.uploadedFilename = payload;
    }
  },

  actions: {
    setUploadedImage({ commit }, payload) {
      commit("SET_UPLOADED_IMAGE", payload);
    },
    setUploadedFilename({ commit }, payload) {
      commit("SET_UPLOADED_FILENAME", payload);
    }
  }
};
