<template>
  <div class="main-content">
    <el-input
      v-model="text"
      :autosize="{ minRows: 10, maxRows: 20 }"
      type="textarea"
      placeholder="请输入内容" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  const text = ref("");
</script>
<style scoped>
  .main-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    height: calc(100vh - 100px);
  }
</style>
