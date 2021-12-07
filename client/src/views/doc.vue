<template>
  <sp-iframe :url="url"></sp-iframe>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  setup() {
    const route = useRoute()
    var url = ref<String>(decodeURIComponent(route.params.url as string));
    return {
      url
    }
  }
});
</script>

