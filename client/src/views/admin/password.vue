<template>
  <a-drawer
    title="修改密码"
    :visible="visible"
    :width="360"
    @close="onClose"
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
    <div class="password-footer">
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button type="primary" @click="changePassword">确认</a-button>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import { message } from 'ant-design-vue';
import { RuleObject } from 'ant-design-vue/lib/form/interface';
import { defineComponent, reactive, ref, toRaw, UnwrapRef } from 'vue';
import http from '../../utils/http';

interface FormState {
  oldpass: string;
  pass: string;
  checkPass: string;
}

export default defineComponent({
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
      oldpass: '',
      pass: '',
      checkPass: '',
    });

    let validatePass = async (_rule: RuleObject, value: string) => {
      if (value === '') {
        return Promise.reject('请输入密码');
      }
    };

    let validatePass2 = async (_rule: RuleObject, value: string) => {
      if (value === '') {
        return Promise.reject('请再次输入密码');
      } else if (value !== formState.pass) {
        return Promise.reject('两次输入的密码不一致');
      } else {
        return Promise.resolve();
      }
    };
    
    const changePassword = () => {
      formRef.value.validate().then(() => {
        http.post('/api/auth/changePassword', toRaw(formState)).then((resp) => {
          message.success('修改密码成功');
          onClose();
        });
      });
    };
    const rules = {
      oldpass: [{ required: true, validator: validatePass, trigger: 'change' }],
      pass: [{ required: true, validator: validatePass, trigger: 'change' }],
      checkPass: [{ validator: validatePass2, trigger: 'change' }],
    };

    var onClose = () => context.emit('update:visible', false);

    return {
      formRef,
      formState,
      rules,
      changePassword,
      onClose,
    };
  },
});
</script>

<style lang="less" scoped>
.password-footer {
  position: 'absolute';
  right: 0;
  bottom: 0;
  width: '100%';
  border-top: '1px solid #e9e9e9';
  padding: '10px 16px';
  background: '#fff';
  text-align: 'right';
  z-index: 1;
}
</style>
