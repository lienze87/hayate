<template>
  <div class="video-player">
    <div class="video-content" :style="`width: ${canvasInfo.width}px;height:${canvasInfo.height}px;`">
      <video ref="videoRef" class="my-video" crossorigin="anonymous" width="640" preload="auto" v-bind="$attrs">
        <slot />
      </video>
      <div class="progress-slider-container">
        <el-slider
          v-model="videoInfo.currentTime"
          :min="0"
          :max="videoInfo.maxSecond"
          :step="1"
          :format-tooltip="formatVideoTooltip"
          @change="handleVideoProgressChange"
        />
      </div>
    </div>
    <div class="video-control">
      <div class="control-bar">
        <div class="icon-button" @click="handlePlayVideo">
          <VideoPlay v-if="showPlayIcon" />
          <VideoPause v-else />
        </div>
        <!-- <el-button @click="handleReplayVideo"> 重播 </el-button>
      <el-button @click="handleFullscreenVideo"> 全屏 </el-button> -->
        <div class="volume-container">
          <div class="icon-button" @click="handleShowVideoVolume">
            <Mute v-if="videoInfo.muted" />
            <Microphone v-else />
          </div>
          <div class="volume-slider">
            <el-slider
              v-model="videoInfo.volume"
              :disabled="videoInfo.muted"
              :min="0"
              :max="100"
              :step="1"
              height="100px"
              @change="handleVideoVolumeChange"
            />
          </div>
        </div>
        <div class="timeline">
          {{ formatVideoTooltip(videoInfo.currentTime) }}/{{ formatVideoTooltip(videoInfo.duration) }}
        </div>
      </div>
      <div class="action-bar">
        <el-color-picker
          v-model="penColor"
          @active-change="handlePenColorActiveChange"
          @change="handlePenColorChange"
        />
        <el-button v-if="isDrawing" type="danger" @click="handleQuitDraw"> 关闭绘制 </el-button>
        <el-button v-else type="primary" @click="handleStartDraw"> 开始绘制 </el-button>
        <el-button @click="handleResetDraw"> 重置 </el-button>
        <el-button @click="handleCreateFrame"> 保存 </el-button>
      </div>
    </div>
    <div class="frame-player-container">
      <span>帧率:</span>
      <el-input-number v-model="videoInfo.frameRate" :min="1" :max="240" :step="1"></el-input-number>
      <el-divider direction="vertical" />
      <span>步长:</span>
      <el-input-number v-model="videoInfo.frameStep" :min="1" :max="24" :step="1"></el-input-number>
      <el-divider direction="vertical" />
      <span>当前帧数:</span>
      <el-input-number
        v-model="videoInfo.currentFrame"
        :min="0"
        :max="requestFrameList.length"
        :step="videoInfo.frameStep"
        @change="handleFrameChange"
      ></el-input-number>
      <span>/{{ requestFrameList.length }}</span>
      <el-button type="primary" @click="handlePlayFrame">
        {{ autoPlayFrame ? '暂停' : '播放' }}
      </el-button>
      <div v-if="frameImage">
        <el-image :src="frameImage" class="frame-image" fit="contain" />
      </div>
    </div>
    <canvas ref="videoCanvasRef" class="video-canvas" :width="canvasInfo.width" :height="canvasInfo.height"> </canvas>
  </div>
</template>

<script lang="ts">
export default {
  name: 'VideoPlayer',
};
</script>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue';
import { VideoPlay, VideoPause, Microphone, Mute } from '@element-plus/icons-vue';
import { initCanvasDraw } from '@/utils/canvasDraw';
import { translateTime } from '@/utils';

const FONT_SIZE = 24;
const penColor = ref('#ce2121');

const showPlayIcon = ref(true);
const videoRef = ref<HTMLVideoElement>();
const videoCanvasRef = ref<HTMLCanvasElement>();
const canvasInfo = ref({
  width: 640,
  height: 360,
});
const videoInfo = ref({
  currentFrame: 0,
  frameStep: 1,
  frameRate: 24,
  currentTime: 0,
  duration: 0,
  maxSecond: 0,
  muted: false,
  volume: 100,
  progress: 0,
});
const requestFrameList = ref([]);
const requestFrameObj: Record<string, ImageBitmap> = {};

const handlePlayVideo = () => {
  if (videoRef.value.paused || videoRef.value.ended) {
    videoRef.value.play();
  } else {
    videoRef.value.pause();
  }
};
const handleReplayVideo = () => {
  videoRef.value.pause();
  videoRef.value.currentTime = 0;
  videoInfo.value.progress = 0;
};

const handleShowVideoVolume = () => {
  videoInfo.value.muted = !videoInfo.value.muted;
  videoRef.value.muted = !videoRef.value.muted;
};

// volume范围0-1
const handleVideoVolumeChange = (val: number) => {
  videoRef.value.volume = val / 100;
};

const handleVideoProgressChange = (val: number) => {
  // const targetVal = (val / videoInfo.value.maxSecond) * videoInfo.value.duration;

  videoRef.value.currentTime = val;
};

const formatVideoTooltip = (val: number) => {
  return translateTime(Math.floor(val));
};

const handleFullscreenVideo = () => {
  if (document.fullscreenElement !== null) {
    // The document is in fullscreen mode
    document.exitFullscreen();
    videoRef.value.setAttribute('data-fullscreen', 'true');
  } else {
    // The document is not in fullscreen mode
    videoRef.value.requestFullscreen();
    videoRef.value.setAttribute('data-fullscreen', 'false');
  }
};

