<template>
  <div class="main-content">
    <div ref="containerRef" class="cubic-bezier">
      <canvas id="main-canvas" ref="canvasRef" :class="canvasClass" width="300" height="300"></canvas>
      <div class="animation-box">
        <el-form :model="formData" label-width="auto" style="max-width: 600px">
          <el-form-item label="animation-name">
            <el-input v-model="formData['animation-name']" disabled />
          </el-form-item>
          <el-form-item label="animation-duration">
            <el-input v-model="formData['animation-duration']" />
          </el-form-item>
          <el-form-item label="animation-timing-function">
            <span>{{ easingFunction }}</span>
          </el-form-item>
          <el-form-item label="animation-delay">
            <el-input v-model="formData['animation-delay']" />
          </el-form-item>
          <el-form-item label="animation-iteration-count">
            <el-input v-model="formData['animation-iteration-count']" />
          </el-form-item>
          <el-form-item label="animation-direction">
            <el-select v-model="formData['animation-direction']" placeholder="please select">
              <el-option label="normal" value="normal" />
              <el-option label="reverse" value="reverse" />
              <el-option label="alternate" value="alternate" />
              <el-option label="alternate-reverse" value="alternate-reverse" />
            </el-select>
          </el-form-item>
          <el-form-item label="animation-play-state">
            <el-select v-model="formData['animation-play-state']" placeholder="please select">
              <el-option label="running" value="running" />
              <el-option label="paused" value="paused" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="animation-ball" :style="animationStyle"></div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

const CONTROL_POINT_RADIUS = 5;

const containerRef = ref();
const canvasRef = ref();
const canvasClass = ref('');
let ctx: CanvasRenderingContext2D | null = null;

function rgbToHex(r: number, g: number, b: number) {
  if (r > 255 || g > 255 || b > 255) throw new Error('Invalid color component');
  // eslint-disable-next-line no-bitwise
  const hex = ((r << 16) | (g << 8) | b).toString(16);

  return `#${`000000${hex}`.slice(-6)}`;
}

const getMousePosition = (evt: MouseEvent): { x: number; y: number } => {
  const position = {
    x: evt.clientX - canvasRef.value.getBoundingClientRect().left,
    y: evt.clientY - canvasRef.value.getBoundingClientRect().top,
  };
  return position;
};

const controlPoint1 = ref({ x: 150, y: 50 });
const controlPoint1Color = '#009ad6';
const controlPoint2 = ref({ x: 150, y: 200 });
const controlPoint2Color = '#f20c00';
const startPoint = ref({ x: 20, y: 280 });
const startPointColor = '#0aa344';
const endPoint = ref({ x: 280, y: 20 });
const endPointColor = '#e9bb1d';

const easingFunction = computed(() => {
  if (!canvasRef.value) return '';
  function normalize(val: number, max: number) {
    return Number((val / max).toFixed(2));
  }
  return `cubic-bezier(${normalize(controlPoint1.value.x, canvasRef.value.width)}, ${normalize(
    canvasRef.value.height - controlPoint1.value.y,
    canvasRef.value.height,
  )}, ${normalize(controlPoint2.value.x, canvasRef.value.width)}, ${normalize(
    canvasRef.value.height - controlPoint2.value.y,
    canvasRef.value.height,
  )})`;
});

function drawBaseLine(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(0, canvasRef.value.height);
  ctx.lineTo(canvasRef.value.width, 0);
  ctx.strokeStyle = '#c2c2c2';
  ctx.stroke();
  ctx.closePath();
}

function drawCubicBezier(
  ctx: CanvasRenderingContext2D,
  start: { x: number; y: number },
  cp1: { x: number; y: number },
  cp2: { x: number; y: number },
  end: { x: number; y: number },
) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
  ctx.strokeStyle = '#801dae';
  ctx.stroke();
  ctx.closePath();
  drawControlPoint(ctx, start, cp1, cp2, end);
}

