<template>
  <sp-view>
    <sp-body :padding="0" style="background-color: #f0f2f5">
      <div style="padding-bottom: 20px">
        <a-row :gutter="16">
          <a-col :span="6">
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
                <a-button type="link" @click="juejin.checkin" :disabled="juejinChecked">{{ juejinChecked ? '已签到' : '签到' }}</a-button>
                <a-button type="link" @click="juejin.draw">抽奖</a-button>
                <a-button type="link" @click="juejin.allin">梭哈</a-button>
                <a-button type="link" @click="openCookieEditForm('juejin')">Cookie</a-button>
              </template>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card :bordered="false">
              <a-row>
                <a-col style="text-align: left" :span="4">
                  <sp-icon name="jd" size="36"></sp-icon>
                </a-col>
                <a-col :span="20">
                  <p class="title">京东</p>
                  <span class="subtitle">为您提供签到功能~</span>
                </a-col>
              </a-row>
              <template class="ant-card-actions" #actions>
                <a-button type="link" @click="jd.checkin" :disabled="jdChecked">{{ jdChecked ? '已签到' : '签到' }}</a-button>
                <a-button type="link" @click="openCookieEditForm('jd')">Cookie</a-button>
              </template>
            </a-card>
          </a-col>
        </a-row>
      </div>
      <a-calendar v-model:value="value" style="background-color: #fff;">
        <template #dateCellRender="{ current }">
          <ul class="events">
            <li v-for="item in getListData(current)" :key="item.content">
              <a-badge :status="item.type" :text="item.content" />
            </li>
          </ul>
        </template>
      </a-calendar>
      <a-modal v-model:visible="visible" title="编辑 Cookie" @ok="updateCookie">
        <a-alert
          message="注意：Cookie 有效期大部分为一个月，请及时更新"
          type="warning"
          style="margin-bottom: 12px"
          show-icon
        />
        <a-form ref="formRef" layout="vertical" :model="formCookie">
          <a-form-item v-show="cookieName==='juejin'">
            <a-textarea v-model:value="formCookie.juejin" placeholder="请输入Cookie" :rows="10" />
          </a-form-item>
          <a-form-item v-show="cookieName==='jd'">
            <a-textarea v-model:value="formCookie.jd" placeholder="请输入Cookie" :rows="10" />
          </a-form-item>
        </a-form>
      </a-modal>
    </sp-body>
  </sp-view>
</template>

<script lang="ts">
import { createVNode, defineComponent, reactive, ref, toRaw, UnwrapRef } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import http from '../utils/http';
import { useRequest } from 'vue-request';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined, QuestionOutlined } from '@ant-design/icons-vue';
import format from '../utils/format';
import { useRouter } from 'vue-router';
import store from '../store';

interface formCookie {
  juejin: string;
  jd: string;
}

export default defineComponent({
  setup() {
    const router = useRouter();
    const value = ref<Dayjs>();
    const formRef = ref();

    var size = ref('large');

    var visible = ref<boolean>(false);
    var cookieName = ref<string>('');
    var formCookie: UnwrapRef<formCookie> = reactive({
      juejin: '',
      jd: '',
    });
    const code = store.getters.userCode;
    http.get(`/api/user/${code}`).then((resp: any) => {
      if (resp) {
        Object.assign(formCookie, resp.cookie);
      } else {
        message.error('获取Cookie失败');
      }
    });

    var openCookieEditForm = function (name: string) {
      visible.value = true;
      cookieName.value = name;
    };

    var updateCookie = function() {
      formRef.value.validate().then(() => {
        http.put('/api/cookie', toRaw(formCookie)).then((resp) => {
          message.success('修改成功');
          visible.value = false;
        });
      });
    };
    
    var juejinChecked = ref<boolean>(false);

    var juejin = {
      getStatus: () => {
        http.get('/api/juejin/getTodayStatus').then(resp => juejinChecked.value = resp as boolean);
      },
      checkin: () => {
        http.post('/api/juejin/checkin').then(() => {
          message.success('签到成功');
        });
      },
      draw: () => {
        http.post('/api/juejin/draw?count=1').then((resp) => {
          var result = resp as Array<string>;
          message.info(result[0]);
        });
      },
      allin: () => {
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
      },
    };
    juejin.getStatus();

    var jdChecked = ref<boolean>(false);
    var jd = {
      getStatus: () => {
        http.get('/api/jd/getTodayStatus').then(resp => jdChecked.value = resp as boolean);
      },
      checkin: () => {
        http.post('/api/jd/checkin').then((resp) => {
          const result = resp as any;
          if (result.code === '3') {
            message.error(result.errorMessage);
          } else {
            message.success('签到成功');
          }
        });
      },
    };
    jd.getStatus();

    const { data } = useRequest(() =>
      http.get('/api/checkinrecord/data').then((resp: any) => {
        return resp
          .map((item: any) => {
            return {
              type: item.status ? 'success' : 'error',
              content: `${item.platform_name}签到${item.status ? '成功' : '失败'}`,
              created_at: format.dayjs(item.created_at, 'YYYYMMDD'),
            };
          });
      })
    );

    const getListData = (value: Dayjs) => {
      let listData = (data.value || []).filter((item: any) => item.created_at === format.dayjs(value, 'YYYYMMDD'));
      return listData || [];
    };

    return {
      formRef,
      openCookieEditForm,
      updateCookie,
      cookieName,
      formCookie,
      visible,
      size,
      value,
      getListData,
      juejin,
      juejinChecked,
      jd,
      jdChecked
    };
  },
  components: { QuestionOutlined },
});
</script>

<style lang="less" scoped>
:deep(.ant-fullcalendar-fullscreen .ant-fullcalendar-content) {
  text-align: center;
}

.title {
  font-family: 'Microsoft Tai Le Bold', 'Microsoft Tai Le', sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.8470588235294118);
  line-height: 24px;
}

.subtitle {
  font-family: 'PingFang SC ', 'PingFang SC', sans-serif;
  font-weight: 400;
  font-style: normal;
  display: -webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(0, 0, 0, 0.4470588235294118);
  height: 44px;
  line-height: 22px;
  font-size: 14px;
  text-align: left;
}

.events {
  list-style: none;
  margin: 0;
  padding: 0;
}
.events .ant-badge-status {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  font-size: 12px;
}
</style>
