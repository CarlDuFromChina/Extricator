<template>
  <svg class="svg-icon anticon" @click="handleClick" :width="size" :height="size" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  partialName: 'icon',
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [Number, String],
      default: '1.5em'
    },
    color: {
      type: String,
      default: 'currentColor'
    },
  },
  setup(props, context) {
    const symbolId = computed(() => `#icon-${props.name}`);
    return {
      symbolId,
      handleClick: (event: any) => {
        context.emit('click', event);
      }
    };
  },
});
</script>

<style lang="less">
.svg-icon {
  fill: currentColor;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  vertical-align: middle;
  cursor: pointer;
}
</style>
