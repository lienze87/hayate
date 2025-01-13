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
            clearable
          />
        </el-form-item>
        <el-form-item label="最大值">
          <el-input-number
            v-model="formData.max"
            :step="1"
            :min="formData.min"
            :max="250"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="间隔">
          <el-input-number v-model="formData.step" :step="1" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="方向">
          <el-select v-model="formData.direction" placeholder="请选择" style="width: 150px">
            <el-option label="水平线" :value="'horizon'"></el-option>
            <el-option label="垂直线" :value="'vertical'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onDrawAxis">确定</el-button>
          <el-button type="danger" @click="onResetCanvas">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="canvas-action">
        <el-radio-group v-model="currentTool" size="large" @change="handleToolChange">
          <el-radio-button label="选择" value="mouse" />
          <el-dropdown @command="handleShapeChange">
            <el-radio-button :label="currentShapeName" value="shape" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="line">直线</el-dropdown-item>
                <el-dropdown-item command="circle">圆</el-dropdown-item>
                <el-dropdown-item command="rect">矩形</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-radio-button label="画笔" value="draw" />
          <el-radio-button label="橡皮" value="eraser" />
        </el-radio-group>
        <div class="action-bar">
          <el-button type="primary" @click="handleDownload">下载</el-button>
          <div class="action-item-input">
            <span>画笔大小</span>
            <el-input-number v-model="currentLineWidth"></el-input-number>
          </div>
        </div>
        <el-button v-if="currentTool === 'shape'" type="danger" @click="handleShapeUndo"> 撤销 </el-button>
      </div>
      <div ref="myBoard" class="my-board" :style="`cursor: ${cursorType}`"></div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Board',
};
</script>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

const FONT_SIZE = 24;
const BACKGROUND_COLOR = '#274c43';
const PEN_COLOR = '#ffffff';

const myBoard = ref();
const myCanvas: HTMLCanvasElement = document.createElement('canvas');
myCanvas.id = 'my-canvas';
let ctx: CanvasRenderingContext2D | null = null;

const formData = ref({
  min: 0,
  max: 6,
  step: 1,
  direction: 'vertical',
});
const dataList = ref<number[]>([]);
const percentList = computed(() => {
  const range = formData.value.max - formData.value.min;
  const result = dataList.value.map((ele: number) => {
    return parseFloat((ele / range).toFixed(2));
  });
  return result;
});

function getDataList() {
  const result = [];
  for (let i = formData.value.min; i <= formData.value.max; i += formData.value.step) {
    result.push(i);
  }
  return result;
}

function drawXAxis() {
  const { width } = myCanvas;
  const { height } = myCanvas;
  const paddingLeft = 50;
  const paddingTop = Math.floor(height * 0.9);

  if (!ctx) return;
  ctx.fillStyle = PEN_COLOR;
  ctx.beginPath();

  // x轴
  ctx.moveTo(paddingLeft, paddingTop);
  ctx.lineTo(width - paddingLeft, paddingTop);
  ctx.stroke();

  // 绘制刻度
  percentList.value.forEach((ele: number, index: number) => {
    const offsetLeft = paddingLeft + Math.floor((width - 2 * paddingLeft) * ele);

    if (!ctx) return;
    ctx.moveTo(offsetLeft, paddingTop - 30);
    ctx.lineTo(offsetLeft, paddingTop);
    ctx.stroke();
    ctx.fillText(dataList.value[index].toString(), offsetLeft - FONT_SIZE * 0.2, paddingTop + FONT_SIZE);
  });
}

function drawYAxis() {
  const { width } = myCanvas;
  const { height } = myCanvas;
  const paddingLeft = Math.floor(width * 0.1);
  const paddingTop = 50;

  if (!ctx) return;
  ctx.fillStyle = PEN_COLOR;
  ctx.beginPath();

  // x轴
  ctx.moveTo(paddingLeft, paddingTop);
  ctx.lineTo(paddingLeft, height - paddingTop);
  ctx.stroke();

  // 绘制刻度
  percentList.value.forEach((ele: number, index: number) => {
    const offsetTop = paddingTop + Math.floor((height - 2 * paddingTop) * ele);
    if (!ctx) return;
    ctx.moveTo(paddingLeft, offsetTop);
    ctx.lineTo(paddingLeft + 30, offsetTop);
    ctx.stroke();
    ctx.fillText(dataList.value[index].toString(), paddingLeft - FONT_SIZE, offsetTop + FONT_SIZE * 0.2);
  });
}

