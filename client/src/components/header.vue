
<template>
  <a-page-header
    style="border-bottom: 1px solid rgb(235, 237, 240)"
    :title="title"
    :sub-title="subTitle"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { RouteMeta, useRouter } from "vue-router";

export default defineComponent({
  partialName: 'header',
  props: {
    title: {
      type: String,
    },
    subTitle: {
      type: String
    }
  },
  setup() {
    const router = useRouter();
    var title = ref<string>('');
    var subTitle = ref<string>('');
    var meta = router.currentRoute.value.meta as unknown as RouteMeta;
    title.value = meta.title as string;
    subTitle.value = meta.subTitle as string;
    return {
      title,
      subTitle
    }
  }
});
</script>
