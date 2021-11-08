import { message } from 'ant-design-vue';
import Axios from 'axios';
import store from '../store';
import assert from './assert';

const axios = Axios.create({
  timeout: 5000,
});

function _handleSuccess(res: any) {
  if (!res) return;

  if (!res.data) {
    return res.data;
  }

  if (res.data.ErrorCode === 0) {
    return res.data.Data || res.data;
  } else if (!assert.isEmpty(res.data.ErrorCode) && !assert.isEmpty(res.data.Message)) {
    return Promise.reject(new Error(res.data.Message));
  } else {
    return res.data;
  }
}

function getErrorMessage(error: any, defaultMessage = 'Oops！') {
  if (typeof error === 'string' && !assert.isEmpty(error)) {
    return error;
  }

  if (error && error.Message) {
    return error.Message;
  }

  if (error && error.message) {
    return error.message;
  }

  return defaultMessage;
}

function _handleError(error: any) {
  const { status, data = {} } = error.response || {};
  let errorMessage;
  if (status === 403) {
    errorMessage = getErrorMessage(data, '您没有权限访问该资源');
  } else if (status === 500) {
    errorMessage = getErrorMessage(data, '系统错误，请联系管理员');
  } else if (status === 404) {
    errorMessage = getErrorMessage(data.Message, '未找到资源');
  } else if (data.Message) {
    errorMessage = data.Message;
  } else if (data.message) {
    errorMessage = data.message;
  } else {
    errorMessage = '服务器开小差了';
  }
  return errorMessage;
}

const myStore: any = store;

axios.interceptors.request.use(
  (config: any) => {
    if (myStore.getters.token) {
      config.headers.token = `${myStore.getters.token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default {
  get: (url: string, config?: any, customHandleError?: boolean) => {
    return new Promise((resolve, reject) => {
      axios
        .get(url, config)
        .then(res => resolve(_handleSuccess(res)))
        .catch(err => {
          if (!customHandleError) {
            message.error(_handleError(err));
          }
          return reject(_handleError(err));
        });
    });
  },
  post: (url: string, data?: any, config?: any, customHandleError?: boolean) => {
    return new Promise((resolve, reject) => {
      axios
        .post(url, data, config)
        .then(res => resolve(_handleSuccess(res)))
        .catch(err => {
          if (!customHandleError) {
            message.error(_handleError(err));
          }
          return reject(_handleError(err));
        });
    });
  },
  delete: (url: string, config?: any, customHandleError?: boolean) => {
    return new Promise((resolve, reject) => {
      axios
        .delete(url, config)
        .then(res => resolve(_handleSuccess(res)))
        .catch(err => {
          if (!customHandleError) {
            message.error(_handleError(err));
          }
          return reject(_handleError(err));
        });
    });
  },
  put: (url: string, data?: any, config?: any, customHandleError?: boolean) => {
    return new Promise((resolve, reject) => {
      axios
        .put(url, data, config)
        .then(res => resolve(_handleSuccess(res)))
        .catch(err => {
          if (!customHandleError) {
            message.error(_handleError(err));
          }
          return reject(_handleError(err));
        });
    });
  }
}
