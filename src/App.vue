<script lang="ts" setup>
  import ECharts from "./components/ECharts.vue";
  import Editor from "./components/Editor.vue";
  import { ref, computed } from "vue";

  const eChartsRef = ref();

  const seriesTypeList = [
    {
      name: "折线图",
      value: "line",
    },
    {
      name: "柱状图",
      value: "bar",
    },
    {
      name: "散点图",
      value: "scatter",
    },
    {
      name: "饼图",
      value: "pie",
    },
  ];

  const xAxisTypeList = [
    {
      name: "数值轴",
      value: "value",
    },
    {
      name: "类目轴",
      value: "category",
    },
    {
      name: "时间轴",
      value: "time",
    },
    {
      name: "对数轴",
      value: "log",
    },
  ];

  const tooltipTriggerList = [
    {
      name: "数据项图形",
      value: "item",
    },
    {
      name: "坐标轴",
      value: "axis",
    },
    {
      name: "不触发",
      value: "none",
    },
  ];

  const dataset = ref([
    {
      id: 1,
      name: "Email",
      values: [
        { name: "Mon", value: 120 },
        { name: "Tue", value: 132 },
        { name: "Wed", value: 101 },
        { name: "Thu", value: 134 },
        { name: "Fri", value: 90 },
        { name: "Sat", value: 130 },
        { name: "Sun", value: 110 },
      ],
    },
    // {
    //   id: 2,
    //   name: "Phone",
    //   values: [
    //     { name: "Mon", value: 220 },
    //     { name: "Tue", value: 232 },
    //     { name: "Wed", value: 201 },
    //     { name: "Thu", value: 234 },
    //     { name: "Fri", value: 290 },
    //     { name: "Sat", value: 230 },
    //     { name: "Sun", value: 210 },
    //   ],
    // },
  ]);

  const config = ref({
    title: {
      show: false,
      text: "图表标题",
      left: "auto",
      top: "auto",
      right: "auto",
      bottom: "auto",
    },
    tooltip: {
      show: true,
      trigger: "item",
    },
    grid: {
      show: true,
      left: "10%",
      top: 60,
      right: "10%",
      bottom: 60,
      containLabel: false,
    },
    legend: {
      show: true,
      left: "auto",
      top: "auto",
      right: "auto",
      bottom: "auto",
    },
    xAxis: {
      show: true,
      type: "category",
      boundaryGap: false,
      data: [],
    },
    yAxis: { show: true, type: "value" },
  });

  const seriesType = ref("line");
  const lineConfig = ref({
    smooth: false,
    areaStyle: { enable: true },
  });

  const categoryList = computed(() => {
    return dataset.value[0].values.map((ele) => ele.name);
  });

  const dataList = computed(() => {
    return dataset.value.map((group) => {
      let data: any = {};

      group.values.forEach((item) => {
        data[item.name] = item.value;
      });

      return data;
    });
  });

  const options = computed(() => {
    if (seriesType.value === "pie") {
      config.value.xAxis.show = false;
      config.value.yAxis.show = false;
      config.value.grid.show = false;
    } else {
      config.value.xAxis.show = true;
      config.value.yAxis.show = true;
      config.value.grid.show = true;
    }
    config.value.xAxis.data = categoryList.value;
    return {
      ...config.value,
      series: dataset.value.map((item) => {
        const valueList = item.values.map((ele) => ele.value);
        if (seriesType.value === "pie") {
          return {
            name: item.name,
            type: seriesType.value,
            data: item.values,
          };
        } else if (seriesType.value === "line") {
          let tempConf = { ...lineConfig.value };
          if (!tempConf.areaStyle.enable) {
            tempConf.areaStyle = undefined;
          }

          return {
            name: item.name,
            type: seriesType.value,
            data: valueList,
            ...tempConf,
          };
        } else {
          return { name: item.name, type: seriesType.value, data: valueList };
        }
      }),
    };
  });

  const activeTab = ref("form");
</script>

<template>
  <div id="main-content">
    <div class="charts-container">
      <ECharts ref="eChartsRef" :options="options" />
    </div>
    <div class="options-container">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="数据" name="data"></el-tab-pane>
        <el-tab-pane label="表单" name="form"></el-tab-pane>
        <el-tab-pane label="文本" name="editor"></el-tab-pane>
      </el-tabs>
      <el-table v-show="activeTab === 'data'" :data="dataList">
        <el-table-column
          v-for="category in categoryList"
          :key="category"
          :prop="category"
          :label="category">
        </el-table-column>
      </el-table>
      <div v-show="activeTab === 'form'" class="options-form">
        <el-form :model="config" label-width="auto">
          <el-form-item label="图表类型">
            <el-select v-model="seriesType" placeholder="请选择">
              <el-option
                v-for="item in seriesTypeList"
                :key="item.value"
                :label="item.name"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="标题">
            <el-switch v-model="config.title.show"></el-switch>
            <el-input
              v-if="config.title.show"
              v-model="config.title.text"
              placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="图例">
            <el-switch v-model="config.legend.show"></el-switch>
          </el-form-item>
          <div class="config-group">
            <p>提示框</p>
            <el-form-item label="启用">
              <el-switch v-model="config.tooltip.show"></el-switch>
            </el-form-item>
            <el-form-item label="触发类型">
              <el-select v-model="config.tooltip.trigger" placeholder="请选择">
                <el-option
                  v-for="item in tooltipTriggerList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </div>
          <div class="config-group">
            <p>网格</p>
            <el-form-item label="left">
              <el-input v-model="config.grid.left"></el-input>
            </el-form-item>
            <el-form-item label="top">
              <el-input v-model="config.grid.top"></el-input>
            </el-form-item>
            <el-form-item label="right">
              <el-input v-model="config.grid.right"></el-input>
            </el-form-item>
            <el-form-item label="bottom">
              <el-input v-model="config.grid.bottom"></el-input>
            </el-form-item>
            <el-form-item label="包含刻度标签">
              <el-switch v-model="config.grid.containLabel"></el-switch>
            </el-form-item>
          </div>
          <div class="config-group">
            <p>xAxis</p>
            <el-form-item label="类型">
              <el-select v-model="config.xAxis.type" placeholder="请选择">
                <el-option
                  v-for="item in xAxisTypeList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="刻度居中 ">
              <el-switch v-model="config.xAxis.boundaryGap"></el-switch>
            </el-form-item>
          </div>
          <div v-if="seriesType === 'line'" class="config-group">
            <p>line</p>
            <el-form-item label="平滑曲线">
              <el-switch v-model="lineConfig.smooth"></el-switch>
            </el-form-item>
            <p>区域填充</p>
            <el-form-item label="启用">
              <el-switch v-model="lineConfig.areaStyle.enable"></el-switch>
            </el-form-item>
          </div>
          <div class="config-group">
            <p>series</p>
            <div v-for="group in dataset" :key="group.id">
              <el-form-item label="集合名称">
                <el-input
                  v-model="group.name"
                  placeholder="请输入集合名称"></el-input>
              </el-form-item>
              <el-divider />
            </div>
          </div>
        </el-form>
      </div>
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
  .charts-container {
    padding: 2rem;
  }
  .options-container {
    width: 500px;
    max-height: 600px;
    overflow: auto;
  }
</style>
