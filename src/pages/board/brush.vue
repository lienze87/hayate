<template>
  <div class="page-container">
    <div class="action_bar">
      <el-button type="primary" @click="handleEraser">eraser</el-button>
    </div>
    <canvas ref="myCanvas" width="800" height="600" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import Ease from '@/utils/ease';

const myCanvas = ref<HTMLCanvasElement | null>(null);
let context: CanvasRenderingContext2D | null = null;

const color = '#3d34a5';
const strokeWidth = 80;
let latestPoint: number[] = [];
let drawing = false;

// Basic lerp funtion.
function lerp(a1: number, a2: number, t: number) {
  return a1 * (1 - t) + a2 * t;
}
let autoIndex = 0;
const pointList: { x: number; y: number }[] = [];
const autoEraser = (index: number) => {
  let phase = -0.1;

  const begin = pointList[index];
  const end = pointList[index + 1];
  const timer = setInterval(() => {
    if (phase < 1) {
      phase += 0.1;

      const newX = lerp(begin.x, end.x, phase);
      const newY = lerp(begin.y, end.y, Ease.circInOut(phase));

      continueStroke([newX, newY]);
    } else {
      clearInterval(timer);
    }
  }, 50);
};

const handleEraser = () => {
  if (!context) return;
  for (let i = 0; i < 11; i++) {
    pointList.push({
      x: i * 80,
      y: i % 2 === 0 ? 0 : 600,
    });
  }
  console.log(pointList);
  const timer = setInterval(() => {
    if (autoIndex < pointList.length - 1) {
      autoEraser(autoIndex);
      autoIndex++;
    } else {
      clearInterval(timer);
      context.clearRect(0, 0, 800, 600);
    }
  }, 500);
};

const continueStroke = (newPoint: number[]) => {
  context.beginPath();
  context.moveTo(latestPoint[0], latestPoint[1]);
  context.strokeStyle = color;
  context.lineWidth = strokeWidth;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.lineTo(newPoint[0], newPoint[1]);
  context.stroke();

  latestPoint = newPoint;
};

const BUTTON = 0b01;
const mouseButtonIsDown = (buttons: number) => (BUTTON & buttons) === BUTTON;

// Event helpers

const startStroke = (point: number[]) => {
  drawing = true;
  latestPoint = point;
};

const mouseMove = (evt: MouseEvent) => {
  if (!drawing) {
    return;
  }
  continueStroke([evt.offsetX, evt.offsetY]);
};

const mouseDown = (evt: MouseEvent) => {
  if (drawing) {
    return;
  }
  evt.preventDefault();
  myCanvas.value.addEventListener('mousemove', mouseMove, false);
  startStroke([evt.offsetX, evt.offsetY]);
};

const mouseEnter = (evt: MouseEvent) => {
  if (!mouseButtonIsDown(evt.buttons) || drawing) {
    return;
  }
  mouseDown(evt);
};

const endStroke = (evt: MouseEvent) => {
  if (!drawing) {
    return;
  }
  drawing = false;
  myCanvas.value.removeEventListener('mousemove', mouseMove, false);
};

onMounted(() => {
  if (myCanvas.value) {
    context = myCanvas.value.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 800, 600);
    context.globalCompositeOperation = 'destination-out';

    myCanvas.value.addEventListener('mousedown', mouseDown, false);
    myCanvas.value.addEventListener('mouseup', endStroke, false);
    myCanvas.value.addEventListener('mouseout', endStroke, false);
    myCanvas.value.addEventListener('mouseenter', mouseEnter, false);
  }
});
</script>

<style lang="scss" scoped>
.page-container {
  background: center/cover no-repeat url('@/assets/header-bg.jpg');
  canvas {
    border: 1px solid #000;
  }
}
</style>
