<template>
  <sp-view>
    <sp-header>
      <template #extra>
        <a-tooltip>
          <template #title>点击查看如何获取Cookie</template>
          <a-button size="small" shape="circle" @click="gotoWiki">
            <template #icon><QuestionOutlined /></template>
          </a-button>
        </a-tooltip>
      </template>
    </sp-header>
    <sp-body>
      <a-alert
        message="注意：Cookie 有效期大部分为一个月，请及时更新"
        type="warning"
        style="margin-bottom: 12px"
        show-icon
      />
      <a-form ref="formRef" layout="vertical" :model="formSetting">
        <a-form-item label="掘金">
          <a-textarea v-model:value="formSetting.juejin" placeholder="请输入掘金Cookie" :rows="4" />
        </a-form-item>
        <a-form-item label="京东">
          <a-textarea v-model:value="formSetting.jd" placeholder="请输入京东Cookie" :rows="4" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="submit">更新</a-button>
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
    const gotoWiki = () => {
      window.open('https://gitee.com/SixPenceStudio/extricator/wikis/%E5%A6%82%E4%BD%95%E8%8E%B7%E5%8F%96%E6%8E%98%E9%87%91Cookie');
    };
    return {
      formRef,
      formSetting,
      submit,
      gotoWiki,
    };
  },
  components: { QuestionOutlined },
});
</script>
