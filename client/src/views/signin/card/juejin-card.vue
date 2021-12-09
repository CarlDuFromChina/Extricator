<template>
  <a-card :bordered="false">
    <a-row>
      <a-col style="text-align: left" :span="4">
        <sp-icon name="juejin" size="36"></sp-icon>
      </a-col>
      <a-col :span="20">
        <p class="title">掘金</p>
        <span class="subtitle">为您提供掘金签到，抽奖和梭哈功能~</span>
      </a-col>
    </a-row>
    <template class="ant-card-actions" #actions>
      <a-button type="link" @click="checkin" :disabled="juejinChecked || !formState.cookie">{{ juejinChecked ? '已签到' : '签到' }}</a-button>
      <a-button type="link" @click="draw" :disabled="!formState.cookie">抽奖</a-button>
      <a-button type="link" @click="allin" :disabled="!formState.cookie">梭哈</a-button>
      <a-button type="link" @click="visible = true">设置</a-button>
    </template>
    <a-modal v-model:visible="visible" title="设置" @ok="saveData">
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
          <a-col :span="8">
            <a-form-item label="成功提醒">
              <a-switch v-model:checked="formState.enable_success_notify" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="异常提醒">
              <a-switch v-model:checked="formState.enable_error_notify" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Cookie过期提醒">
              <a-switch v-model:checked="formState.enable_cookie_expire_notify" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { message, Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode, reactive, ref, toRaw, UnwrapRef } from "vue";
import http from "../../../utils/http";
import { isEmpty } from "../../../utils/assert";

interface FormState {
  cookie: string;
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
      enable_cookie_expire_notify: true,
      enable_error_notify: true,
      enable_success_notify: true,
    });
    var juejinChecked = ref<boolean>(false);
    var visible = ref<boolean>(false);

    var isCreate = true;
    var refresh = () => {
      http.get(`/api/juejin/data`).then((resp: any) => {
        if (resp) {
          isCreate = false;
          Object.assign(formState, resp);
          if (!isEmpty(resp.cookie)) {
            http.get('/api/juejin/getTodayStatus').then(resp => juejinChecked.value = resp as boolean);
          }
        }
      });
    }

    refresh();

    var checkin = () => {
      http.post('/api/juejin/checkin').then(() => {
        message.success('签到成功');
      });
    };
    var draw = () => {
      http.post('/api/juejin/draw?count=1').then((resp) => {
        var result = resp as Array<string>;
        message.info(result[0]);
      });
    };
    var allin = () => {
      Modal.confirm({
        title: '提示',
        icon: createVNode(ExclamationCircleOutlined),
        content: '请确认你是否要 ALL IN',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          http.post('/api/juejin/allin').then((resp) => {
            message.success(resp as string);
          });
        },
      });
    };
    var saveData = () => {
      if (isCreate) {
        http.post('/api/juejin/data', toRaw(formState)).then(() => {
          message.success('更新成功');
          visible.value = false;
          refresh();
        });
      } else {
        http.put('/api/juejin/data', toRaw(formState)).then(() => {
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
      juejinChecked,
      saveData,
      checkin,
      draw,
      allin
    }
  },
  components: { ExclamationCircleOutlined }
})
</script>

<style lang="less" scoped>
@import url('./card.less');
</style>
