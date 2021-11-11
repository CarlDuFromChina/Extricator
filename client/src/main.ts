import { createApp } from 'vue';
import App from './App.vue';
import createRouter from './router';
import Antd, { message } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import { MessageApi } from 'ant-design-vue/lib/message';
import axios from './utils/http';
import { AxiosInstance } from 'axios';
import store from './store';
import 'virtual:svg-icons-register';
import components from './components';
import format, { FormatApi } from './utils/format';

const router = createRouter();
const app = createApp(App);

// 定义了全局方法之后需要扩充类型
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $message: MessageApi;
    $http: AxiosInstance;
    $format: FormatApi
  }
}

app.use(router);
app.use(Antd);
app.use(store);
app.use(components);

app.config.globalProperties.$message = message;
app.config.globalProperties.$http = axios;
app.config.globalProperties.$formt = format;

app.mount('#app');
