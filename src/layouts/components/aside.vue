<template>
  <div class="page-aside">
    <el-menu :default-active="activeMenu" class="page-aside-menu">
      <el-menu-item v-for="item in menuList" :key="item.path" :index="item.path" @click="handleNav(item.path)">
        <span>{{ item.name }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const menuList = [
  {
    name: '图表',
    path: '/charts',
  },
  {
    name: '渐变',
    path: '/gradient',
  },
  {
    name: '画板',
    path: '/board',
  },
  {
    name: '动画',
    path: '/animationNav',
  },
  {
    name: '游戏',
    path: '/gameNav',
  },
  {
    name: '视频',
    path: '/video',
  },
  {
    name: '笔记',
    path: '/note',
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
  height: calc(100vh - 100px);
  padding: 20px 0;

  .page-aside-menu {
    height: 100%;
  }

  :deep(.is-active) {
    background-color: rgba(64, 158, 255, 10%);
  }
}
</style>
