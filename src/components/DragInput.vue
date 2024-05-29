<template>
  <div ref="containerRef" class="mouse-input">
    <div v-show="activeInput" class="input-box">
      <input
        ref="inputRef"
        class="input-inner"
        :value="currentValue"
        @change="handleValueChange"
        @blur="handleTypeChange(false)"
      />
    </div>
    <div v-show="!activeInput" ref="sliderRef" class="slider-box">
      <div class="slider-runway">
        <div class="slider-bar" :style="`width: ${sliderPercent}%;`"></div>
        <div class="slider-value">{{ currentValue }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from 'vue';
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 1,
  },
  step: {
    type: Number,
    default: 0.01,
  },
});

const emit = defineEmits(['update:modelValue']);

const containerRef = ref();
const inputRef = ref();
const sliderRef = ref();

const activeInput = ref(false);
const currentValue = computed({
  get() {
    return props.modelValue;
  },
  set(val: number) {
    emit('update:modelValue', val);
  },
});
const sliderPercent = computed(() => {
  const percent = Number((currentValue.value / (props.max - props.min)).toFixed(2)) * 100;
  return Math.min(Math.max(percent, 0), 100);
});

const handleValueChange = (e: Event) => {
  currentValue.value = Number((e.target as HTMLInputElement).value);
};

const handleTypeChange = (val: boolean) => {
  activeInput.value = val;
  if (val) {
    nextTick(() => {
      inputRef.value.focus();
    });
  }
};

const getMousePosition = (evt: MouseEvent): { x: number; y: number } => {
  let position = {
    x: evt.clientX,
    y: evt.clientY,
  };
  return position;
};

const mouseDrag = {
  isDown: false,
  down: { x: 0, y: 0 },
  current: { x: 0, y: 0 },
  up: { x: 0, y: 0 },
};

function mousedown(evt: MouseEvent) {
  mouseDrag.isDown = true;
  mouseDrag.down = getMousePosition(evt);
  const left = sliderRef.value.getBoundingClientRect().left;

  handleSliderChange(mouseDrag.down.x - left);

  document.body.classList.add('mouse-drag');
  document.body.addEventListener('mousemove', mousemove);
  document.body.addEventListener('mouseup', mouseup);
}

function mousemove(evt: MouseEvent) {
  if (mouseDrag.isDown) {
    mouseDrag.current = getMousePosition(evt);
    const left = sliderRef.value.getBoundingClientRect().left;

    handleSliderChange(mouseDrag.current.x - left);
  }
}

function mouseup(evt: MouseEvent) {
  mouseDrag.isDown = false;
  mouseDrag.up = getMousePosition(evt);

  if (mouseDrag.up.x === mouseDrag.down.x && mouseDrag.up.y === mouseDrag.down.y) {
    handleTypeChange(true);
  }
  document.body.classList.remove('mouse-drag');
  document.body.removeEventListener('mousemove', mousemove);
  document.body.removeEventListener('mouseup', mouseup);
}

const handleSliderChange = (deltaX: number) => {
  if (deltaX === 0) return;
  const width = sliderRef.value.getBoundingClientRect().width;
  const move = Number((deltaX / width).toFixed(2));

  currentValue.value = Math.min(Math.max(move, props.min), props.max);
};

onMounted(() => {
  containerRef.value.addEventListener('mousedown', mousedown);
});
</script>
<style lang="scss">
.mouse-drag {
  user-select: none;
  cursor: ew-resize;
}
</style>
<style lang="scss" scoped>
.mouse-input {
  position: relative;
  display: inline-flex;
  width: 120px;
  height: 24px;
  color: #fff;
  border-radius: 8px;

  overflow: hidden;
  .input-box {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    width: calc(100% - 20px);
    height: 100%;
    background-color: #373737;
    .input-inner {
      width: 100%;
      height: 100%;
      font-size: 16px;
      color: #fff;
      border: none;
      outline: none;
      border-radius: 8px;
      background-color: #373737;
    }
  }

  .slider-box {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    cursor: ew-resize;
    .slider-runway {
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #999b9e;
    }
    .slider-bar {
      position: absolute;
      left: 0;
      height: 32px;
      background-color: #409eff;
    }
    .slider-value {
      pointer-events: none;
      user-select: none;
      font-size: 16px;
      color: #fff;
      z-index: 1;
    }
  }
}

.mouse-drag {
  .slider-box {
    .slider-runway {
      background-color: #2c2c2c;
    }
  }
}
</style>
