<template>
  <div class="page-header">
    <div class="header-title">Hayate</div>
    <div class="header-nav">
      <div
        class="server-status"
        :style="`color: ${serverStatus === '在线' ? 'blue' : 'red'}`"
        @click="handleCheckServer"
      >
        {{ serverStatus }}
      </div>
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
import { computed, onBeforeMount, ref } from 'vue';

import { checkServer } from '@/api/common';
import { useCommonStore } from '@/store';

const store = useCommonStore();

const serverStatus = computed(() => {
  return store.online ? '在线' : '离线';
});

const menuList = ref([
  {
    name: '纯色背景',
    path: '/background',
  },
]);

const refreshing = ref(false);

function handleCheckServer() {
  if (refreshing.value) return;
  refreshing.value = true;
  checkServer()
    .then((res: any) => {
      store.setServerStatus(res.data);
    })
    .catch(() => {
      store.setServerStatus(500);
    })
    .finally(() => {
      refreshing.value = false;
    });
}

onBeforeMount(() => {
  handleCheckServer();
});
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
.server-status {
  display: flex;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;
}
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
