<template>
  <div class="main-content">
    <div class="action_bar">
      <el-button type="primary" plain @click="handleAddData">新增</el-button>
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
      width="600"
      destroy-on-close>
      <div class="dialog-container">
        <el-collapse v-model="videoDialogActiveNames">
          <el-collapse-item title="视频" name="video">
            <div class="dialog-video">
              <video ref="videoRef" controls width="568">
                <source :src="previewVideoUrl" type="video/mp4" />
              </video>
            </div>
          </el-collapse-item>
          <el-collapse-item title="分帧查看" name="canvas">
            <div class="dialog-canvas">
              <span>当前帧数:</span>
              <el-input-number
                v-model="videoInfo.currentFrame"
                :min="0"
                :max="videoInfo.framesCount"
                :step="1"
                @change="handleFrameChange"></el-input-number>
              <span>/{{ videoInfo.framesCount }}</span>
            </div>
            <el-divider />
            <canvas ref="canvasRef" width="568" height="320"></canvas>
          </el-collapse-item>
        </el-collapse>
      </div>
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
  import { ref, onMounted, nextTick } from "vue";
  import { ElMessage } from "element-plus";
  import {
    getDataList,
    getDataDetail,
    addData,
    updateData,
    addDataImage,
    updateDataImage,
    getDataImageDetail,
  } from "@/api/video";
  import { randomHex } from "@/utils";

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
  const videoDialogActiveNames = ref("video");
  const previewVideoUrl = ref("");
  const videoRef = ref<HTMLVideoElement>();
  const canvasRef = ref<HTMLCanvasElement>();
  const videoInfo = ref({ framesCount: 0, currentFrame: 0 });

  const frameList = ref([]);

  const handlePreviewData = (row: any) => {
    previewVideoUrl.value = `http://localhost:3005/video/${row.id}`;
    videoDialogVisible.value = true;
    nextTick(() => {
      handleVideoToCanvas();
      // getFrameList();
    });
  };

  async function handleVideoToCanvas() {
    const canvas = canvasRef.value;
    const video = videoRef.value;
    const ctx = canvas.getContext("2d");

    // 每帧执行
    if ("requestVideoFrameCallback" in HTMLVideoElement.prototype) {
      let paintCount = 0;

      const updateCanvas = async () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const bitmap = await createImageBitmap(video);

        frameList.value.push(bitmap);

        videoInfo.value.framesCount = ++paintCount;
        // Re-register the callback to run on the next frame
        video.requestVideoFrameCallback(updateCanvas);
      };
      video.requestVideoFrameCallback(updateCanvas);
    } else {
      video.addEventListener("timeupdate", () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      });
    }

    video.play();
    video.addEventListener("ended", () => {
      console.log("累计帧数：" + frameList.value.length);
    });
  }

  const handleFrameChange = () => {
    const canvas = canvasRef.value;
    const ctx = canvas.getContext("2d");
    if (videoInfo.value.framesCount === 0) {
    }
    if (frameList.value[videoInfo.value.currentFrame]) {
      ctx.drawImage(
        frameList.value[videoInfo.value.currentFrame],
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
  };

  // 存在跨域问题
  async function getFrameList() {
    const video = videoRef.value;
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
</style>
