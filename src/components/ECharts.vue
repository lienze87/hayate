<script setup>
  import * as echarts from "echarts";
  import { onMounted, watch } from "vue";

  const props = defineProps({
    options: {
      type: Object,
      default: {},
    },
  });

  let myChart = null;

  function initChart(options) {
    if (myChart !== null) {
      myChart.setOption(options);
      return;
    }

    let container = document.getElementById("main-chart");
    myChart = echarts.init(container);
    myChart.setOption(options);
  }

  watch(
    () => props.options,
    () => {
      initChart(props.options);
    }
  );

  onMounted(() => {
    initChart(props.options);
  });
</script>

<template>
  <div id="main-chart"></div>
</template>

<style scoped>
  #main-chart {
    width: 640px;
    height: 480px;
  }
</style>
