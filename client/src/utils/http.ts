import Axios from 'axios';
import store from '../store';

const axios = Axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000,
});

const myStore:any = store;

axios.interceptors.request.use(
  (config:any) => {
    if (myStore.getters.token) {
      config.headers.token = `${myStore.getters.token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default axios;
