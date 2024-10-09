<template>
  <div class="main-content">
    <div class="config-box">
      <div class="config-form">
        <div class="form-item">
          <div class="form-item-label">宽度</div>
          <div class="form-item-content">
            <el-input-number v-model="width" :min="20" @change="initSlider" />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-label">高度</div>
          <div class="form-item-content">
            <el-input-number v-model="height" :min="20" />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-label">颜色类型</div>
          <div class="form-item-content">
            <el-radio-group v-model="colorFormat" @change="handleColorFormatChange">
              <el-radio-button v-for="item in colorFormatEnum" :key="item" :label="item" :value="item" />
            </el-radio-group>
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-label">起始颜色</div>
          <div class="form-item-content">
            <el-input v-model="beginColor" disabled />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-label">中间颜色</div>
          <div class="form-item-content">
            <el-checkbox v-model="showMiddle"> 启用中间颜色 </el-checkbox>
            <el-input v-if="showMiddle" v-model="middleColor" disabled />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-label">结束颜色</div>
          <div class="form-item-content">
            <el-input v-model="endColor" disabled />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-label">色环颜色</div>
          <div class="form-item-content">
            <div
              class="picker-color"
              :style="`background-color: hsl(${currentHue},${currentSaturation}%,${currentLightness}%)`"
            />
            <span>{{ `hsl(${currentHue},${currentSaturation}%,${currentLightness}%)` }}</span>
          </div>
        </div>
      </div>
      <div class="config-color">
        <div
          ref="panelRef"
          class="color-panel color-hsl-panel"
          :style="`--panel-width: ${wheelWidth / 2}px;background-color: hsl(${currentHue},100%,50%)`"
        >
          <div class="color-panel__white" />
          <div class="color-panel__black" />
          <div class="color-panel__cursor" :style="`top:${cursorTop}px;left:${cursorLeft}px;`">
            <div class="color-panel__point" />
          </div>
        </div>
        <div
          ref="wheelRef"
          class="color-wheel"
          :style="`--wheel-width: ${wheelWidth}px;--wheel-cursor-width: ${wheelCursorWidth}px;`"
        >
          <div
            class="color-wheel__cursor"
            :style="`top: ${rotateTop}px;left:${rotateLeft}px;transform:rotate(${rotateAngle}deg);`"
          >
            <div class="color-panel__point" />
          </div>
        </div>

        <!-- <div class="color-slider"></div> -->
      </div>
    </div>

    <div :key="colorFormat" class="gradient" :style="computedStyle">
      <div class="gradient-color gradient-begin">
        <el-color-picker
          v-model="beginColor"
          :color-format="colorFormat"
          @active-change="(color: string) => handlePickColor(color, 'begin')"
        />
      </div>
      <div v-if="showMiddle" class="gradient-color gradient-middle">
        <el-color-picker
          v-model="middleColor"
          :color-format="colorFormat"
          @active-change="(color: string) => handlePickColor(color, 'middle')"
        />
      </div>
      <div class="gradient-color gradient-end">
        <el-color-picker
          v-model="endColor"
          :color-format="colorFormat"
          @active-change="(color: string) => handlePickColor(color, 'end')"
        />
      </div>
    </div>
    <div ref="sliderRef" class="gradient" :style="computedStyle">
      <div
        class="cover-gray"
        :style="`${computedStyle}clip-path: polygon(0 0, ${sliderOffsetLeft}px 0, ${sliderOffsetLeft}px 100%, 0 100%);`"
      />
      <div class="slider" :style="`left: ${sliderOffsetLeft}px;`" title="拖动滑块切换显示效果" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

defineOptions({
  name: 'Gradient',
});

const colorFormatEnum = ['hsl', 'hex', 'rgb'];

const width = ref(640);
const height = ref(60);

const colorFormat = ref('hsl');
function handleColorFormatChange(val: string) {}

const beginColor = ref('hsl(0, 100%, 50%)');
const showMiddle = ref(true);
const middleColor = ref('hsl(120, 100%, 50%)');
const endColor = ref('hsl(240, 100%, 50%)');

const computedStyle = computed(
  () =>
    `width: ${Math.max(100, width.value)}px;height: ${Math.max(
      20,
      height.value,
    )}px;background: linear-gradient(90deg, ${beginColor.value},${
      showMiddle.value ? `${middleColor.value}, ` : ''
    } ${endColor.value});`,
);

function handlePickColor(color: string, type: string) {
  if (type === 'begin') {
    beginColor.value = color;
  } else if (type === 'end') {
    endColor.value = color;
  } else if (type === 'middle') {
    middleColor.value = color;
  }
}

