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
      name: "Chart",
      path: "/charts",
    },
    {
      name: "Note",
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
  }
</style>
