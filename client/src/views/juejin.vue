<template>
  <sp-view :padding="'0px'">
    <sp-header></sp-header>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1">
        <template #tab>
          <span>
            签到
          </span>
        </template>
        <a-calendar v-model:value="value" @panelChange="onPanelChange" />
      </a-tab-pane>
      <a-tab-pane key="2">
        <template #tab>
          <span>
            抽奖
          </span>
        </template>
        <a-empty />
      </a-tab-pane>
    </a-tabs>
  </sp-view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Dayjs } from 'dayjs';

export default defineComponent({
  setup() {
    const value = ref<Dayjs>();
    const onPanelChange = (value: Dayjs, mode: string) => {
      console.log(value, mode);
    };

    return {
      activeKey: ref('1'),
      value,
      onPanelChange,
    };
  },
});
</script>
