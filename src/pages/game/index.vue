<template>
  <div class="main-content">
    <div class="card-list">
      <el-card v-for="item in pageList" :key="item.path" class="card-item" @click="handleCheckDetail(item.path)">
        <template #header>{{ item.name }}</template>
        <p>
          {{ item.path }}
        </p>
      </el-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const pageList = ref([
  {
    name: '游戏-恐龙',
    path: '/game/dino',
  },
  {
    name: '游戏-卷轴',
    path: '/game/reel',
  },
  {
    name: '游戏-碰撞',
    path: '/game/smooth',
  },
  {
    name: '游戏-星星',
    path: '/game/star',
  },
  {
    name: '游戏-地图',
    path: '/game/map',
  },
  {
    name: '游戏-平滑',
    path: '/game/smooth',
  },
]);

function handleCheckDetail(path: string) {
  window.open(path, '_blank');
}
</script>
<style lang="scss" scoped>
.main-content {
  position: relative;
  width: 100%;
  height: auto;
  min-height: 100%;
  overflow: hidden;
}
.card-list {
  display: flex;
  flex-direction: flex-start;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  .card-item {
    margin-right: 20px;
    cursor: pointer;
  }
}
</style>
