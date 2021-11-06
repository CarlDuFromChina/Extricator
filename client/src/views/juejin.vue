<template>
  <sp-view>
    <sp-header></sp-header>
    <sp-body>
      <a-button type="primary" style="margin-right: 12px" @click="draw">抽奖</a-button>
      <a-button type="primary" @click="allin">ALL IN</a-button>
      <a-calendar v-model:value="value">
        <template #dateCellRender="{ current }">
          <a-button v-if="isToday(current) && !isChecked" type="primary" :size="size" @click="checkin">签到</a-button>
        </template>
      </a-calendar>
    </sp-body>
  </sp-view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import http from '../utils/http';
import { message } from 'ant-design-vue';

export default defineComponent({
  setup() {
    const value = ref<Dayjs>();
    const isToday = (value: Dayjs) => {
      return value.format('YYYY-MM-DD') === dayjs(new Date()).format('YYYY-MM-DD');
    };

    var size = ref('large');
    var isChecked = ref(false);

    var checkin = () => {
      http.post('/api/juejin/checkin').then(() => {
        message.success('签到成功');
        isChecked.value = true;
      });
    };

    var draw = () => {
      http.post('/api/juejin/draw?count=1').then(resp => {
        var result = resp as Array<string>;
        message.info(result[0]);
      }).catch(err => {
        message.error(err);
      });
    };

    var allin = () => {
      http.post('api/juejin/allin').then(resp => {
        message.success(resp as string)
      }).catch(err => {
        message.error(err);
      })
    };

    http.get('/api/juejin/getTodayStatus').then(res => {
      isChecked.value = res as boolean;
    });

    return {
      isChecked,
      size,
      value,
      isToday,
      checkin,
      draw,
      allin
    };
  },
});
</script>

<style lang="less" scoped>
:deep(.ant-fullcalendar-fullscreen .ant-fullcalendar-content) {
  text-align: center;
}
</style>