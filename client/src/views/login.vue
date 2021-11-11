<template>
  <div class="background">
    <div class="login">
      <a-form ref="formRef" :model="formState" :rules="rules" class="login__wrapper">
        <a-form-item>
          <span class="header">Extricator</span>
        </a-form-item>
        <a-form-item>
          <span class="desc">{{ "Don't have too many psychological burden!" }}</span>
        </a-form-item>
        <a-form-item name="code">
          <a-input v-model:value="formState.code" placeholder="用户名" allowClear>
            <template #prefix>
              <a-icon type="user" style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input-password v-model:value="formState.password" placeholder="密码" @keyup.enter="signIn">
            <template #prefix>
              <a-icon type="lock" style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a @click="$router.push('register')" class="signup">注册</a>
          <a @click="$message.warn('请联系管理员')" class="forget-pwd">忘记密码</a>
        </a-form-item>
        <a-form-item>
          <a-button style="width: 100%" type="primary" @click="signIn" :loading="loading">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRaw, UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import store from '../store';
import { useRouter } from 'vue-router';
import assert from '../utils/assert';
import http from '../utils/http';

interface FormState {
  code: string;
  password: string;
}

export default defineComponent({
  setup() {
    const router = useRouter();
    const formRef = ref();
    const loading = ref(false);
    const formState: UnwrapRef<FormState> = reactive({
      code: '',
      password: '',
    });
    const rules = {
      code: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    };
    const signIn = () => {
      formRef.value.validate().then(() => {
        http.post('/api/auth/login', toRaw(formState)).then((resp) => {
          if (!assert.isEmpty(resp)) {
            message.success('登录成功');
            store.commit('setToken', resp);
            store.commit('setCurrentUser', formState.code);
            router.push('admin');
          } else {
            message.error('账号或密码错误');
          }
        })
      });
    };
    return {
      formRef,
      formState,
      rules,
      signIn,
      loading
    };
  },
});
</script>

<style lang="less" scoped>
.background {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
}
.login {
  width: 400px;
  position: absolute;
  left: calc(~'50%' - 200px);
  top: 200px;
  .login__wrapper {
    width: 100%;
    height: 100%;
    text-align: center;
    padding: 0 20px;
    .header {
      font-size: 40px;
      color: rgba(0, 0, 0, 0.85);
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      font-weight: 600;
      line-height: 60px;
    }
    .desc {
      display: inline-block;
      width: 80%;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
    }
    .forget-pwd {
      float: right;
      color: #52c41a;
    }
    .signup {
      float: left;
      color: #52c41a;
    }
  }
}
.login:hover {
  opacity: 1;
  transition: all 800ms;
}

:deep(.ant-form-item-explain.ant-form-item-explain-error) {
  text-align: left;
}
</style>