function onDrawAxis() {
  dataList.value = getDataList();
  currentTool.value = 'mouse';
  handleToolChange('mouse');

  if (formData.value.direction === 'vertical') {
    drawYAxis();
  } else {
    drawXAxis();
  }
}

const onResetCanvas = () => {
  shapeDataList.value = [];
  if (!ctx) return;
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
};

const currentTool = ref('mouse');
const cursorType = ref('default');

const lineWidth = ref(1);
const currentLineWidth = computed({
  get() {
    return lineWidth.value;
  },
  set(val) {
    lineWidth.value = val;
    if (!ctx) return;
    ctx.lineWidth = val;
  },
});

const handleToolChange = (tool: string) => {
  switch (tool) {
    case 'mouse':
      cursorType.value = 'default';
      currentLineWidth.value = 1;
      if (ctx) {
        ctx.strokeStyle = PEN_COLOR;
      }
      break;
    case 'shape':
      currentShape.value = 'line';
      currentLineWidth.value = 1;
      if (ctx) {
        ctx.strokeStyle = PEN_COLOR;
      }
      onResetCanvas();
      break;
    case 'draw':
      cursorType.value = 'crosshair';
      currentLineWidth.value = 1;
      if (ctx) {
        ctx.strokeStyle = PEN_COLOR;
      }
      break;
    case 'eraser':
      // 通过绘制背景色线条实现橡皮功能
      currentLineWidth.value = 20;
      if (ctx) {
        ctx.strokeStyle = BACKGROUND_COLOR;
      }
      cursorType.value = 'cell';
      break;
    default:
      cursorType.value = 'auto';
      break;
  }
};

const currentShape = ref('line');
const shapeObj: Record<string, string> = {
  line: '直线',
  circle: '圆',
  rect: '方形',
};
const shapeDataList = ref<any[]>([]);
const currentShapeName = computed(() => {
  return currentShape.value ? `形状-${shapeObj[currentShape.value]}` : '形状';
});
const handleShapeChange = (shape: string) => {
  currentShape.value = shape;
};
const handleShapeUndo = () => {
  // 形状数据数组的最后一个元素永远是key为end的元素,此元素用于绘制时使用
  if (shapeDataList.value.length > 0) {
    shapeDataList.value.splice(shapeDataList.value.length - 2, 2);
    const lastShape = shapeDataList.value.slice(-1)[0];
    if (lastShape) {
      shapeDataList.value.push({
        ...lastShape,
        key: 'end',
      });
      currentShape.value = lastShape.type;
    }
  }
};

const handleDownload = () => {
  let url = myCanvas.toDataURL('image/png');
  const filename = `canvas-${Date.now()}.png`;
  const link = document.createElement('a');
  url = url.replace(/^data:image\/[^;]/, 'data:application/octet-stream');

  link.download = filename;
  link.href = url;
  link.click();
};

