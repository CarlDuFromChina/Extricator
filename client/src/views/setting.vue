<template>
  <sp-view>
    <sp-header></sp-header>
    <sp-body>
      <a-form ref="formRef" :model="formSetting">
        <a-form-item label="掘金">
          <a-input v-model:value="formSetting.juejin"></a-input>
        </a-form-item>
        <a-form-item label="京东">
          <a-input v-model:value="formSetting.jd"></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="submit">提交</a-button>
        </a-form-item>
      </a-form>
    </sp-body>
  </sp-view>
</template>

<script lang="ts">
import { reactive, ref, toRaw, UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import axios from '../utils/http';
import store from '../store';
import { useRouter } from 'vue-router';
import { defineComponent } from '@vue/runtime-core';

interface FormSetting {
  juejin: string;
  jd: string;
}

export default defineComponent({
  setup() {
    const formRef = ref();
    const router = useRouter();
    var formSetting: UnwrapRef<FormSetting> = reactive({
      juejin: '123',
      jd: '',
    });
    var data: any = {};
    const code = store.getters.userCode;
    axios.get(`/api/user/${code}`).then((resp: any) => {
      if (resp) {
        Object.assign(formSetting, resp.cookie);
        data = resp;
      } else {
        message.error('获取用户设置失败');
      }
    });
    const submit = () => {
      formRef.value.validate().then(() => {
        data.cookie = toRaw(formSetting);
        axios
          .put('/api/user', data)
          .then((resp) => {
            if (resp) {
              message.success('修改成功');
            } else {
              message.error('修改失败');
            }
          })
          .catch((err) => {
            message.error(err);
          });
      });
    };
    return {
      formRef,
      formSetting,
      submit,
    };
  },
});
</script>
