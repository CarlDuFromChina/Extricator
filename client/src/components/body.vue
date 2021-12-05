<template>
  <div :style="{ padding: padding, overflowY: 'auto', overflowX: 'hidden', maxHeight: '100%', height: '100%' }">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  partialName: 'body',
  props: {
    padding: {
      type: [String, Number],
      default: '24px'
    }
  }
});
</script>
