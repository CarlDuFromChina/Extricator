<template>
  <a-card :bordered="false">
    <a-row>
      <a-col style="text-align: left;" :span="4">
        <sp-icon name="jd" size="36" color="#E6241A"></sp-icon>
      </a-col>
      <a-col :span="20">
        <p class="title">京东</p>
        <span class="subtitle">为您提供签到功能~</span>
      </a-col>
    </a-row>
    <template class="ant-card-actions" #actions>
      <a-button type="link" @click="checkin" :disabled="jdChecked || !formState.cookie">{{ jdChecked ? '已签到' : '签到' }}</a-button>
      <a-button type="link" @click="visible = true">设置</a-button>
    </template>
    <a-modal v-model:visible="visible" title="设置" width="720px" @ok="saveData">
      <a-alert
        message="注意：Cookie 有效期大部分为一个月，请及时更新"
        type="warning"
        style="margin-bottom: 12px"
        show-icon
      />
      <a-form ref="formRef" layout="horizontal" :model="formState">
        <a-row>
          <a-col :span="24">
            <a-form-item>
              <a-textarea v-model:value="formState.cookie" placeholder="请输入Cookie" :rows="10" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="6">
            <a-form-item label="自动签到">
              <a-switch v-model:checked="formState.auto_sign" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="成功提醒">
              <a-switch v-model:checked="formState.enable_success_notify" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="异常提醒">
              <a-switch v-model:checked="formState.enable_error_notify" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="Cookie过期提醒">
              <a-switch v-model:checked="formState.enable_cookie_expire_notify"W />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { message } from "ant-design-vue";
import { reactive, ref, toRaw, UnwrapRef } from "vue";
import { isEmpty } from "../../../utils/assert";
import http from "../../../utils/http";

interface FormState {
  cookie: string;
  auto_sign: boolean,
  enable_cookie_expire_notify: boolean;
  enable_error_notify: boolean;
  enable_success_notify: boolean;
}

export default defineComponent({
  name: 'juejin-card',
  setup() {
    const formRef = ref();
    const formState: UnwrapRef<FormState> = reactive({
      cookie: '',
      auto_sign: true,
      enable_cookie_expire_notify: true,
      enable_error_notify: true,
      enable_success_notify: true,
    });
    var jdChecked = ref<boolean>(false);
    var visible = ref<boolean>(false);
    var isCreate = true;

    var refresh = () => {
      http.get(`/api/jd/data`).then((resp: any) => {
        if (resp) {
          isCreate = false;
          Object.assign(formState, resp);
          if (!isEmpty(resp.cookie)) {
            http.get('/api/jd/getTodayStatus').then(resp => jdChecked.value = resp as boolean);
          }
        }
      });
    }
    refresh();
   

    var checkin = () => {
      http.post('/api/jd/checkin').then((resp) => {
        const result = resp as any;
        if (result.code === '3') {
          message.error(result.errorMessage);
        } else {
          message.success('签到成功');
          window.location.reload();
        }
      });
    };

    var saveData = () => {
      if (isCreate) {
        http.post('/api/jd/data', toRaw(formState)).then(() => {
          message.success('更新成功');
          visible.value = false;
          refresh();
        });
      } else {
        http.put('/api/jd/data', toRaw(formState)).then(() => {
          message.success('更新成功');
          visible.value = false;
          refresh();
        });
      }
    };

    return {
      formRef,
      formState,
      visible,
      jdChecked,
      saveData,
      checkin,
    }
  }
})
</script>

<style lang="less" scoped>
@import url('./card.less');
</style>
