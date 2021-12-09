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
      <a-form-item has-feedback label="邮箱" name="oldpass">
        <a-input
          v-model:value="formState.email"
          type="email"
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
      <a-button style="margin-right: 8px" @click="$emit('update:visible', false)"
        >取消</a-button
      >
      <a-button type="primary" @click="changePassword">确认</a-button>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import { message } from "ant-design-vue";
import { defineComponent, reactive, ref, toRaw, UnwrapRef } from "vue";
import http from '../../utils/http';

interface FormState {
  email: string;
}

export default defineComponent({
  name: 'basic-info',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:visible'],
  setup(props, context) {
    const formRef = ref();
    const formState: UnwrapRef<FormState> = reactive({
      email: '',
    });
    http.get('/api/user/data').then(resp => {
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
      formRef,
      formState,
      changePassword,
    }
  }
})
</script>

<style>

</style>