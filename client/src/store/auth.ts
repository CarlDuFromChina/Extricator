export default {
  state: () => {
    return {
      token: '',
    };
  },
  getters: {
    token(state: any) {
      return state.token;
    }
  },
  mutations: {
    setToken(state: any, token: string) {
      state.token = token;
    },
    clearToken(state: any) {
      state.token = '';
    },
  },
};
