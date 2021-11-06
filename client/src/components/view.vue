<template>
  <div :style="{ maxHeight: '100%', height: '100%' }">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  partialName: 'view'
});
</script>
