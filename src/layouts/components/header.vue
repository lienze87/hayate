<template>
  <div class="page-header">
    <div class="header-title">Vue</div>
    <div class="header-nav">
      <el-link href="/background" type="primary" target="_blank">
        纯色背景
      </el-link>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
<style scoped>
  .page-header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 100%;
    border-bottom: 1px solid #d6d6d6;
  }
  .header-title {
    line-height: 60px;
    font-size: 32px;
  }
  .header-nav {
    display: flex;
  }
</style>
