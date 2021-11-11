<template>
  <div :style="{ padding: padding, overflowY: 'auto', maxHeight: '100%', height: '100%' }">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  partialName: 'body',
  props: {
    padding: {
      type: String,
      default: '24px'
    }
  }
});
</script>
