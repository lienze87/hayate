<template>
  <div class="main-content" :style="`background: ${color};`">
    <div v-show="showColorPicker" :style="`color: ${oppositeColor}`">
      <span>按h键隐藏颜色选择器</span>
      <el-color-picker v-model="color" @active-change="handleActiveChange" />
      <p>
        <span>当前颜色：{{ color.toLowerCase() }} </span>/
        <span>相反色：{{ oppositeColor }}</span>
      </p>
      <p>透明度：<drag-input v-model="alphaVal" /></p>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'BackgroundColor',
};
</script>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import DragInput from '@/components/DragInput.vue';

const alphaVal = ref(0);

const color = ref('#ffffff');
const showColorPicker = ref(true);
// 计算背景色的相反色
const oppositeColor = computed(() => {
  return `#${(0xffffff - Number(`0x${color.value.slice(1)}`)).toString(16)}`;
});
const handleActiveChange = (val: string) => {
  color.value = val;
};
onMounted(() => {
  window.addEventListener('keydown', (event) => {
    console.log(event.code);
    if (event.code === 'KeyH') {
      showColorPicker.value = !showColorPicker.value;
    }
  });
});
</script>

<style lang="scss" scoped>
.main-content {
  width: 100vw;
  height: 100vh;
}
</style>
