<template>
  <sp-view>
    <sp-header></sp-header>
    <sp-body>
      <a-table :columns="columns" :data-source="data">
      </a-table>
    </sp-body>
  </sp-view>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { onBeforeMount } from "vue";
import http from "../utils/http";
import { useRequest } from 'vue-request';

const columns = [
  {
    title: '签到平台',
    dataIndex: 'platform_name',
    key: 'platform_name',
  },
  {
    title: '状态',
    dataIndex: 'status_name',
    key: 'status'
  },
  {
    title: '失败原因',
    dataIndex: 'error_reason',
    key: 'error_reason',
    ellipsis: true,
  },
  {
    title: '签到时间',
    dataIndex: 'created_at',
    key: 'created_at',
  }
];
export default defineComponent({
  setup() {
    const { data } = useRequest(() => http.get('/api/checkinrecord/data').then((resp: any) => {
      return resp.map((item: any) => {
        item.status_name = item.status ? '成功' : '失败';
        return item;
      });
    }));
    return {
      data,
      columns,
    };
  }
})
</script>

<style>

</style>