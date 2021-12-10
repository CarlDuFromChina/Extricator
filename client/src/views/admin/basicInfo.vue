<template>
  <a-drawer
    title="基本信息"
    :visible="visible"
    :width="360"
    @close="$emit('update:visible', false)"
    :footer-style="{ textAlign: 'right' }"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-form ref="formRef" :model="formState" layout="vertical">
      <a-form-item label="用户名">
        <a-input v-model:value="formState.code" :disabled="true"> </a-input>
      </a-form-item>
      <a-form-item label="邮箱">
        <a-input
          v-model:value="formState.email"
          type="email"
          autocomplete="off"
        >
          <template #addonAfter>
            <a-button
              type="link"
              size="small"
              :disabled="formState.mail_verified"
              @click="verify"
              >{{ formState.mail_verified ? '已验证' : '验证' }}</a-button
            >
          </template>
        </a-input>
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
      <a-button
        style="margin-right: 8px"
        @click="$emit('update:visible', false)"
        >取消</a-button
      >
      <a-button type="primary" @click="changePassword">确认</a-button>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode, defineComponent, reactive, ref, toRaw, UnwrapRef } from 'vue';
import http from '../../utils/http';

interface FormState {
  code: string;
  email: string;
  mail_verified: boolean;
}

export default defineComponent({
  name: 'basic-info',
  components: { ExclamationCircleOutlined },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:visible'],
  setup(props, context) {
    const formRef = ref();
    const formState: UnwrapRef<FormState> = reactive({
      code: '',
      email: '',
      mail_verified: false,
    });
    var verify = () => {
      http.post('/api/email/verify', toRaw(formState)).then(() => {
        Modal.confirm({
          title: () => '确认?',
          icon: () => createVNode(ExclamationCircleOutlined),
          content: () => '是否完成邮箱验证？',
          onOk() {
            http.get('/api/user/data').then((resp) => {
              Object.assign(formState, resp);
            });
          },
          onCancel() {},
        });
      });
    };
    http.get('/api/user/data').then((resp) => {
      Object.assign(formState, resp);
    });
    const changePassword = () => {
      formRef.value.validate().then(() => {
        http.put('/api/user/data', toRaw(formState)).then(() => {
          message.success('更新成功');
          context.emit('update:visible', false);
        });
      });
    };
    return {
      verify,
      formRef,
      formState,
      changePassword,
    };
  },
});
</script>
