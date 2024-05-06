<template>
  <div class="page-aside">
    <el-menu :default-active="activeMenu" class="el-menu-vertical">
      <el-menu-item
        v-for="item in menuList"
        :index="item.path"
        :key="item.path"
        @click="handleNav(item.path)">
        <span>{{ item.name }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
  import { useRoute, useRouter } from "vue-router";
  import { computed } from "vue";
  const menuList = [
    {
      name: "图表",
      path: "/charts",
    },
    {
      name: "画板",
      path: "/board",
    },
    {
      name: "表格",
      path: "/table",
    },
    {
      name: "笔记",
      path: "/note",
    },
  ];

  const router = useRouter();
  const route = useRoute();

  const activeMenu = computed(() => {
    if (!route.path) {
      return "";
    }
    return route.path;
  });

  const handleNav = (path: string) => {
    router.push(path);
  };
</script>

<style scoped>
  .page-aside {
    padding: 20px 0;
    height: calc(100vh - 100px);

    :deep(.is-active) {
      background-color: rgba(64, 158, 255, 0.1);
    }
  }
</style>
