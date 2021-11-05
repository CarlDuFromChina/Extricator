<template>
  <sp-view :padding="'0px'">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1">
        <template #tab>
          <span>
            签到
          </span>
        </template>
        <a-empty />
      </a-tab-pane>
    </a-tabs>
  </sp-view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    return {
      activeKey: ref('1'),
    };
  },
});
</script>
