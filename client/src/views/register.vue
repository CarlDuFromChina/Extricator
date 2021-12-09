<template>
  <sp-view>
    <sp-header :back="goBackLogin">
    </sp-header>
    <sp-body>
      <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical" class="register">
        <a-steps :current="current">
          <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>
        <div class="steps-content">
          <a-form-item name="code" label="用户名" v-show="current === 0">
            <a-input v-model:value="formState.code" placeholder="请输入用户名"></a-input>
          </a-form-item>
          <a-form-item name="password" label="密码" v-show="current === 0">
            <a-input-password v-model:value="formState.password" placeholder="请输入密码" @keyup.enter="next"></a-input-password>
          </a-form-item>
          <a-form-item v-show="current === 1">设置邮箱</a-form-item>
          <a-form-item label="邮箱" v-show="current === 1">
            <a-input v-model:value="formState.email"></a-input>
          </a-form-item>
          <a-result title="Great, we have done all the operations!" v-show="current === 2">
            <template #icon>
              <SmileTwoTone></SmileTwoTone>
            </template>
            <template #extra>
              <a-button type="primary" @click="submit">提交</a-button>
            </template>
          </a-result>
        </div>
        <div class="steps-action">
          <a-button v-if="current < steps.length - 1" type="primary" @click="next">下一步</a-button>
          <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">上一步</a-button>
        </div>
      </a-form>
    </sp-body>
  </sp-view>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRaw, UnwrapRef } from 'vue';
import { SmileTwoTone } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import http from '../utils/http';

interface FormState {
  code: string;
  password: string;
  email: string;
}

export default defineComponent({
  setup() {
    const formRef = ref();
    const router = useRouter();
    const goBackLogin = () => router.push('login');
    const formState: UnwrapRef<FormState> = reactive({
      code: '',
      password: '',
      email: '',
    });
    const rules = {
      code: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    };
    const current = ref<number>(0);
    const next = () => {
      formRef.value.validate().then(() => {
        current.value++;
      });
    };
    const prev = () => {
      current.value--;
    };
    const submit = () => {
      formRef.value.validate().then(() => {
        http.post('/api/auth/signup', toRaw(formState)).then((resp) => {
          message.success('注册成功');
          goBackLogin();
        });
      });
    };
    return {
      formRef,
      formState,
      rules,
      current,
      steps: [
        {
          title: '账号',
        },
        {
          title: '邮箱',
        },
        {
          title: '完成',
        },
      ],
      next,
      prev,
      submit,
      goBackLogin,
    };
  },
  components: { SmileTwoTone },
});
</script>
<style lang="less" scoped>
.register {
  width: 550px;
  text-align: left;
  padding: 42px 24px 50px;
  color: #000000d9;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
  margin: 0 auto;
}
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  text-align: center;
  padding: 20px 40px 0 40px;
}

.steps-action {
  margin-top: 24px;
}

:deep(.ant-form-item-explain.ant-form-item-explain-error) {
  text-align: left;
}
</style>
