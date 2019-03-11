import axios from "axios";
var initialState = {
  projects: []
};

export default {
  state: {
    activeProfessional: {}
  },
  mutations: {
    SET_ACTIVE_PROFESSIONAL(state, professional) {
      state.activeProfessional = professional;
    },
    SET_ACTIVE_PENDING_PROFESSIONAL(state,professional){
      state.activePendingProfessional = professional;
    }
    
  },

  actions: {
    deleteProject({ dispatch, commit, rootState }, payload) {
      return new Promise(function(resolve, reject) {
        axios
          .delete("/api/projects/" + payload.userId + "/" + payload.projectId)
          .then(res => {
            dispatch("getProjects").then(res2 => {
              resolve();
            });
          });
      });
    },
    getProfessional({ commit }, payload) {
      return new Promise(function(resolve, reject) {
        axios.get("/api/professionals/search/" + payload).then(res => {
          commit("SET_ACTIVE_PROFESSIONAL", res.data);
          resolve(res.data);
        });
      });
    },
    getPendingProfessional({ commit }, payload) {
      return new Promise(function(resolve, reject) {
        axios.get("/api/professionals/search_pending/" + payload).then(res => {
          commit("SET_ACTIVE_PENDING_PROFESSIONAL", res.data);
          resolve();
        });
      });
    }
  }
};
