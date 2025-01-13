<template>
  <div class="main-content">
    <div>
      <video ref="videoRef" width="640" height="360" crossorigin="anonymous" controls preload="auto">
        <source :src="previewVideoUrl" type="video/mp4" />
      </video>
    </div>
    <div>
      <canvas ref="videoCanvasRef" width="640" height="360"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'VideoToCanvas',
};
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const videoRef = ref();
const videoCanvasRef = ref();
const previewVideoUrl = ref('/api/videoPart/1');

const initVideoCanvas = () => {
  const videoCanvas = videoCanvasRef.value;
  const video = videoRef.value;

  const ctx = videoCanvas.getContext('2d');

  if (ctx) {
    // 将canvas背景置为透明
    ctx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
  }

  video.addEventListener('canplay', () => {
    getFrameList();
    videoCanvas.width = video.clientWidth;
    videoCanvas.height = video.clientHeight;
  });
};

const frameList = ref([]);
async function getFrameList() {
  const videoCanvas = videoCanvasRef.value;
  const video = videoRef.value;

  const ctx = videoCanvas.getContext('2d');
  frameList.value = [];

  let stream;
  // @ts-ignore
  if (video.captureStream) {
    // @ts-ignore
    stream = await video.captureStream();
    // @ts-ignore
  } else if (video.mozCaptureStream) {
    // @ts-ignore
    stream = await video.mozCaptureStream();
  } else {
    console.error('Stream capture is not supported');
    stream = null;
    return;
  }

  const track = stream.getVideoTracks()[0];
  // @ts-ignore
  if (!window.MediaStreamTrackProcessor) {
    console.error("your browser doesn't support this API yet");
    return;
  }

  // @ts-ignore
  const processor = new MediaStreamTrackProcessor(track);
  // @ts-ignore
  const generator = new MediaStreamTrackGenerator({ kind: 'video' });
  const transform = (frame: VideoFrame, controller: any) => {
    ctx.drawImage(frame, 0, 0, 640, 360);
    frame.close();
    if (frame.visibleRect) {
      console.log(frame.timestamp);
    }

    controller.enqueue(new VideoFrame(videoCanvas, { timestamp: frame.timestamp, alpha: 'discard' }));
  };

  const transformer = new TransformStream({ transform });

  processor.readable
    .pipeThrough(transformer)
    .pipeTo(generator.writable)
    .catch((e: Error) => {
      processor.readable.cancel(e);
      generator.writable.abort(e);
    });
}

onMounted(() => {
  initVideoCanvas();
});
</script>

<style lang="scss" scoped>
.main-content {
  width: 100vw;
  height: 100vh;
}
</style>
