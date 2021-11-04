import assert from '../utils/assert';

export default {
  state: () => {
    return {
      token: '',
      userCode: ''
    };
  },
  getters: {
    token(state: any) {
      return state.token;
    },
    userCode(state: any) {
      return state.userCode;
    },
    isAuthenticated(state: any) {
      return !assert.isEmpty(state.token);
    }
  },
  mutations: {
    setToken(state: any, token: string) {
      state.token = token;
    },
    logout(state: any) {
      state.token = '';
      state.userCode = '';
    },
    setCurrentUser(state: any, code: string) {
      state.userCode = code;
    }
  },
};
