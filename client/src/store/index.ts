import { createStore } from 'vuex';
import auth from './auth';
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage
});

export default createStore({
  modules: {
    auth,
  },
  plugins: [vuexLocal.plugin]
});
