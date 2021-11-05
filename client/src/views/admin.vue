<template>
  <a-layout style="height: 100%">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1" @click="menuChange('juejin')">
          <GlobalOutlined />
          <span>掘金</span>
        </a-menu-item>
        <a-menu-item key="2" @click="menuChange('jd')">
          <GlobalOutlined />
          <span>京东</span>
        </a-menu-item>
        <a-menu-item key="3" @click="menuChange('setting')">
          <SettingOutlined />
          <span>设置</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="{ background: '#fff', padding: 0, position: 'relative' }">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        <a-dropdown>
          <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" shape="circle" :style="{ position: 'absolute', top: '20%', right: '20px', cursor: 'pointer' }"/>
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="() => null"><EditOutlined />修改密码</a-menu-item>
              <a-menu-item key="3" @click="logout"><LogoutOutlined />退出</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', background: '#fff', height: '100%' }"
      >
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import {
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  GlobalOutlined,
  LogoutOutlined,
  EditOutlined
} from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import store from '../store';

export default defineComponent({
  components: {
    SettingOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    GlobalOutlined,
    LogoutOutlined,
    EditOutlined
  },
  setup() {
    const router = useRouter();
    const menuChange = (name: string) => {
      router.push({ name });
    };
    const logout = () => {
      store.commit('logout');
      router.push({ name: 'login' });
    }
    return {
      selectedKeys: ref<string[]>(['1']),
      collapsed: ref<boolean>(false),
      menuChange,
      logout
    };
  },
});
</script>
<style lang="less" scoped>
.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>