const initVideoCanvas = () => {
  const videoCanvas = videoCanvasRef.value;
  const video = videoRef.value;

  const ctx = videoCanvas.getContext('2d');

  ctx.font = `${FONT_SIZE}px serif`;
  ctx.lineWidth = 1;

  if (ctx) {
    initCanvasDraw(videoCanvas, ctx);
    // 将canvas背景置为透明
    ctx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
  }
  videoInfo.value.currentFrame = 0;
  requestFrameList.value = [];
  const updateCanvas = async (now: number, metadata: any) => {
    // mediaTime与video.currentTime相同，presentedFrames 表示已播放帧数
    // console.log(metadata.mediaTime, metadata.presentedFrames);
    const bitmap = await createImageBitmap(video);

    requestFrameObj[video.currentTime] = bitmap;
    if (!requestFrameList.value.includes(video.currentTime)) {
      requestFrameList.value.push(video.currentTime);
    }

    // Re-register the callback to run on the next frame
    video.requestVideoFrameCallback(updateCanvas);
  };

  video.requestVideoFrameCallback(updateCanvas);

  video.addEventListener('canplay', () => {
    // video.play();

    canvasInfo.value.width = video.clientWidth;
    canvasInfo.value.height = video.clientHeight;
  });
  video.addEventListener('play', () => {
    showPlayIcon.value = false;
    handleQuitDraw();
  });
  video.addEventListener('pause', () => {
    showPlayIcon.value = true;
  });
  video.addEventListener('timeupdate', () => {
    videoInfo.value.currentTime = video.currentTime;
  });
  video.addEventListener('ended', () => {
    showPlayIcon.value = true;
  });
  video.addEventListener('durationchange', () => {
    videoInfo.value.duration = video.duration;
    videoInfo.value.maxSecond = Math.round(video.duration);
  });
};

const isDrawing = ref(false);
const frameImage = ref('');
const handlePenColorActiveChange = (val: string) => {
  penColor.value = val;
  handlePenColorChange();
};

const handlePenColorChange = () => {
  const videoCanvas = videoCanvasRef.value;
  const ctx = videoCanvas.getContext('2d');
  ctx.strokeStyle = penColor.value;
};

const handleStartDraw = () => {
  isDrawing.value = true;
  videoRef.value.pause();
  handlePenColorChange();

  videoCanvasRef.value.setAttribute('style', 'pointer-events: auto;cursor: crosshair;');
};

const handleResetDraw = () => {
  const videoCanvas = videoCanvasRef.value;
  const ctx = videoCanvas.getContext('2d');
  ctx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
};

const handleQuitDraw = () => {
  isDrawing.value = false;
  handleResetDraw();
  videoCanvasRef.value.setAttribute('style', 'pointer-events: none;');
};

// 使用新canvas合成图像
const handleCreateFrame = () => {
  const videoCanvas = videoCanvasRef.value;
  let canvas = document.createElement('canvas');
  canvas.height = canvasInfo.value.height;
  canvas.width = canvasInfo.value.width;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoRef.value, 0, 0, canvasInfo.value.width, canvasInfo.value.height);
  ctx.drawImage(videoCanvas, 0, 0, canvasInfo.value.width, canvasInfo.value.height);
  frameImage.value = canvas.toDataURL();
};

const autoPlayFrame = ref(false);
let playFrameTimer = 0;

const handlePlayFrame = () => {
  autoPlayFrame.value = !autoPlayFrame.value;
  if (playFrameTimer) {
    clearInterval(playFrameTimer);
    playFrameTimer = 0;
  }
  if (autoPlayFrame.value) {
    handleResetDraw();
    handleStartDraw();
    // @ts-ignore
    playFrameTimer = setInterval(() => {
      if (videoInfo.value.currentFrame < requestFrameList.value.length) {
        videoInfo.value.currentFrame += videoInfo.value.frameStep;

        handleFrameChange();
      } else {
        autoPlayFrame.value = false;
        clearInterval(playFrameTimer);
      }
    }, 1000 / videoInfo.value.frameRate);
  } else {
    handleQuitDraw();
    videoRef.value.currentTime = videoInfo.value.currentTime;
  }
};

const handleFrameChange = () => {
  const videoCanvas = videoCanvasRef.value;

  const ctx = videoCanvas.getContext('2d');
  if (requestFrameList.value[videoInfo.value.currentFrame]) {
    ctx.drawImage(
      requestFrameObj[requestFrameList.value[videoInfo.value.currentFrame]],
      0,
      0,
      videoCanvas.width,
      videoCanvas.height,
    );
    videoInfo.value.currentTime = requestFrameList.value[videoInfo.value.currentFrame];
  }
};

onMounted(() => {
  initVideoCanvas();
});
</script>

<style lang="scss" scoped>
.video-player {
  position: relative;
  .video-content {
    position: relative;
    overflow: hidden;
  }
  .video-content:hover {
    .progress-slider-container {
      display: block;
    }
  }
  .progress-slider-container {
    display: none;
    position: absolute;
    bottom: 0;
    padding: 0 20px;
    width: calc(100% - 40px);
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .video-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 48px;
    background-color: #f2f2f2;

    .control-bar {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .volume-container {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      .volume-slider {
        width: 0;
        padding: 0 10px;
        opacity: 0;
        transition: width 0.5s ease-out;
      }
    }
    .volume-container:hover {
      .volume-slider {
        width: 120px;
        opacity: 1;
      }
    }

    .timeline {
      margin: 0 10px;
      line-height: 32px;
    }
    .action-bar {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 100%;
    }
  }
  .icon-button {
    display: inline-flex;
    margin: 0 10px;
    width: 32px;
    font-size: 32px;
    cursor: pointer;
  }
  .icon-button:hover {
    color: #409eff;
  }

  .video-canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
    pointer-events: none;
  }
}
</style>
