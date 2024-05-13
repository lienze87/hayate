<template>
  <div class="main-content" :style="`background: ${color};`">
    <div v-show="showColorPicker" :style="`color: ${oppositeColor}`">
      <span>按h键隐藏颜色选择器</span>
      <el-color-picker v-model="color" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed } from "vue";
  const color = ref("#ffffff");
  const showColorPicker = ref(true);
  // 计算背景色的相反色
  const oppositeColor = computed(() => {
    return `#${(0xffffff - Number(`0x${color.value.slice(1)}`)).toString(16)}`;
  });
  onMounted(() => {
    window.addEventListener("keydown", (event) => {
      console.log(event.code);
      if (event.code === "KeyH") {
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
