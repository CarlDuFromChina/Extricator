
<template>
  <a-page-header
    style="border-bottom: 1px solid rgb(235, 237, 240)"
    :title="title"
    :sub-title="subTitle"
    @back="back"
  >
    <template #backIcon>
      <ArrowLeftOutlined v-show="!!back" />
    </template>
    <template #tags>
      <slot name="tags"></slot>
    </template>
    <template #extra>
      <slot name="extra"></slot>
    </template>
  </a-page-header>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { RouteMeta, useRouter } from "vue-router";
import { ArrowLeftOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  partialName: 'header',
  components: { ArrowLeftOutlined },
  props: {
    title: {
      type: String,
    },
    subTitle: {
      type: String
    },
    back: {
      type: Function,
      default: null
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
