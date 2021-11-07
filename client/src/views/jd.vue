<template>
  <sp-view :padding="'0px'">
    <sp-header></sp-header>
    <sp-body>
      <a-button type="primary" style="margin-right: 12px" @click="draw">抽奖</a-button>
    </sp-body>
  </sp-view>
</template>

<script lang="ts">
import { message } from 'ant-design-vue';
import { defineComponent } from 'vue';
import http from '../utils/http';
export default defineComponent({
  setup() {
    const draw = () => {
      http.post('/api/jd/checkin').then(resp => {
        const result = resp as any;
        if (result.code === '3') {
          message.error(result.errorMessage);
        } else {
          message.success('签到成功');
        }
      })
    };
    return {
      draw
    };
  },
});
</script>
