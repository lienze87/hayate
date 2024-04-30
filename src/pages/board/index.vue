<template>
  <div class="main-content">
    <div class="form-container">
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
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-form>
      <div class="my-board" ref="myBoard"></div>
    </div>
    <div>
      <WhiteBoard />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from "vue";
  import WhiteBoard from "@/components/WhiteBoard.vue";

  const FONT_SIZE = 24;

  const formData = ref({
    min: 0,
    max: 12,
    step: 2,
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

  function drawAxis() {
    const width = myCanvas.width;
    const height = myCanvas.height;
    const paddingLeft = 50;
    const paddingTop = Math.floor(height / 2);

    ctx.fillStyle = "#000";
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
        offsetLeft,
        paddingTop + 30
      );
    });
  }

  const onReset = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
  };

  function onSubmit() {
    dataList.value = getDataList();
    onReset();
    drawAxis();
  }

  const myBoard = ref();
  const myCanvas: HTMLCanvasElement = document.createElement("canvas");
  myCanvas.id = "my-canvas";
  let ctx: CanvasRenderingContext2D | null = null;

  onMounted(() => {
    if (myBoard.value) {
      // Fill Window Width and Height
      myCanvas.width = myBoard.value.clientWidth || 500;
      myCanvas.height = myBoard.value.clientHeight || 200;

      myBoard.value.appendChild(myCanvas);
      ctx = myCanvas.getContext("2d");
      ctx.font = `${FONT_SIZE}px serif`;
    }
  });
</script>
<style scoped>
  .main-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: calc(100vh - 100px);
  }
  .my-board {
    border: 1px solid green;
  }
</style>
