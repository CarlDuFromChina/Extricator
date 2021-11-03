<template>
  <div class="background">
    <div class="setting">
      <a-form ref="formRef" :model="formSetting" class="setting__wrapper">
        <a-form-item>
          <span class="header">Extricator Setting</span>
        </a-form-item>
        <div>
          <a-form-item label="掘金">
            <a-input v-model:value="formSetting.cookie.juejin"></a-input>
          </a-form-item>
          <a-form-item label="京东">
            <a-input v-model:value="formSetting.cookie.jd"></a-input>
          </a-form-item>
        </div>
        <div>
          <a-form-item>
            <a-button type="primary" @click="submit">提交</a-button>
          </a-form-item>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, ref, toRaw, UnwrapRef } from "vue";
import { message } from "ant-design-vue";
import axios from "../utils/http";
import store from "../store";
import { useRouter } from "vue-router";
import { defineComponent } from "@vue/runtime-core";

interface FormSetting {
  code: string;
  password: string;
  cookie: {
    juejin: string;
    jd: string;
  };
}

export default defineComponent({
  setup() {
    const formRef = ref();
    const router = useRouter();
    var formSetting: UnwrapRef<FormSetting> = reactive({
      code: "",
      password: "",
      cookie: {
        juejin: "",
        jd: "",
      },
    });
    const code = store.getters.userCode.toString();
    axios.get("/api/user", {params: {code: code}})
      .then((resp) => {
        if (resp.data) {
          message.success("成功获取用户设置");
          formSetting = resp.data;
        } else {
          message.error("获取用户设置失败");
        }
      });
    const submit = () => {
      formRef.value.validate().then(() => {
        axios
          .put("/api/user", toRaw(formSetting))
          .then((resp) => {
            if (resp.data) {
              message.success("修改成功");
            } else {
              message.error("修改失败");
            }
          })
          .catch(() => {
            message.error("修改失败");
          });
      });
    };
    return {
      formRef,
      formSetting,
      submit,
    };
  },
});
</script>

<style lang="less" scoped>
.background {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
}
.setting {
  width: 1000px;
  position: absolute;
  left: calc(~"50%" - 400px);
  top: 120px;
  .setting__wrapper {
    width: 100%;
    height: 100%;
    text-align: left;
    padding: 0 20px;
    .header {
      font-size: 30px;
      color: rgba(0, 0, 0, 0.85);
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      font-weight: 300px;
      line-height: 60px;
    }
  }
  .ant-form-item-label > label {
    font-size: 20px;
  }
  .ant-btn-primary {
    float: right;
  }
}
</style>