const rectOffsetLeft = ref(0);
const rectWidth = ref(0);
const rectOffsetTop = ref(0);
const rectHeight = ref(0);
const dragTargetCenter = computed(() => {
  const centerX = Math.ceil(rectOffsetLeft.value + rectWidth.value / 2);
  const centerY = Math.ceil(rectOffsetTop.value + rectHeight.value / 2);
  return [centerX, centerY];
});

function initDragTarget(ele: HTMLElement) {
  const box = ele.getBoundingClientRect();
  rectOffsetLeft.value = box.left || 0;
  rectWidth.value = box.width || 0;
  rectOffsetTop.value = box.top || 0;
  rectHeight.value = box.height || 0;
}

const panelRef = ref<HTMLElement>();
const currentHue = ref(90);
const currentSaturation = ref(100);
const currentLightness = ref(50);

const cursorLeft = ref(180);
const cursorTop = ref(90);
function handlePanelMouseMove(e: MouseEvent) {
  const offsetX = Math.min(Math.max(0, e.pageX - rectOffsetLeft.value), rectWidth.value);
  const offsetY = Math.min(Math.max(0, e.pageY - rectOffsetTop.value), rectHeight.value);

  cursorLeft.value = offsetX;
  cursorTop.value = offsetY;

  currentSaturation.value = Math.ceil((offsetX / rectWidth.value) * 100);
  currentLightness.value = 100 - Math.ceil((offsetY / rectHeight.value) * 100);
}

const rgbToHex = (r: number, g: number, b: number) => ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0;
  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ];
};
const hslToRgb = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
};

const wheelRef = ref<HTMLElement>();
const wheelWidth = 360;
const wheelCursorWidth = 30;
const rotateTop = ref(wheelWidth / 2);
const rotateLeft = ref(wheelWidth - wheelCursorWidth);
const rotateAngle = ref(0);

function handleWheelMouseMove(e: MouseEvent) {
  const vector = [e.pageX - dragTargetCenter.value[0], e.pageY - dragTargetCenter.value[1]];

  const distance = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
  const normalVector = [vector[0] / distance, vector[1] / distance];
  // 角度起始位置，表示指向X正轴方向的单位向量
  const standVector = [1, 0];

  const angle = Math.acos(
    (normalVector[0] * standVector[0] + normalVector[1] * standVector[1]) /
      (Math.sqrt(normalVector[0] ** 2 + normalVector[1] ** 2) * Math.sqrt(standVector[0] ** 2 + standVector[1] ** 2)),
  );
  let degree = Math.ceil((angle / Math.PI) * 180);

  if (normalVector[1] > 0) {
    degree %= 360;
  } else {
    degree = 360 - (degree % 360);
  }

  rotateAngle.value = degree;
  // 鼠标方向的标准向量乘以色环半径得到浮标向量
  rotateLeft.value = Math.ceil(normalVector[0] * wheelWidth * 0.41) + wheelWidth / 2;
  rotateTop.value = Math.ceil(normalVector[1] * wheelWidth * 0.41) + wheelWidth / 2;

  currentHue.value = (degree + 90) % 360;
}

const sliderRef = ref<HTMLElement>();
const sliderOffsetLeft = ref(480);

function initSlider() {
  if (sliderRef.value) {
    initDragTarget(sliderRef.value);
  }
}

function handleSliderMouseMove(e: MouseEvent) {
  const offsetX = Math.min(Math.max(0, e.pageX - rectOffsetLeft.value), rectWidth.value);
  sliderOffsetLeft.value = offsetX;
}