function drawLine(
  ctx: CanvasRenderingContext2D,
  data: {
    type: string;
    begin: { x: number; y: number };
    end: { x: number; y: number };
    strokeStyle?: string;
  },
) {
  const { begin, end, strokeStyle = 'PEN_COLOR' } = data;
  ctx.beginPath();
  ctx.moveTo(begin.x, begin.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
}

function drawCircle(
  ctx: CanvasRenderingContext2D,
  data: {
    type: string;
    begin: { x: number; y: number };
    radius: number;
    strokeStyle?: string;
  },
) {
  const { begin, radius, strokeStyle = 'PEN_COLOR' } = data;
  ctx.beginPath();
  ctx.arc(begin.x, begin.y, radius, 0, Math.PI * 2, true);
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
}

const getMousePosition = (evt: MouseEvent): { x: number; y: number } => {
  const scrollTop = window.scrollY;
  const position = {
    x: evt.pageX - myCanvas.getBoundingClientRect().left,
    y: evt.pageY - myCanvas.getBoundingClientRect().top - scrollTop,
  };
  return position;
};

// Mouse Event Handlers

const mouseDraw = {
  isDown: false,
  down: { x: 0, y: 0 },
  current: { x: 0, y: 0 },
  up: { x: 0, y: 0 },
  mousedown(evt: MouseEvent) {
    this.isDown = true;
    this.down = getMousePosition(evt);

    if (['draw', 'eraser'].includes(currentTool.value)) {
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(this.down.x, this.down.y);
    }
  },
  mousemove(evt: MouseEvent) {
    if (this.isDown) {
      this.current = getMousePosition(evt);

      if (['draw', 'eraser'].includes(currentTool.value)) {
        if (!ctx) return;
        ctx.lineTo(this.current.x, this.current.y);
        ctx.stroke();
      }
      if (currentTool.value === 'shape') {
        if (!ctx) return;
        ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

        if (currentShape.value === 'line') {
          const line = {
            key: 'move',
            type: 'line',
            begin: this.down,
            end: this.current,
          };
          shapeDataList.value.pop();
          shapeDataList.value.push(line);
        } else if (currentShape.value === 'circle') {
          const radius = Math.sqrt((this.current.x - this.down.x) ** 2 + (this.current.y - this.down.y) ** 2);
          const circle = {
            key: 'move',
            type: 'circle',
            begin: this.down,
            radius,
          };
          shapeDataList.value.pop();
          shapeDataList.value.push(circle);
        } else if (currentShape.value === 'rect') {
          const rect = {
            key: 'move',
            type: 'rect',
            x: this.down.x,
            y: this.down.y,
            width: this.current.x - this.down.x,
            height: this.current.y - this.down.y,
          };
          shapeDataList.value.pop();
          shapeDataList.value.push(rect);
        }
      }
    }
  },
  mouseup(evt: MouseEvent) {
    this.isDown = false;
    this.up = getMousePosition(evt);
    if (currentTool.value === 'shape') {
      if (currentShape.value === 'line') {
        const line = {
          key: 'end',
          type: 'line',
          begin: this.down,
          end: this.up,
        };

        shapeDataList.value.push(line);
      } else if (currentShape.value === 'circle') {
        const radius = Math.sqrt((this.current.x - this.down.x) ** 2 + (this.current.y - this.down.y) ** 2);
        const circle = {
          key: 'end',
          type: 'circle',
          begin: this.down,
          radius,
        };

        shapeDataList.value.push(circle);
      } else if (currentShape.value === 'rect') {
        const rect = {
          key: 'end',
          type: 'rect',
          x: this.down.x,
          y: this.down.y,
          width: this.current.x - this.down.x,
          height: this.current.y - this.down.y,
        };

        shapeDataList.value.push(rect);
      }
    }
    if (!ctx) return;
    ctx.closePath();
  },
  mouseleave(evt: MouseEvent) {
    this.isDown = false;
    if (!ctx) return;
    ctx.closePath();
  },
};

const getTouchPosition = (evt: TouchEvent): { x: number; y: number } => {
  const scrollTop = window.scrollY;
  const position = {
    x: evt.touches[0].pageX - myCanvas.getBoundingClientRect().left,
    y: evt.touches[0].pageY - myCanvas.getBoundingClientRect().top - scrollTop,
  };
  return position;
};

// Touch Events Handlers
const touchDraw = {
  started: false,
  down: { x: 0, y: 0 },
  current: { x: 0, y: 0 },
  up: { x: 0, y: 0 },
  start(evt: TouchEvent) {
    this.started = true;
    this.down = getTouchPosition(evt);
    if (['draw', 'eraser'].includes(currentTool.value)) {
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(this.down.x, this.down.y);
    }
  },
  move(evt: TouchEvent) {
    evt.preventDefault();

    if (this.started) {
      this.current = getTouchPosition(evt);
      if (['draw', 'eraser'].includes(currentTool.value)) {
        if (!ctx) return;
        ctx.lineTo(this.current.x, this.current.y);
        ctx.stroke();
      }
      if (currentTool.value === 'shape') {
        if (!ctx) return;
        ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

        if (currentShape.value === 'line') {
          const line = {
            key: 'move',
            type: 'line',
            begin: this.down,
            end: this.current,
          };

          shapeDataList.value.push(line);
        } else if (currentShape.value === 'circle') {
          const radius = Math.sqrt((this.current.x - this.down.x) ** 2 + (this.current.y - this.down.y) ** 2);
          const circle = {
            key: 'move',
            type: 'circle',
            begin: this.down,
            radius,
          };

          shapeDataList.value.push(circle);
        } else if (currentShape.value === 'rect') {
          const rect = {
            key: 'move',
            type: 'rect',
            x: this.down.x,
            y: this.down.y,
            width: this.current.x - this.down.x,
            height: this.current.y - this.down.y,
          };

          shapeDataList.value.push(rect);
        }
      }
    }
  },
  end(evt: TouchEvent) {
    this.started = false;
    this.up = getTouchPosition(evt);
    if (currentTool.value === 'shape') {
      if (currentShape.value === 'line') {
        const line = {
          key: 'end',
          type: 'line',
          begin: this.down,
          end: this.up,
        };

        shapeDataList.value.push(line);
      } else if (currentShape.value === 'circle') {
        const radius = Math.sqrt((this.current.x - this.down.x) ** 2 + (this.current.y - this.down.y) ** 2);
        const circle = {
          key: 'end',
          type: 'circle',
          begin: this.down,
          radius,
        };

        shapeDataList.value.push(circle);
      } else if (currentShape.value === 'rect') {
        const rect = {
          key: 'end',
          type: 'rect',
          x: this.down.x,
          y: this.down.y,
          width: this.current.x - this.down.x,
          height: this.current.y - this.down.y,
        };

        shapeDataList.value.push(rect);
      }
    }
    if (!ctx) return;
    ctx.closePath();
  },
};

const drawController = new AbortController();

function initCanvasDraw(myCanvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  // Set Background Color
  ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

  // Mouse Events
  myCanvas.addEventListener('mousedown', mouseDraw.mousedown, {
    capture: false,
    signal: drawController.signal,
  });
  myCanvas.addEventListener('mouseup', mouseDraw.mouseup, {
    capture: false,
    signal: drawController.signal,
  });
  myCanvas.addEventListener('mousemove', mouseDraw.mousemove, {
    capture: false,
    signal: drawController.signal,
  });
  myCanvas.addEventListener('mouseleave', mouseDraw.mouseleave, {
    capture: false,
    signal: drawController.signal,
  });

  // Touch Events
  myCanvas.addEventListener('touchstart', touchDraw.start, {
    capture: false,
    signal: drawController.signal,
  });
  myCanvas.addEventListener('touchend', touchDraw.end, {
    capture: false,
    signal: drawController.signal,
  });
  myCanvas.addEventListener('touchmove', touchDraw.move, {
    capture: false,
    signal: drawController.signal,
  });

  // Disable Page Move
  document.body.addEventListener(
    'touchmove',
    (evt: TouchEvent) => {
      evt.stopPropagation();
    },
    {
      capture: false,
      signal: drawController.signal,
    },
  );
}

window.requestAnimationFrame(function loop() {
  if (currentTool.value === 'shape') {
    if (!ctx) return;
    ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

    shapeDataList.value.forEach((data) => {
      if (data.key === 'end') {
        return;
      }
      if (data.type === 'line') {
        if (!ctx) return;
        drawLine(ctx, data);
      } else if (data.type === 'circle') {
        if (!ctx) return;
        drawCircle(ctx, data);
      } else if (data.type === 'rect') {
        if (!ctx) return;
        ctx.strokeRect(data.x, data.y, data.width, data.height);
      }
    });
  }

  window.requestAnimationFrame(loop);
});

onMounted(() => {
  if (myBoard.value) {
    // Fill Window Width and Height
    // A4	21.0 x 29.7厘米(8.27 x 11.69英寸)
    myCanvas.width = myBoard.value.clientWidth || 210;
    myCanvas.height = myBoard.value.clientHeight || 297;

    myBoard.value.appendChild(myCanvas);
    ctx = myCanvas.getContext('2d');
    if (!ctx) return;
    ctx.font = `${FONT_SIZE}px serif`;
    ctx.lineWidth = lineWidth.value;
    ctx.strokeStyle = PEN_COLOR;
    if (ctx) {
      initCanvasDraw(myCanvas, ctx);
    }
  }
  onResetCanvas();
});

onUnmounted(() => {
  drawController.abort();
});
</script>
<style lang="scss" scoped>
.main-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: calc(100vh - 100px);
}

.canvas-action {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 10px 0;

  .action-bar {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 0 10px;
  }
}

.my-board {
  width: 100%;
  height: 594px;
}
</style>
