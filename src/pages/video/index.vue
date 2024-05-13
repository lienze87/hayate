<template>
  <div class="main-content">
    <div class="content-header">
      <el-button type="primary" plain @click="handleAddData">新增</el-button>
      <el-upload
        v-model:file-list="uploadFileList"
        class="upload-demo"
        action="http://localhost:3005/upload"
        :show-file-list="false"
        :on-success="handleUploadSuccess">
        <el-button type="primary">上传文件</el-button>
      </el-upload>
    </div>
    <el-table :data="dataList">
      <el-table-column type="index" width="50" />
      <el-table-column prop="sourceName" label="源文件">
        <template #default="scope">
          <div v-if="editId === scope.row.uuid">
            <el-input v-model="scope.row.sourceName"></el-input>
          </div>
          <span v-else>{{ scope.row.sourceName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称">
        <template #default="scope">
          <div v-if="editId === scope.row.uuid">
            <el-input v-model="scope.row.name"></el-input>
          </div>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="start" label="起始帧">
        <template #default="scope">
          <div v-if="editId === scope.row.uuid">
            <el-input v-model="scope.row.start"></el-input>
          </div>
          <span v-else>{{ scope.row.start }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="end" label="结束帧">
        <template #default="scope">
          <div v-if="editId === scope.row.uuid">
            <el-input v-model="scope.row.end"></el-input>
          </div>
          <span v-else>{{ scope.row.end }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="frames" label="帧数">
        <template #default="scope">
          <div v-if="editId === scope.row.uuid">
            <el-input v-model="scope.row.frames"></el-input>
          </div>
          <span v-else>{{ scope.row.frames }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="describe" label="描述">
        <template #default="scope">
          <div v-if="editId === scope.row.uuid">
            <el-input v-model="scope.row.describe"></el-input>
          </div>
          <span v-else>{{ scope.row.describe }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="scope">
          <el-button
            v-if="editId === scope.row.uuid"
            type="primary"
            @click="handleConfirmData(scope.row)">
            确定
          </el-button>
          <div v-else>
            <el-button type="success" @click="handleEditData(scope.row)">
              修改
            </el-button>
            <el-button type="primary" @click="handlePreviewData(scope.row)">
              详情
            </el-button>
            <el-button type="warning" @click="handleExtractData(scope.row)">
              截取
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="videoDialogVisible"
      title="视频预览"
      width="672"
      destroy-on-close>
      <div class="dialog-container">
        <div class="dialog-video-container">
          <video
            ref="videoRef"
            class="dialog-video"
            crossorigin="anonymous"
            width="640"
            controls>
            <source :src="previewVideoUrl" type="video/mp4" />
          </video>
          <div class="dialog-video-control">
            <div
              v-if="showPlayIcon"
              class="circle-button"
              @click="handlePlayVideo">
              <VideoPlay />
            </div>
            <div v-else class="circle-button" @click="handlePauseVideo">
              <VideoPause />
            </div>
            <div class="action-bar">
              <el-button type="primary" @click="handleStartDraw">
                绘制
              </el-button>
              <el-button @click="handleResetDraw"> 重置 </el-button>
              <el-button type="danger" @click="handleQuitDraw">
                关闭绘制
              </el-button>
            </div>
            <div class="timeline">
              {{ videoInfo.currentTime }}/{{ videoInfo.duration }}
            </div>
          </div>
          <canvas
            ref="videoCanvasRef"
            class="dialog-video-canvas"
            width="640"
            height="360">
          </canvas>
        </div>
      </div>
      <el-collapse>
        <el-collapse-item title="视频帧" name="video">
          <div class="dialog-canvas">
            <span>当前帧数:</span>
            <el-input-number
              v-model="videoInfo.currentFrame"
              :min="0"
              :max="requestFrameList.length"
              :step="1"
              @change="handleFrameChange"></el-input-number>
            <span>/{{ requestFrameList.length }}</span>
          </div>
          <el-divider />
          <canvas ref="canvasRef" width="640" height="360"></canvas>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
    <el-dialog
      v-model="imageDialogVisible"
      title="图像预览"
      width="600"
      destroy-on-close>
      <div class="dialog-container">
        <div class="dialog-form">
          <el-form :inline="true" :model="imageData" class="form-inline">
            <el-form-item label="起始帧">
              <el-input-number
                v-model="imageData.begin"
                :step="1"></el-input-number>
            </el-form-item>
            <el-form-item label="结束帧">
              <el-input-number
                v-model="imageData.end"
                :step="1"></el-input-number>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="imageData.describe"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSubmitImage">
                提交
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-divider />
        <div class="dialog-images">
          <el-image
            :src="imageList[0]"
            :preview-src-list="imageList"
            style="margin-right: 10px; width: 100px"
            fit="contain" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted, nextTick } from "vue";
  import { ElMessage } from "element-plus";
  import { VideoPlay, VideoPause } from "@element-plus/icons-vue";
  import {
    getDataList,
    getDataDetail,
    addData,
    updateData,
    addDataImage,
    updateDataImage,
    getDataImageDetail,
  } from "@/api/video";
  import { v4 as uuidV4 } from "uuid";
  import { initCanvasDraw } from "@/utils/canvasDraw";

  const FONT_SIZE = 24;
  const BACKGROUND_COLOR = "#274c43";
  const PEN_COLOR = "#ffffff";

  const uploadFileList = ref([]);
  const handleUploadSuccess = () => {
    ElMessage.success("上传成功");
  };

  const dataList = ref([]);
  const editId = ref("");

  // 00:01:12 -> 1*60+12
  function translateTime(param: string | number) {
    if (typeof param === "string") {
      const reg = /^[0-9]{2}\:[0-9]{2}\:[0-9]{2}$/;
      if (!reg.test(param)) {
        throw new Error("格式错误");
      }
      let hours = parseInt(param.split(":")[0]) * 60 * 60;
      let minutes = parseInt(param.split(":")[1]) * 60;
      let seconds = parseInt(param.split(":")[2]);

      return hours + minutes + seconds;
    }

    if (typeof param === "number") {
      let hours = Math.floor(param / (60 * 60));
      let minutes = Math.floor((param % 3600) / 60);
      let seconds = Math.floor(param % 60);

      return `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`;
    }
  }

  const handleAddData = () => {
    dataList.value.push({
      uuid: "0",
      sourceName: "",
      name: "",
      start: "00:00:00",
      end: "00:00:00",
      frames: 0,
      describe: "",
    });
    nextTick(() => {
      editId.value = "0";
    });
  };

  const handleEditData = (row: any) => {
    editId.value = row.uuid;
  };

  const videoDialogVisible = ref(false);
  const previewVideoUrl = ref("");
  const videoRef = ref<HTMLVideoElement>();
  const videoCanvasRef = ref<HTMLCanvasElement>();
  const videoInfo = ref({
    currentFrame: 0,
    currentTime: 0,
    duration: 0,
  });

  const showPlayIcon = ref(true);

  const handlePlayVideo = () => {
    videoRef.value.play();
  };

  const handlePauseVideo = () => {
    videoRef.value.pause();
  };

  const frameList = ref([]);
  const requestFrameList = ref([]);

  const handlePreviewData = (row: any) => {
    previewVideoUrl.value = `http://localhost:3005/video/${row.id}`;
    videoDialogVisible.value = true;
    nextTick(() => {
      // getFrameList();
      initVideoCanvas();
    });
  };

  const initVideoCanvas = () => {
    const videoCanvas = videoCanvasRef.value;
    const video = videoRef.value;

    const ctx = videoCanvas.getContext("2d");
    ctx.font = `${FONT_SIZE}px serif`;
    ctx.lineWidth = 1;
    ctx.strokeStyle = PEN_COLOR;
    if (ctx) {
      initCanvasDraw(videoCanvas, ctx);
      // 将canvas背景置为透明
      ctx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
    }

    requestFrameList.value = [];
    const updateCanvas = async () => {
      const bitmap = await createImageBitmap(video);

      requestFrameList.value.push({
        timeSamp: video.currentTime,
        data: bitmap,
      });
      // Re-register the callback to run on the next frame
      video.requestVideoFrameCallback(updateCanvas);
    };
    video.requestVideoFrameCallback(updateCanvas);

    video.addEventListener("canplay", () => {
      video.play();
      // getFrameList();
    });
    video.addEventListener("play", () => {
      showPlayIcon.value = false;
    });
    video.addEventListener("pause", () => {
      showPlayIcon.value = true;
    });
    video.addEventListener("timeupdate", () => {
      videoInfo.value.currentTime = video.currentTime;
    });
    video.addEventListener("ended", () => {
      showPlayIcon.value = true;
      console.log(requestFrameList.value.length, frameList.value.length);
    });
    video.addEventListener("durationchange", () => {
      videoInfo.value.duration = video.duration;
    });
  };

  const handleStartDraw = () => {
    videoRef.value.pause();
    videoCanvasRef.value.setAttribute(
      "style",
      "pointer-events: auto;cursor: crosshair;"
    );
  };

  const handleResetDraw = () => {
    const videoCanvas = videoCanvasRef.value;
    const ctx = videoCanvas.getContext("2d");
    ctx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
  };

  const handleQuitDraw = () => {
    handleResetDraw();
    videoCanvasRef.value.setAttribute("style", "pointer-events: none;");
  };

  const canvasRef = ref();
  const handleFrameChange = () => {
    const canvas = canvasRef.value;
    const ctx = canvas.getContext("2d");
    if (requestFrameList.value[videoInfo.value.currentFrame]) {
      ctx.drawImage(
        requestFrameList.value[videoInfo.value.currentFrame].data,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
  };

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
        reader
          .read()
          .then(async ({ done, value }: { done: boolean; value: any }) => {
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

  const imageDialogVisible = ref(false);
  const imageList = ref([]);
  const imageData = ref({
    uuid: "0",
    frameId: 0,
    begin: 0,
    end: 1,
    describe: "",
  });

  const handleExtractData = async (row: any) => {
    try {
      const result = await getDataDetail(row.id);
      imageData.value.frameId = row.id;
      const images = result.images.length > 0 ? result.images[0] : null;

      if (images) {
        imageData.value = images;
        let pathResult = await getDataImageDetail(images.id);
        imageList.value = pathResult.map(
          (ele: string) =>
            `http://localhost:3005/${ele.replace("./public/", "")}`
        );
      }

      imageDialogVisible.value = true;
    } catch (e) {
      ElMessage.error(e.message);
    }
  };
  const handleSubmitImage = async () => {
    try {
      if (imageData.value.uuid === "0") {
        await addDataImage({ ...imageData.value, uuid: undefined });
        ElMessage.success("新增成功");
      } else {
        await updateDataImage(imageData.value);
        ElMessage.success("更新成功");
      }

      imageDialogVisible.value = false;
    } catch (e) {
      ElMessage.error(e.message);
    }
  };

  const handleConfirmData = async (row: any) => {
    try {
      const data = {
        ...row,
        startIndex: row.start ? translateTime(row.start) : 0,
        endIndex: row.end ? translateTime(row.end) : 0,
      };
      if (row.uuid === "0") {
        await addData({ ...data, uuid: undefined });
        ElMessage.success("新增成功");
      } else {
        await updateData(data);
        ElMessage.success("更新成功");
      }
      // const targetIndex = dataList.value.findIndex(
      //   (ele: any) => ele.uuid === editId.value
      // );
      // dataList.value.splice(targetIndex, 1, data);
      queryData();
      editId.value = "";
    } catch (e) {
      ElMessage.error(e.message);
    }
  };

  async function queryData() {
    try {
      const res = await getDataList();
      dataList.value = res;
    } catch (e) {
      ElMessage.error(e.message);
    }
  }

  onMounted(() => {
    queryData();
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
  .content-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .dialog-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    .el-collapse {
      width: 100%;
    }
  }
  .dialog-images {
    max-height: 250px;
    overflow-y: auto;
  }
  .dialog-video-container {
    position: relative;
    padding-bottom: 40px;
    .dialog-video-control {
      position: absolute;
      bottom: 0;
      left: 0;
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 40px;
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
      .timeline {
        margin: 0 10px;
        width: 140px;
        line-height: 40px;
      }
    }
    .dialog-video-canvas {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 3;
      pointer-events: none;
    }
  }
</style>