onMounted(() => {
  sliderRef.value?.addEventListener('mousedown', () => {
    if (sliderRef.value) {
      initDragTarget(sliderRef.value);
      sliderRef.value.addEventListener('mousemove', handleSliderMouseMove);
    }
  });
  sliderRef.value?.addEventListener('mouseup', () => {
    sliderRef.value?.removeEventListener('mousemove', handleSliderMouseMove);
  });
  sliderRef.value?.addEventListener('mouseleave', () => {
    sliderRef.value?.removeEventListener('mousemove', handleSliderMouseMove);
  });

  panelRef.value?.addEventListener('mousedown', () => {
    if (panelRef.value) {
      initDragTarget(panelRef.value);
      panelRef.value.addEventListener('mousemove', handlePanelMouseMove);
    }
  });
  panelRef.value?.addEventListener('mouseup', () => {
    panelRef.value?.removeEventListener('mousemove', handlePanelMouseMove);
  });
  panelRef.value?.addEventListener('mouseleave', () => {
    panelRef.value?.removeEventListener('mousemove', handlePanelMouseMove);
  });

  wheelRef.value?.addEventListener('mousedown', () => {
    if (wheelRef.value) {
      initDragTarget(wheelRef.value);
      wheelRef.value.addEventListener('mousemove', handleWheelMouseMove);
    }
  });
  wheelRef.value?.addEventListener('mouseup', () => {
    wheelRef.value?.removeEventListener('mousemove', handleWheelMouseMove);
  });
  wheelRef.value?.addEventListener('mouseleave', () => {
    wheelRef.value?.removeEventListener('mousemove', handleWheelMouseMove);
  });
});
</script>
<style lang="scss" scoped>
.main-content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.config-box {
  display: flex;
  justify-content: flex-start;
  margin: 20px;
  padding: 20px;
  width: calc(100% - 40px);
  box-shadow: 0 0 8px 4px #e6e6e6;
  // 在绘制时，背景图像以 z 方向堆叠的方式进行。先指定的图像会在之后指定的图像上面绘制。
  background:
    linear-gradient(to bottom, #4671ff 10px, transparent 10px 100%),
    linear-gradient(
        to right,
        #1e2c4f 10px,
        #b2b6c9 10px 20px,
        transparent 20px calc(100% - 40px),
        #b2b6c9 calc(100% - 40px) calc(100% - 30px),
        #1e2c4f calc(100% - 30px) 100%
      )
      0 0 / 100% 100%,
    linear-gradient(to top, #4671ff 10px, transparent 10px 100%);
}
.config-form {
  flex: 1;
}

.form-item {
  display: flex;
  justify-content: flex-start;
  margin: 6px 8px;
  padding: 10px 16px;

  .form-item-label {
    flex-basis: 100px;
  }

  .form-item-content {
    flex-grow: 1;
    flex-shrink: 0;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 20px;
    .el-input,
    .el-select {
      width: 180px;
    }
  }
}

.config-color {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

.color-panel {
  position: absolute;
  width: var(--panel-width);
  height: var(--panel-width);
  left: var(--panel-width);
  top: var(--panel-width);
  transform: translate(-50%, -50%);
  user-select: none;
  z-index: 1;

  .color-panel__white,
  .color-panel__black {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .color-panel__white {
    background: linear-gradient(to right, #fff, #fff0);
  }
  .color-panel__black {
    background: linear-gradient(to top, #000, #0000);
  }
  .color-panel__cursor {
    position: absolute;
  }
}

.color-hsl-panel {
  .color-panel__black {
    background: linear-gradient(to bottom, white 0, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0) 50%, black 100%);
  }
}

.color-wheel {
  position: relative;
  width: var(--wheel-width);
  height: var(--wheel-width);
  border-radius: 50%;
  mask: radial-gradient(transparent 50%, #000 50%);
  background: conic-gradient(red, #ff0 17%, #0f0 33%, #0ff, #00f 67%, #f0f 83%, red);
  // background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red);
  .color-wheel__cursor {
    position: absolute;
    transform-origin: left;

    .color-wheel__line {
      width: var(--wheel-cursor-width);
      height: 4px;
      background-color: #000;
    }
    .color-wheel__line::before {
      content: '';
      position: relative;
      top: 3px;
      left: 30px;
      width: 0;
      height: 0;
      border: 4px solid transparent;
      border-top-color: red;
    }
  }
}

.color-panel__point {
  width: 4px;
  height: 4px;
  box-shadow:
    0 0 0 1.5px #fff,
    inset 0 0 1px 1px #0000004d,
    0 0 1px 2px #0006;
  border-radius: 50%;
  transform: translate(-2px, -2px);
}

.color-slider {
  position: relative;
  margin-left: 10px;
  width: 12px;
  height: 100%;
  background: linear-gradient(to bottom, red, #ff0 17%, #0f0 33%, #0ff, #00f 67%, #f0f 83%, red);
  user-select: none;
}

.gradient {
  position: relative;
  margin: 40px 20px;

  .gradient-color {
    position: absolute;
    top: -40px;
    width: 32px;
    height: 32px;
  }

  .gradient-begin {
    left: 0;
  }

  .gradient-middle {
    left: calc(50% - 16px);
  }

  .gradient-end {
    right: 0;
  }
}

.cover-gray {
  filter: grayscale(1);
  z-index: 1;
}
.slider {
  position: absolute;
  top: -10%;
  width: 4px;
  height: 120%;
  background-color: #000000;
  z-index: 2;
  user-select: none;
}
.slider::before {
  content: '';
  position: relative;
  top: -2px;
  left: -2px;
  width: 0;
  height: 0;
  border: 4px solid transparent;
  border-top-color: red;
}

.picker-color {
  width: 180px;
  height: 32px;
}
</style>
