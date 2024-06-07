<template>
  <div class="main-content">
    <div class="charts-container">
      <e-charts ref="eChartsRef" :options="options" />
    </div>
    <div class="options-container">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="数据" name="data"></el-tab-pane>
        <el-tab-pane label="表单" name="form"></el-tab-pane>
        <el-tab-pane label="配置" name="editor"></el-tab-pane>
      </el-tabs>
      <div v-show="activeTab === 'data'" class="option-table">
        <div class="action_bar">
          <el-form :model="dataForm" class="data-form-content" label-width="auto" inline>
            <el-form-item label="表达式">
              <div style="display: inline-flex">
                <div>{{ dataForm.resultSymbol }}=</div>
                <el-input v-model="dataForm.expression"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="数量">
              <el-input-number v-model="dataForm.number" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleAddData">生成数据</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="dataset.source">
          <el-table-column prop="x" label="x" />
          <el-table-column prop="y" label="y" />
          <el-table-column prop="t" label="t" />
        </el-table>
      </div>
      <div v-show="activeTab === 'form'" class="options-form">
        <el-form :model="config" class="options-form-content" label-width="auto" inline>
          <el-form-item label="图表类型">
            <el-select v-model="seriesType" placeholder="请选择">
              <el-option v-for="item in seriesTypeList" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="图例">
            <el-switch v-model="config.legend.show"></el-switch>
          </el-form-item>
          <div class="config-group">
            <el-form-item label="启用提示框">
              <el-switch v-model="config.tooltip.show"></el-switch>
            </el-form-item>
            <el-form-item label="提示框触发类型">
              <el-select v-model="config.tooltip.trigger" placeholder="请选择">
                <el-option
                  v-for="item in tooltipTriggerList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="xAxis类型">
            <el-select v-model="config.xAxis.type" placeholder="请选择">
              <el-option v-for="item in axisTypeList" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="xAxis刻度居中 ">
            <el-switch v-model="config.xAxis.boundaryGap"></el-switch>
          </el-form-item>
          <el-form-item label="yAxis类型">
            <el-select v-model="config.yAxis.type" placeholder="请选择">
              <el-option v-for="item in axisTypeList" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
          <div v-if="seriesType === 'line'" class="config-group">
            <el-form-item label="平滑曲线">
              <el-switch v-model="lineConfig.smooth"></el-switch>
            </el-form-item>
            <el-form-item label="启用区域填充">
              <el-switch v-model="lineConfig.areaStyle.enable"></el-switch>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <json-editor v-show="activeTab === 'editor'" :options="options" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Charts',
};
</script>

<script lang="ts" setup>
import { parse } from 'mathjs';
import { computed, onMounted, ref } from 'vue';

import ECharts from '@/components/ECharts.vue';
import JsonEditor from '@/components/JsonEditor.vue';

const eChartsRef = ref();

const seriesTypeList = [
  {
    name: '折线图',
    value: 'line',
  },
  {
    name: '散点图',
    value: 'scatter',
  },
];

const axisTypeList = [
  {
    name: '数值轴',
    value: 'value',
  },
  {
    name: '类目轴',
    value: 'category',
  },
  {
    name: '时间轴',
    value: 'time',
  },
  {
    name: '对数轴',
    value: 'log',
  },
];

const tooltipTriggerList = [
  {
    name: '数据项图形',
    value: 'item',
  },
  {
    name: '坐标轴',
    value: 'axis',
  },
  {
    name: '不触发',
    value: 'none',
  },
];

const dataForm = ref({
  expression: 'cos(x)',
  resultSymbol: 'y',
  variableSymbol: 'x',
  number: 10,
});

const dataset = ref({
  dimensions: ['x', 'y', 't'],
  source: [],
});

const handleAddData = () => {
  const list = [];
  let index = 0;

  function getValue(x: number) {
    try {
      const node = parse(dataForm.value.expression);
      const code = node.compile();
      const evaluate = code.evaluate({ x });
      return evaluate;
    } catch (e) {
      dataForm.value.expression = 'x';
      return x;
    }
  }

  function formatNum(val: Number) {
    return Number(val.toFixed(2));
  }

  while (list.length < dataForm.value.number) {
    list.push({
      x: index,
      y: formatNum(getValue(index)),
      t: formatNum((index + 1) / dataForm.value.number),
    });
    index++;
  }

  dataset.value.source = list;
};

const config = ref({
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
  },
  axisPointer: {
    link: { xAxisIndex: 'all' },
    label: {
      backgroundColor: '#777',
    },
  },
  grid: {
    show: true,
    containLabel: true,
  },
  legend: {
    show: true,
    left: 'auto',
    top: 'auto',
    right: 'auto',
    bottom: 'auto',
  },
  xAxis: {
    show: true,
    type: 'category',
    boundaryGap: false,
  },
  yAxis: { show: true, type: 'value' },
});

const seriesType = ref('line');
const lineConfig = ref({
  smooth: false,
  areaStyle: { enable: false },
});

const options = computed(() => {
  const nowConfig = { ...config.value };

  const tempConf = { ...lineConfig.value };
  if (!tempConf.areaStyle.enable) {
    tempConf.areaStyle = undefined;
  }

  return {
    ...nowConfig,
    dataset: dataset.value,
    series: [
      {
        name: `y=${dataForm.value.expression}`,
        type: seriesType.value,
        encode: { x: 2, y: 1 },
        ...tempConf,
      },
    ],
  };
});

const activeTab = ref('form');
onMounted(() => {
  handleAddData();
});
</script>

<style lang="scss" scoped>
.main-content {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  width: 100%;
  height: calc(100vh - 100px);
}
.charts-container {
  flex-basis: 640px;
  padding: 20px;
}
.options-container {
  flex-grow: 1;
  flex-shrink: 0;
  max-height: 100%;
  overflow: auto;
}

.form-item-inline {
  display: flex;
  justify-content: space-around;
}
.options-form {
  width: 80%;
  .options-form-content {
    .el-form-item {
      gap: 20px;
      flex-basis: 33%;
    }
  }
  .el-select {
    min-width: 180px;
  }
}
</style>
