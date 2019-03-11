import Vue from "vue";
import Vuex from "vuex";

import userStore from './user';
import professionalStore from './professionals';
import listingsStore from './listings';
import profileStore from './profile';
// import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
   userStore,
   professionalStore,
   listingsStore,
   profileStore
  },
  // plugins: [createPersistedState()],
  state: {
  },
  getters: {},
  mutations: {
    
  },
  actions: {
    
    
  }
});
