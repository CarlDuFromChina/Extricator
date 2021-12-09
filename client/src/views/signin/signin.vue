<template>
  <sp-view>
    <sp-body :padding="0" style="background-color: #f0f2f5">
      <a-row :gutter="16" style="padding-bottom: 20px">
        <a-col :span="6">
          <juejin-card></juejin-card>
        </a-col>
        <a-col :span="6">
          <jd-card></jd-card>
        </a-col>
      </a-row>
      <a-calendar v-model:value="value" style="background-color: #fff">
        <template #dateCellRender="{ current }">
          <ul class="events">
            <li v-for="item in getListData(current)" :key="item.content">
              <a-badge :status="item.type" :text="item.content" />
            </li>
          </ul>
        </template>
      </a-calendar>
    </sp-body>
  </sp-view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import http from '../../utils/http';
import { useRequest } from 'vue-request';
import { QuestionOutlined } from '@ant-design/icons-vue';
import format from '../../utils/format';
import { useRouter } from 'vue-router';
import JuejinCard from './card/juejin-card.vue';
import JdCard from './card/jd-card.vue';

export default defineComponent({
  setup() {
    const router = useRouter();
    const value = ref<Dayjs>();

    const { data } = useRequest(() =>
      http.get('/api/checkinrecord/data').then((resp: any) => {
        return resp.map((item: any) => {
          return {
            type: item.status ? 'success' : 'error',
            content: `${item.platform_name}签到${
              item.status ? '成功' : '失败'
            }`,
            created_at: format.dayjs(item.created_at, 'YYYYMMDD'),
          };
        });
      })
    );

    const getListData = (value: Dayjs) => {
      let listData = (data.value || []).filter(
        (item: any) => item.created_at === format.dayjs(value, 'YYYYMMDD')
      );
      return listData || [];
    };

    return {
      value,
      getListData,
    };
  },
  components: { QuestionOutlined, JuejinCard, JdCard },
});
</script>

<style lang="less" scoped>
:deep(.ant-fullcalendar-fullscreen .ant-fullcalendar-content) {
  text-align: center;
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
