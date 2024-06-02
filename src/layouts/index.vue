<template>
  <el-container class="common-layout">
    <el-header><layout-header /></el-header>
    <el-container>
      <el-aside width="200px">
        <layout-aside />
      </el-aside>
      <el-main>
        <layout-main />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import LayoutAside from './components/aside.vue';
import LayoutHeader from './components/header.vue';
import LayoutMain from './components/main.vue';
</script>
<style lang="scss" scoped>
.common-layout {
  .el-header {
    padding: 0;
  }
}
</style>
