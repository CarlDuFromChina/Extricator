<template>
  <a-drawer
    title="基本信息"
    :visible="visible"
    :width="360"
    @close="$emit('update:visible', false)"
    :footer-style="{ textAlign: 'right' }"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-form ref="formRef" :model="formState" :rules="rulesRef" layout="vertical">
      <a-form-item label="用户名">
        <a-input v-model:value="formState.code" :disabled="true"> </a-input>
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input
          v-model:value="formState.email"
          type="email"
          @change="handleChanged"
          autocomplete="off"
          allowClear
        >
          <template #addonAfter>
            <a-button
              type="link"
              size="small"
              :disabled="(formState.mail_verified && !mailChanged) || !isEmail(formState.email)"
              @click="verify"
              >{{ formState.mail_verified && !mailChanged ? '已验证' : '验证' }}</a-button
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
      <a-button type="primary" @click="submit">确认</a-button>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import { Button, message, Modal, notification } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode, defineComponent, h, reactive, ref, toRaw, UnwrapRef, watch } from 'vue';
import http from '../../utils/http';
import { RuleObject } from 'ant-design-vue/lib/form/interface';
import { isEmpty } from '../../utils/assert';

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
    const rulesRef = reactive({
      email: [
        {
          type: 'email',
          message: '请输入正确的邮箱',
        },
        {
          validator: async (rule: RuleObject, value: string) => {
            if (!isEmpty(value) && !formState.mail_verified) {
              return Promise.reject('邮箱必须验证');
            }
          },
          trigger: 'change'
        }
      ]
    });
    var isEmail = (val: string) => !isEmpty(val) && /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(val);
    var verify = () => {
      http.post('/api/email/verify', toRaw(formState)).then(() => {
        Modal.confirm({
          title: () => '确认?',
          icon: () => createVNode(ExclamationCircleOutlined),
          content: () => '是否完成邮箱验证？',
          onOk() {
            http.get('/api/user/data').then((resp: any) => {
              if (resp.mail_verified) {
                originEmail = resp.email;
                formState.mail_verified = true;
                handleChanged();
                formRef.value.validate();
              } else {
                message.error('验证失败，请确认邮件验证成功');
              }
            });
          },
          onCancel() {},
        });
      });
    };

    var originEmail = '';
    var mailChanged = ref(false);
    var handleChanged = () => {
      mailChanged.value = originEmail !== formState.email;
      formState.mail_verified = originEmail === formState.email;
    };

    var fetch = async () => http.get('/api/user/data').then((resp: any) => {
      originEmail = resp.email;
      Object.assign(formState, resp);
      if (!formState.mail_verified) {
        const key = `open${Date.now()}`;
        notification['warning']({
          message: '邮箱验证提醒',
          description: '您的邮箱还没有验证，邮件通知功能暂时无法使用',
          btn: h(
            Button,
            {
              type: 'link',
              size: 'small',
              onClick: () => {
                notification.close(key);
                context.emit('update:visible', true);
              },
            },
            '立即验证',
          ),
          key
        });
      }
    });
    fetch();

    const submit = () => {
      formRef.value.validate().then(() => {
        http.put('/api/user/data', toRaw(formState)).then(() => {
          message.success('更新成功');
          context.emit('update:visible', false);
          fetch();
        });
      });
    };
    return {
      handleChanged,
      mailChanged,
      verify,
      formRef,
      formState,
      rulesRef,
      submit,
      isEmail
    };
  },
});
</script>
