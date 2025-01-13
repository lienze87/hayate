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
    name: '动画-时间函数',
    path: '/animation/timeFunction',
  },
  {
    name: '动画-过渡',
    path: '/animation/transition',
  },
  {
    name: '动画-动画',
    path: '/animation/animation',
  },
  {
    name: '动画-滚动',
    path: '/animation/scrollTrigger',
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
  flex-flow: wrap;
  flex-direction: flex-start;
  align-items: center;
  justify-content: flex-start;

  .card-item {
    margin-right: 20px;
    cursor: pointer;
  }
}
</style>
