<template>
  <iframe class="doc-iframe" :src="url"></iframe>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  partialName: 'iframe',
  props: {
    url: {
      type: String
    }
  }
});
</script>

<style lang="less" scoped>
.doc-iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>