<template>
  <el-container class="common-layout">
    <el-header><Header /></el-header>
    <el-container>
      <el-aside width="200px">
        <Aside />
      </el-aside>
      <el-main>
        <Main />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
  import Header from "./components/header.vue";
  import Aside from "./components/aside.vue";
  import Main from "./components/main.vue";
</script>
<style lang="scss" scoped>
  .common-layout {
    .el-header {
      padding: 0;
    }
  }
</style>
