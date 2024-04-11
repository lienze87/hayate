<script setup>
  import ECharts from "./components/ECharts.vue";
  import { ref, computed } from "vue";

  const dataList = ref([
    {
      label: "Mon",
      value: 150,
    },
    {
      label: "Tue",
      value: 230,
    },
    {
      label: "Wed",
      value: 224,
    },
    {
      label: "Thu",
      value: 218,
    },
    {
      label: "Fri",
      value: 135,
    },
    {
      label: "Sat",
      value: 147,
    },
    {
      label: "Sun",
      value: 260,
    },
  ]);

  const seriesType = [
    {
      label: "折线图",
      value: "line",
    },
    {
      label: "柱状图",
      value: "bar",
    },
    {
      label: "散点图",
      value: "scatter",
    },
  ];

  const config = ref({
    type: "line",
  });

  const options = computed(() => {
    let categoryData = [];
    let lineData = [];
    if (dataList.value.length > 0) {
      dataList.value.forEach((item) => {
        categoryData.push(item.label);
        lineData.push(item.value);
      });
    }

    return {
      xAxis: {
        type: "category",
        data: categoryData,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: lineData,
          type: config.value.type,
        },
      ],
    };
  });

  const onSubmit = () => {
    console.log("submit");
  };
</script>

<template>
  <div id="main-content">
    <div class="charts-container">
      <ECharts :options="options" />
    </div>
    <div class="options-container">
      <el-form :model="config" label-width="auto">
        <el-form-item label="图表类型">
          <el-select v-model="config.type" placeholder="请选择">
            <el-option
              v-for="item in seriesType"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
  #main-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    height: 100%;
  }
  .options-container {
    width: 300px;
  }
</style>
