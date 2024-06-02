<template>
  <router-view v-slot="{ Component, route }">
    <!-- <transition name="fade" mode="out-in"> -->
    <keep-alive :include="aliveViews">
      <component :is="Component" :key="route.path" />
    </keep-alive>
    <!-- </transition> -->
  </router-view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const aliveViews = computed(() => {
  return [];
});
</script>
<style lang="scss" scoped></style>
