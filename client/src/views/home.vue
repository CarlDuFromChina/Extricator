<template>
  <div class="content">
    <h2>Extricator</h2>
    <span class="slogan">The meaning of my existence is that you will forget something</span>
    <br />
    <div style="margin-top: 16px">
      <router-link to="/login">Sign In / Sign Up</router-link>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'home',
};
</script>

<style lang="less" scoped>
.content {
  position: absolute;
  width: 100%;
  top: 200px;
}

h2 {
  font-size: 48px;
  font-family: century gothic, texgyreadventor, stheiti, sans-serif;
}
.slogan {
  font-family: raleway, century gothic, texgyreadventor, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 22px;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: #999;
  text-align: center;
}
</style>
