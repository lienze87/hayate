<script lang="ts" setup>
  import ECharts from "./components/ECharts.vue";
  import Editor from "./components/Editor.vue";
  import { ref, computed } from "vue";

  const eChartsRef = ref();

  const seriesTypeList = [
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
    {
      label: "饼图",
      value: "pie",
    },
  ];

  const config = ref({
    title: {
      show: false,
      text: "图表标题",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      show: true,
    },
  });

  const seriesType = ref("line");
  const lineSmooth = ref(false);
  const categoryList = ref(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);

  const seriesData = ref([
    {
      id: 1,
      name: "Email",
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      id: 2,
      name: "Phone",
      data: [320, 332, 301, 334, 390, 330, 320],
    },
  ]);

  const dataList = computed(() => {
    return seriesData.value.map((group) => {
      let data: any = {};
      categoryList.value.forEach((category, index) => {
        data[category] = group.data[index];
      });

      return data;
    });
  });

  const options = computed(() => {
    return {
      ...config.value,
      xAxis: {
        show: seriesType.value === "pie" ? false : true,
        type: "category",
        data: categoryList.value,
      },
      yAxis: { show: seriesType.value === "pie" ? false : true, type: "value" },
      series: seriesData.value.map((serie) => {
        if (seriesType.value === "pie") {
          return {
            ...serie,
            type: seriesType.value,
            data: categoryList.value.map((category, index) => {
              return { name: category, value: serie.data[index] };
            }),
          };
        } else if (seriesType.value === "line") {
          return { ...serie, type: seriesType.value, smooth: lineSmooth.value };
        } else {
          return { ...serie, type: seriesType.value };
        }
      }),
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
          <el-form-item label="图表类型">
            <el-select v-model="seriesType" placeholder="请选择">
              <el-option
                v-for="item in seriesTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="seriesType === 'line'" label="平滑曲线">
            <el-switch v-model="lineSmooth"></el-switch>
          </el-form-item>
          <div>
            <p>series</p>
            <div v-for="group in seriesData" :key="group.id">
              <el-form-item label="集合名称">
                <el-input
                  v-model="group.name"
                  placeholder="请输入集合名称"></el-input>
              </el-form-item>

              <el-divider />
            </div>
          </div>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </el-form-item>
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
  .options-container {
    width: 500px;
  }
</style>
