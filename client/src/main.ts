import { createApp } from 'vue';
import App from './App.vue';
import createRouter from './router';
import Antd, { message } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import { MessageApi } from 'ant-design-vue/lib/message';
import axios from './utils/http';
import { AxiosInstance } from 'axios';
import store from './store';

const router = createRouter();
const app = createApp(App);

// 定义了全局方法之后需要扩充类型
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $message: MessageApi;
    $http: AxiosInstance;
  }
}

app.use(router);
app.use(Antd);
app.use(store);

app.config.globalProperties.$message = message;
app.config.globalProperties.$http = axios;
app.mount('#app');
