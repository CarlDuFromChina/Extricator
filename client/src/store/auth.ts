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
    }
  },
  mutations: {
    setToken(state: any, token: string) {
      state.token = token;
    },
    clearToken(state: any) {
      state.token = '';
    },
    setCurrentUser(state: any, code: string) {
      state.userCode = code;
    }
  },
};