function drawControlPoint(
  ctx: CanvasRenderingContext2D,
  start: { x: number; y: number },
  cp1: { x: number; y: number },
  cp2: { x: number; y: number },
  end: { x: number; y: number },
) {
  // 绘制起点
  ctx.beginPath();
  ctx.arc(start.x, start.y, CONTROL_POINT_RADIUS, 0, Math.PI * 2, true);
  ctx.fillStyle = startPointColor;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(cp1.x, cp1.y);
  ctx.strokeStyle = startPointColor;
  ctx.stroke();

  // 绘制控制点
  ctx.beginPath();
  ctx.arc(cp1.x, cp1.y, CONTROL_POINT_RADIUS, 0, Math.PI * 2, true);
  ctx.fillStyle = controlPoint1Color;
  ctx.fill();

  // 绘制终点
  ctx.beginPath();
  ctx.arc(end.x, end.y, CONTROL_POINT_RADIUS, 0, Math.PI * 2, true);
  ctx.fillStyle = endPointColor;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(cp2.x, cp2.y);
  ctx.strokeStyle = endPointColor;
  ctx.stroke();

  // 绘制控制点
  ctx.beginPath();
  ctx.arc(cp2.x, cp2.y, CONTROL_POINT_RADIUS, 0, Math.PI * 2, true);
  ctx.fillStyle = controlPoint2Color;
  ctx.fill();

  ctx.closePath();
}

const mouseDrag = {
  isDown: false,
  pickColor: '',
  down: { x: 0, y: 0 },
  current: { x: 0, y: 0 },
  up: { x: 0, y: 0 },
};

function mousedown(evt: MouseEvent) {
  mouseDrag.isDown = true;
  mouseDrag.down = getMousePosition(evt);
  const pickColor = ctx.getImageData(mouseDrag.down.x, mouseDrag.down.y, 1, 1).data;
  mouseDrag.pickColor = rgbToHex(pickColor[0], pickColor[1], pickColor[2]);
  if (['#0aa344', '#009ad6', '#f20c00', '#e9bb1d'].includes(mouseDrag.pickColor)) {
    canvasClass.value = 'drag-point';
  }
}

function mousemove(evt: MouseEvent) {
  if (mouseDrag.isDown) {
    mouseDrag.current = getMousePosition(evt);

    if (['#0aa344', '#009ad6', '#f20c00', '#e9bb1d'].includes(mouseDrag.pickColor)) {
      canvasClass.value = 'dragging-point';
      if (mouseDrag.pickColor === startPointColor) {
        startPoint.value = mouseDrag.current;
      } else if (mouseDrag.pickColor === controlPoint1Color) {
        controlPoint1.value = mouseDrag.current;
      } else if (mouseDrag.pickColor === controlPoint2Color) {
        controlPoint2.value = mouseDrag.current;
      } else if (mouseDrag.pickColor === endPointColor) {
        endPoint.value = mouseDrag.current;
      }
      initCanvas();
    }
  }
}

function mouseup(evt: MouseEvent) {
  mouseDrag.isDown = false;
  mouseDrag.up = getMousePosition(evt);
  canvasClass.value = '';
}

const initCanvas = () => {
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  drawBaseLine(ctx);
  drawCubicBezier(ctx, startPoint.value, controlPoint1.value, controlPoint2.value, endPoint.value);
  canvasRef.value.addEventListener('mousedown', mousedown, false);
  canvasRef.value.addEventListener('mouseup', mouseup, false);
  canvasRef.value.addEventListener('mousemove', mousemove, false);
  canvasRef.value.addEventListener('mouseleave', mouseup, false);
};

const formData = ref({
  'animation-name': 'growUp',
  'animation-duration': '2s',
  'animation-timing-function': 'easy',
  'animation-delay': '0s',
  'animation-iteration-count': 'infinite',
  'animation-direction': 'alternate-reverse',
  'animation-play-state': 'running',
});

const animationStyle = computed(() => {
  return `animation-duration: ${formData.value['animation-duration']};
  animation-timing-function: ${easingFunction.value};
  animation-delay: ${formData.value['animation-delay']};
  animation-iteration-count: ${formData.value['animation-iteration-count']};
  animation-direction: ${formData.value['animation-direction']};
  animation-play-state: ${formData.value['animation-play-state']};`;
});

onMounted(() => {
  ctx = canvasRef.value.getContext('2d');
  initCanvas();
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
.cubic-bezier {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin: 20px;
  color: #353535;

  overflow: hidden;
  user-select: none;
}
#main-canvas {
  width: 300px;
  height: 300px;
  border: 1px solid #ccc;
}
.animation-box {
  width: 500px;
  margin-left: 20px;
  padding: 10px 20px;
  border-left: 1px solid #ddd;
}
.animation-ball {
  width: 0;
  height: 16px;
  background-color: red;
  animation: growUp 2s ease infinite alternate-reverse;
  @keyframes growUp {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }
}

.drag-point {
  cursor: grab;
}
.dragging-point {
  cursor: grabbing;
}
</style>
