<template>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    layout="vertical"
    class="register"
  >
    <a-steps :current="current">
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <div class="steps-content">
      <a-form-item name="code" label="用户名" v-show="current === 0">
        <a-input
          v-model:value="formState.code"
          placeholder="请输入用户名"
        ></a-input>
      </a-form-item>
      <a-form-item name="password" label="密码" v-show="current === 0">
        <a-input-password
          v-model:value="formState.password"
          placeholder="请输入密码"
          @keyup.enter="next"
        ></a-input-password>
      </a-form-item>
      <a-form-item v-show="current === 1">设置Cookie</a-form-item>
      <a-form-item label="掘金" v-show="current === 1">
        <a-input v-model:value="formState.cookie.juejin"></a-input>
      </a-form-item>
      <a-form-item label="京东" v-show="current === 1">
        <a-input v-model:value="formState.cookie.jd"></a-input>
      </a-form-item>
      <a-result
        title="Great, we have done all the operations!"
        v-show="current === 2"
      >
        <template #icon>
          <SmileTwoTone></SmileTwoTone>
        </template>
        <template #extra>
          <a-button type="primary" @click="submit">提交</a-button>
        </template>
      </a-result>
    </div>
    <div class="steps-action">
      <a-button v-if="current < steps.length - 1" type="primary" @click="next"
        >下一步</a-button
      >
      <a-button v-if="current > 0" style="margin-left: 8px" @click="prev"
        >上一步</a-button
      >
    </div>
  </a-form>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRaw, UnwrapRef } from 'vue';
import { SmileTwoTone } from '@ant-design/icons-vue';
import axios from 'axios';
import { message } from 'ant-design-vue';

interface FormState {
  code: string;
  password: string;
  cookie: {
    juejin: string;
    jd: string;
  };
}

export default defineComponent({
  setup() {
    const formRef = ref();
    const formState: UnwrapRef<FormState> = reactive({
      code: '',
      password: '',
      cookie: {
        juejin: '',
        jd: '',
      },
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
        axios
          .post('api/auth/signup', toRaw(formState))
          .then((resp) => {
            if (resp.data) {
              message.success('注册成功');
            } else {
              message.error('注册失败');
            }
          })
          .catch(() => {
            message.error('注册失败');
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
          title: 'Cookie',
        },
        {
          title: '完成',
        },
      ],
      next,
      prev,
      submit,
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
