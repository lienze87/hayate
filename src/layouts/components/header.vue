<template>
  <div class="page-header">
    <div class="header-title">Hayate</div>
    <div class="header-nav">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          更多页面
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in menuList" :key="item.path">
              <el-link :href="item.path" type="primary" target="_blank">
                {{ item.name }}
              </el-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue';
import { ref } from 'vue';

const menuList = ref([
  {
    name: '纯色背景',
    path: '/background',
  },
]);
</script>
<style lang="scss" scoped>
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
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
