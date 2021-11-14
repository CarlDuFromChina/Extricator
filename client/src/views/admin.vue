<template>
  <a-layout style="height: 100%">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1" @click="menuChange('juejin')">
          <sp-icon name="juejin" size="14"></sp-icon>
          <span>掘金</span>
        </a-menu-item>
        <a-menu-item key="2" @click="menuChange('jd')">
          <sp-icon name="jd" size="14"></sp-icon>
          <span>京东</span>
        </a-menu-item>
        <a-menu-item key="3" @click="menuChange('checkin')">
          <sp-icon name="signin" size="14"></sp-icon>
          <span>签到记录</span>
        </a-menu-item>
        <a-menu-item key="4" @click="menuChange('setting')">
          <SettingOutlined />
          <span>设置</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        :style="{ background: '#fff', padding: 0, position: 'relative' }"
      >
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined
          v-else
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <a-dropdown>
          <a-avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            shape="circle"
            :style="{
              position: 'absolute',
              top: '20%',
              right: '20px',
              cursor: 'pointer',
            }"
          />
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="visible = true"
                ><EditOutlined />修改密码</a-menu-item
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
    <a-drawer
      title="修改密码"
      :visible="visible"
      :width="360"
      @close="visible = false"
      :footer-style="{ textAlign: 'right' }"
      :body-style="{ paddingBottom: '80px' }"
    >
      <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
        <a-form-item has-feedback label="密码" name="oldpass">
          <a-input
            v-model:value="formState.oldpass"
            type="password"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item has-feedback label="新密码" name="pass">
          <a-input
            v-model:value="formState.pass"
            type="password"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item has-feedback label="重复新密码" name="checkPass">
          <a-input
            v-model:value="formState.checkPass"
            type="password"
            autocomplete="off"
          />
        </a-form-item>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button style="margin-right: 8px" @click="visible = false">取消</a-button>
        <a-button type="primary" @click="changePassword">确认</a-button>
      </div>
    </a-drawer>
  </a-layout>
</template>
<script lang="ts">
import {
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  GlobalOutlined,
  LogoutOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { RuleObject } from "ant-design-vue/lib/form/interface";
import { defineComponent, onMounted, reactive, ref, toRaw, UnwrapRef } from "vue";
import { useRouter } from "vue-router";
import store from "../store";
import http from "../utils/http";

interface FormState {
  oldpass: string,
  pass: string;
  checkPass: string;
}

export default defineComponent({
  components: {
    SettingOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    GlobalOutlined,
    LogoutOutlined,
    EditOutlined,
  },
  setup() {
    const router = useRouter();
    const formRef = ref();
    const formState: UnwrapRef<FormState> = reactive({
      oldpass: "",
      pass: "",
      checkPass: "",
    });
    const menuChange = (name: string) => {
      router.push({ name });
    };
    const logout = () => {
      store.commit("logout");
      router.push({ name: "login" });
    };
    const visible = ref<boolean>(false);
    let validatePass = async (_rule: RuleObject, value: string) => {
      if (value === "") {
        return Promise.reject("请输入密码");
      }
    };
    let validatePass2 = async (_rule: RuleObject, value: string) => {
      if (value === "") {
        return Promise.reject("请再次输入密码");
      } else if (value !== formState.pass) {
        return Promise.reject("两次输入的密码不一致");
      } else {
        return Promise.resolve();
      }
    };
    const changePassword = () => {
      formRef.value.validate().then(() => {
        http.post("/api/auth/changePassword", toRaw(formState)).then((resp) => {
          message.success("修改密码成功");
          visible.value = false;
        });
      });
    };
    const rules = {
      oldpass: [{ required: true, validator: validatePass, trigger: "change" }],
      pass: [{ required: true, validator: validatePass, trigger: "change" }],
      checkPass: [{ validator: validatePass2, trigger: "change" }],
    };
    return {
      formRef,
      formState,
      selectedKeys: ref<string[]>(["1"]),
      collapsed: ref<boolean>(false),
      menuChange,
      logout,
      visible,
      rules,
      changePassword,
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