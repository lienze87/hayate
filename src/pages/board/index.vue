<template>
  <div class="main-content">
    <div class="form-container">
      <h3>参考线设置</h3>
      <el-form :inline="true" :model="formData" class="form-inline">
        <el-form-item label="最小值">
          <el-input-number
            v-model="formData.min"
            :step="1"
            :min="0"
            :max="formData.max"
            placeholder="请输入"
            clearable />
        </el-form-item>
        <el-form-item label="最大值">
          <el-input-number
            v-model="formData.max"
            :step="1"
            :min="formData.min"
            :max="250"
            placeholder="请输入"
            clearable />
        </el-form-item>
        <el-form-item label="间隔">
          <el-input-number
            v-model="formData.step"
            :step="1"
            placeholder="请输入"
            clearable />
        </el-form-item>
        <el-form-item label="方向">
          <el-select
            v-model="formData.direction"
            placeholder="请选择"
            style="width: 150px">
            <el-option label="水平线" :value="'horizon'"></el-option>
            <el-option label="垂直线" :value="'vertical'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button type="danger" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
      <p>请在画板内用鼠标进行绘制</p>
      <div class="my-board" ref="myBoard"></div>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    name: "Board",
  };
</script>

<script setup lang="ts">
  import { ref, onMounted, computed } from "vue";
  import { initCanvasDraw } from "@/utils/canvasDraw";

  const FONT_SIZE = 24;
  const BACKGROUND_COLOR = "#274c43";
  const PEN_COLOR = "#ffffff";

  const formData = ref({
    min: 0,
    max: 6,
    step: 1,
    direction: "vertical",
  });
  const dataList = ref([]);
  const percentList = computed(() => {
    const range = formData.value.max - formData.value.min;
    const result = dataList.value.map((ele: number) => {
      return parseFloat((ele / range).toFixed(2));
    });
    return result;
  });

  function getDataList() {
    let result = [];
    for (
      let i = formData.value.min;
      i <= formData.value.max;
      i += formData.value.step
    ) {
      result.push(i);
    }
    return result;
  }

  function drawXAxis() {
    const width = myCanvas.width;
    const height = myCanvas.height;
    const paddingLeft = 50;
    const paddingTop = Math.floor(height * 0.9);

    ctx.fillStyle = PEN_COLOR;
    ctx.beginPath();

    // x轴
    ctx.moveTo(paddingLeft, paddingTop);
    ctx.lineTo(width - paddingLeft, paddingTop);
    ctx.stroke();

    // 绘制刻度
    percentList.value.forEach((ele: number, index: number) => {
      let offsetLeft =
        paddingLeft + Math.floor((width - 2 * paddingLeft) * ele);

      ctx.moveTo(offsetLeft, paddingTop - 30);
      ctx.lineTo(offsetLeft, paddingTop);
      ctx.stroke();
      ctx.fillText(
        dataList.value[index].toString(),
        offsetLeft - FONT_SIZE * 0.2,
        paddingTop + FONT_SIZE
      );
    });
  }

  function drawYAxis() {
    const width = myCanvas.width;
    const height = myCanvas.height;
    const paddingLeft = Math.floor(width * 0.1);
    const paddingTop = 50;

    ctx.fillStyle = PEN_COLOR;
    ctx.beginPath();

    // x轴
    ctx.moveTo(paddingLeft, paddingTop);
    ctx.lineTo(paddingLeft, height - paddingTop);
    ctx.stroke();

    // 绘制刻度
    percentList.value.forEach((ele: number, index: number) => {
      let offsetTop = paddingTop + Math.floor((height - 2 * paddingTop) * ele);

      ctx.moveTo(paddingLeft, offsetTop);
      ctx.lineTo(paddingLeft + 30, offsetTop);
      ctx.stroke();
      ctx.fillText(
        dataList.value[index].toString(),
        paddingLeft - FONT_SIZE,
        offsetTop + FONT_SIZE * 0.2
      );
    });
  }

  const onReset = () => {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
  };

  function onSubmit() {
    dataList.value = getDataList();
    onReset();
    if (formData.value.direction === "vertical") {
      drawYAxis();
    } else {
      drawXAxis();
    }
  }

  const myBoard = ref();
  const myCanvas: HTMLCanvasElement = document.createElement("canvas");
  myCanvas.id = "my-canvas";
  let ctx: CanvasRenderingContext2D | null = null;

  onMounted(() => {
    if (myBoard.value) {
      // Fill Window Width and Height
      // A4	21.0 x 29.7厘米(8.27 x 11.69英寸)
      myCanvas.width = myBoard.value.clientWidth || 210;
      myCanvas.height = myBoard.value.clientHeight || 297;

      myBoard.value.appendChild(myCanvas);
      ctx = myCanvas.getContext("2d");
      ctx.font = `${FONT_SIZE}px serif`;
      ctx.lineWidth = 1;
      ctx.strokeStyle = PEN_COLOR;
      if (ctx) {
        initCanvasDraw(myCanvas, ctx);
      }
    }
    onSubmit();
  });
</script>
<style lang="scss" scoped>
  .main-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: calc(100vh - 100px);
  }
  .my-board {
    width: 100%;
    height: 594px;
    cursor: crosshair;
  }
</style>
