<template>
  <sp-view>
    <sp-header>
      <template #extra>
        <a-tooltip>
          <template #title>Cookie有效期为一个月，请及时更新</template>
          <a-button size="small" shape="circle">
            <template #icon><QuestionOutlined /></template>
          </a-button>
        </a-tooltip>
      </template>
    </sp-header>
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
import { QuestionOutlined } from '@ant-design/icons-vue';
import store from '../store';
import { useRouter } from 'vue-router';
import { defineComponent } from '@vue/runtime-core';
import http from '../utils/http';

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
    const code = store.getters.userCode;
    http.get(`/api/user/${code}`).then((resp: any) => {
      if (resp) {
        Object.assign(formSetting, resp.cookie);
      } else {
        message.error('获取用户设置失败');
      }
    });
    const submit = () => {
      formRef.value.validate().then(() => {
        http.put('/api/cookie', toRaw(formSetting)).then((resp) => {
          message.success('修改成功');
        });
      });
    };
    return {
      formRef,
      formSetting,
      submit,
    };
  },
  components: { QuestionOutlined },
});
</script>
