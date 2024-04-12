<script lang="ts" setup>
  import * as echarts from "echarts";
  import { onMounted, watch } from "vue";

  const props = defineProps({
    options: {
      type: Object,
      default: {},
    },
  });

  let myChart: any = null;

  function initChart(options: any) {
    if (myChart !== null) {
      myChart.setOption(options);
      return;
    }

    let container = document.getElementById("main-chart");
    myChart = echarts.init(container);
    myChart.setOption(options, true);
  }

  watch(
    () => props.options,
    () => {
      initChart(props.options);
    },
    {
      deep: true,
    }
  );

  onMounted(() => {
    initChart(props.options);
  });
</script>

<template>
  <div id="main-chart"></div>
</template>

<style lang="scss" scoped>
  #main-chart {
    width: 640px;
    height: 480px;
  }
</style>
