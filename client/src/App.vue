<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>

<template>
  <div style="height: 100%">
    <a-config-provider :locale="zhCN">
      <router-view></router-view>
    </a-config-provider>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN';

export default defineComponent({
  setup() {
    return {
      zhCN
    }
  }
});
</script>

<style>
#app {
  height: 100%;
  overflow: hidden;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
