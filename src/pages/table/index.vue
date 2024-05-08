<template>
  <div class="main-content">
    <div class="action_bar">
      <el-button type="primary" @click="handleAddData">新增</el-button>
    </div>
    <el-table :data="dataList">
      <el-table-column type="index" width="50" />
      <el-table-column prop="episode" label="集数">
        <template #default="scope">
          <div v-if="editId === scope.row.id">
            <el-input v-model="scope.row.episode"></el-input>
          </div>
          <span v-else>{{ scope.row.episode }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称">
        <template #default="scope">
          <div v-if="editId === scope.row.id">
            <el-input v-model="scope.row.name"></el-input>
          </div>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="start" label="起始帧">
        <template #default="scope">
          <div v-if="editId === scope.row.id">
            <el-input v-model="scope.row.start"></el-input>
          </div>
          <span v-else>{{ scope.row.start }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="end" label="结束帧">
        <template #default="scope">
          <div v-if="editId === scope.row.id">
            <el-input v-model="scope.row.end"></el-input>
          </div>
          <span v-else>{{ scope.row.end }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="frames" label="帧数">
        <template #default="scope">
          <div v-if="editId === scope.row.id">
            <el-input v-model="scope.row.frames"></el-input>
          </div>
          <span v-else>{{ scope.row.frames }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="describe" label="描述">
        <template #default="scope">
          <div v-if="editId === scope.row.id">
            <el-input v-model="scope.row.describe"></el-input>
          </div>
          <span v-else>{{ scope.row.describe }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button
            v-if="editId === scope.row.id"
            type="primary"
            @click="handleConfirmData(scope.row)">
            确定
          </el-button>
          <div v-else>
            <el-button type="success" @click="handleEditData(scope.row)">
              修改
            </el-button>
            <el-button type="primary" @click="handlePreviewData(scope.row)">
              查看
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogVisible"
      title="视频预览"
      width="600"
      destroy-on-close>
      <video ref="videoRef" controls width="568">
        <source :src="previewVideoUrl" type="video/mp4" />
      </video>
      <p>{{ videoInfo }}</p>
      <canvas ref="canvasRef" width="568" height="320"></canvas>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, nextTick } from "vue";
  import { ElMessage } from "element-plus";
  import { getDataList, addData, updateData } from "@/api/table";
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
      episode: 1,
      name: "",
      start: "0",
      end: "0",
      frames: 0,
      describe: "",
    });
    nextTick(() => {
      editId.value = "0";
    });
  };

  const handleEditData = (row: any) => {
    editId.value = row.id;
  };

  const dialogVisible = ref(false);
  const previewVideoUrl = ref("");
  const videoRef = ref<HTMLVideoElement>();
  const canvasRef = ref<HTMLCanvasElement>();
  const videoInfo = ref("");
  const frameList = ref([]);

  const handlePreviewData = (row: any) => {
    previewVideoUrl.value = `http://localhost:3005/video/${row.id}`;
    dialogVisible.value = true;
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

        videoInfo.value = `当前帧数: ${++paintCount}`;
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
      console.log(frameList.value);
    });
  }

  // 存在跨域问题
  async function getFrameList() {
    const video = videoRef.value;

    if (window.MediaStreamTrackProcessor) {
      await video.play();
      const track = await video.captureStream().getVideoTracks()[0];
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

  const handleConfirmData = async (row: any) => {
    try {
      const data = {
        ...row,
        startIndex: row.start ? translateTime(row.start) : 0,
        endIndex: row.end ? translateTime(row.end) : 0,
        uuid: randomHex(),
      };
      if (row.uuid === "0") {
        await addData(data);
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
</style>
