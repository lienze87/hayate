<template>
  <div class="video-player">
    <video
      ref="videoRef"
      class="video-content"
      crossorigin="anonymous"
      width="640"
      controls
      preload="auto"
      v-bind="$attrs"
    >
      <slot />
    </video>
    <div class="video-control">
      <div class="circle-button" @click="handlePlayVideo">
        <VideoPlay v-if="showPlayIcon" />
        <VideoPause v-else />
      </div>
      <el-button @click="handleReplayVideo"> 重播 </el-button>
      <div class="volume-container">
        <el-button @click="handleShowVideoVolume"> 音量 </el-button>
        <div v-show="isShowVideoVolume" class="volume-slider">
          <el-slider
            v-model="videoInfo.volume"
            :min="0"
            :max="100"
            :step="1"
            vertical
            height="100px"
            @change="handleVideoVolumeChange"
          />
        </div>
      </div>
      <el-button @click="handleMuteVideo"> 静音 </el-button>
      <el-button @click="handleFullscreenVideo"> 全屏 </el-button>
      <div class="action-bar">
        <el-color-picker v-model="penColor" @change="handlePenColorChange" />
        <el-button type="primary" @click="handleStartDraw"> 绘制 </el-button>
        <el-button @click="handleResetDraw"> 重置 </el-button>
        <el-button type="danger" @click="handleQuitDraw"> 关闭绘制 </el-button>
      </div>
    </div>
    <div class="progress-slider-container">
      <div class="progress-slider">
        <el-slider
          v-model="videoInfo.currentTime"
          :min="0"
          :max="videoInfo.maxSecond"
          :step="1"
          :format-tooltip="formatVideoTooltip"
          @change="handleVideoProgressChange"
        />
      </div>
      <div class="timeline">
        {{ formatVideoTooltip(videoInfo.currentTime) }}/{{ formatVideoTooltip(videoInfo.duration) }}
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
    </div>
    <canvas ref="videoCanvasRef" class="video-canvas" width="640" height="360"> </canvas>
  </div>
</template>

<script lang="ts">
export default {
  name: 'VideoPlayer',
};
</script>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { VideoPlay, VideoPause } from '@element-plus/icons-vue';
import { initCanvasDraw } from '@/utils/canvasDraw';
import { translateTime } from '@/utils';

const FONT_SIZE = 24;
const penColor = ref('#000000');

const showPlayIcon = ref(true);
const videoRef = ref<HTMLVideoElement>();
const videoCanvasRef = ref<HTMLCanvasElement>();
const videoInfo = ref({
  currentFrame: 0,
  frameStep: 3,
  frameRate: 24,
  currentTime: 0,
  duration: 0,
  maxSecond: 0,
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

const handleMuteVideo = () => {
  videoRef.value.muted = !videoRef.value.muted;
};

const isShowVideoVolume = ref(false);
const handleShowVideoVolume = () => {
  isShowVideoVolume.value = !isShowVideoVolume.value;
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
    // getFrameList();
    videoCanvas.width = video.clientWidth;
    videoCanvas.height = video.clientHeight;
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

const frameList = ref([]);
async function getFrameList() {
  const video = videoRef.value;
  frameList.value = [];

  // @ts-ignore
  if (window.MediaStreamTrackProcessor) {
    await video.play();
    // @ts-ignore
    const track = await video.captureStream().getVideoTracks()[0];
    // @ts-ignore
    const processor = new MediaStreamTrackProcessor(track);
    const reader = processor.readable.getReader();
    readChunk();

    function readChunk() {
      reader.read().then(async ({ done, value }: { done: boolean; value: any }) => {
        if (value) {
          const bitmap = await createImageBitmap(value);
          frameList.value.push(bitmap);

          value.close();
        }
        if (!done) {
          readChunk();
        }
      });
    }
  } else {
    console.error("your browser doesn't support this API yet");
  }
}

const handlePenColorChange = () => {
  const videoCanvas = videoCanvasRef.value;
  const ctx = videoCanvas.getContext('2d');
  ctx.strokeStyle = penColor.value;
};

const handleStartDraw = () => {
  videoRef.value.pause();
  videoCanvasRef.value.setAttribute('style', 'pointer-events: auto;cursor: crosshair;');
};

const handleResetDraw = () => {
  const videoCanvas = videoCanvasRef.value;
  const ctx = videoCanvas.getContext('2d');
  ctx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
};

const handleQuitDraw = () => {
  handleResetDraw();
  videoCanvasRef.value.setAttribute('style', 'pointer-events: none;');
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
  .video-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 60px;
    background-color: #f2f2f2;
    z-index: 1;
    .circle-button {
      padding: 4px 0;
      width: 32px;
      border-radius: 50%;
    }
    .action-bar {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .volume-container {
      position: relative;
    }
    .volume-slider {
      position: absolute;
      left: 0;
      bottom: 40px;
      padding: 10px;
      height: 120px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      background-color: #ccc;
    }
  }
  .progress-slider-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 20px;

    .progress-slider {
      flex-grow: 1;
      flex-shrink: 0;
      margin-right: 20px;
    }
    .timeline {
      flex-basis: 140px;
      text-align: right;
    }
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
