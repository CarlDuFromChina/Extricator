<template>
  <a-layout style="height: 100%">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo-wrap">
        <div class="logo"></div>
        <div class="logo-title">解脱者</div>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1" @click="menuChange('signin')">
          <sp-icon name="signin" size="14"></sp-icon>
          <span>平台签到</span>
        </a-menu-item>
        <a-menu-item key="2" @click.stop="gotoWiki">
          <sp-icon name="help" size="14"></sp-icon>
          <span>签到说明</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        :style="{ background: '#fff', padding: 0, position: 'relative' }"
      >
        <a-dropdown>
          <sp-icon
            name="user"
            size="32"
            :style="{
              position: 'absolute',
              top: '20%',
              right: '20px',
              cursor: 'pointer',
            }"
          >
          </sp-icon>
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="visible = true"
                ><EditOutlined />修改密码</a-menu-item
              >
              <a-menu-item key="2" @click="basicInfoVisible = true"
                ><UserOutlined />基本信息</a-menu-item
              >
              <a-menu-item key="3" @click="logout"
                ><LogoutOutlined />退出</a-menu-item
              >
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
    <!-- 修改密码 -->
    <password v-model:visible="visible"></password>
    <!-- 基本信息 -->
    <basic-info v-model:visible="basicInfoVisible"></basic-info>
  </a-layout>
</template>
<script lang="ts">
import {
  LogoutOutlined,
  EditOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { defineComponent, ref, toRaw, watch } from 'vue';
import { useRouter } from 'vue-router';
import store from '../../store';
import Password from './password.vue';
import BasicInfo from './basicInfo.vue';

export default defineComponent({
  components: {
    LogoutOutlined,
    EditOutlined,
    UserOutlined,
    Password,
    BasicInfo,
  },
  setup() {
    const router = useRouter();
    var visible = ref(false);
    var basicInfoVisible = ref(false);
    const menuChange = (name: string, params?: any) => {
      router.push({ name, params });
    };
    const logout = () => {
      store.commit('logout');
      router.push({ name: 'login' });
    };

    var gotoWiki = () => {
      window.open('https://karl-du.gitbook.io/extricator/');
    };
    var selectedKeys = ref<string[]>(['1']);
    watch(selectedKeys, (newVal, oldVal) => {
      if (toRaw(newVal)[0] === '2') {
        selectedKeys.value = toRaw(oldVal);
      }
    });
    return {
      visible,
      basicInfoVisible,
      gotoWiki,
      selectedKeys,
      collapsed: ref<boolean>(false),
      menuChange,
      logout,
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

.logo-wrap {
  display: flex;
  align-items: center;
}

.logo {
  width: 48px;
  height: 48px;
  margin: 16px;
  background: url('../assets/logo.png') no-repeat;
  background-size: 48px 48px;
}

.logo-title {
  font-size: 32px;
  color: #fff;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>
