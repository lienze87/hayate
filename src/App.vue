<script lang="ts" setup>
  import ECharts from "./components/ECharts.vue";
  import Editor from "./components/Editor.vue";
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
    title: {
      show: false,
      text: "",
    },
    xAxis: {
      data: "",
    },
    yAxis: {},
  });

  const series = ref({
    type: "line",
    data: "",
  });

  const options = computed(() => {
    let categoryData: string[] = [];
    let lineData: string | number[] = [];
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
          type: series.value.type,
        },
      ],
    };
  });

  const activeTab = ref("form");

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
      <el-tabs v-model="activeTab">
        <el-tab-pane label="表单" name="form"></el-tab-pane>
        <el-tab-pane label="文本" name="editor"></el-tab-pane>
      </el-tabs>
      <el-form v-show="activeTab === 'form'" :model="config" label-width="auto">
        <el-form-item label="图表类型">
          <el-select v-model="series.type" placeholder="请选择">
            <el-option
              v-for="item in seriesType"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="图表标题">
          <el-switch v-model="config.title.show"></el-switch>
        </el-form-item>
        <div>
          <p>xAxis</p>
          <el-form-item label="数据">
            <el-input
              v-model="config.xAxis.data"
              placeholder="请输入数据，以，隔开"></el-input>
          </el-form-item>
        </div>
        <div>
          <p>yAxis</p>
          <el-form-item label="数据">
            <el-input v-model="config.xAxis.data"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="series"> </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-form>
      <Editor v-show="activeTab === 'editor'" :options="options" />
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
