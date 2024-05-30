<template>
  <div class="page-aside">
    <el-menu :default-active="activeMenu" class="page-aside-menu">
      <el-menu-item v-for="item in menuList" :index="item.path" :key="item.path" @click="handleNav(item.path)">
        <span>{{ item.name }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
const menuList = [
  {
    name: '图表',
    path: '/charts',
  },
  {
    name: '画板',
    path: '/board',
  },
  {
    name: '动画',
    path: '/timeFunction',
  },
  {
    name: '视频',
    path: '/video',
  },
  {
    name: '笔记',
    path: '/note',
  },
  {
    name: '脚本',
    path: '/script',
  },
];

const router = useRouter();
const route = useRoute();

const activeMenu = computed(() => {
  if (!route.path) {
    return '';
  }
  return route.path;
});

const handleNav = (path: string) => {
  router.push(path);
};
</script>

<style lang="scss" scoped>
.page-aside {
  padding: 20px 0;
  height: calc(100vh - 100px);

  .page-aside-menu {
    height: 100%;
  }

  :deep(.is-active) {
    background-color: rgba(64, 158, 255, 0.1);
  }
}
</style>
