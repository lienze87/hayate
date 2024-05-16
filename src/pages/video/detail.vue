<template>
  <div class="main-content">
    <div class="content-nav">
      <div class="nav-title">
        {{ props.filename }}
      </div>
      <div class="nav-operation">
        <el-button type="primary" plain @click="goBack">返回</el-button>
      </div>
    </div>
    <div class="content-container">
      <div class="video-container">
        <VideoPlayer width="960" preload="metadata">
          <source :src="sourceVideoPath" type="video/mp4" />
        </VideoPlayer>
      </div>
      <div class="video-aside">
        <div class="video-part-header">
          <el-button type="primary" plain @click="handleAddData">
            新增
          </el-button>
        </div>
        <div class="video-part-list">
          <div
            class="video-part-item"
            v-for="item in dataList"
            :key="item.uuid">
            <div class="part-item-title">
              {{ item.name }} {{ `${item.start}-${item.end}` }}
            </div>
            <div class="part-item-describe">{{ item.describe }}</div>
            <div class="part-item-action">
              <el-button type="primary" @click="handlePreviewData(item)">
                预览
              </el-button>
              <el-button type="primary" plain @click="handleEditData(item)">
                修改
              </el-button>
              <el-button type="primary" plain @click="handleExtractData(item)">
                帧生成
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="partDialogVisible"
      title="数据更新"
      width="672"
      destroy-on-close>
      <div class="dialog-container">
        <div class="dialog-form">
          <el-form :model="editPartVideoData" label-width="120px">
            <el-form-item label="源文件">
              <span>{{ editPartVideoData.sourceName }}</span>
            </el-form-item>
            <el-form-item label="名称">
              <el-input v-model="editPartVideoData.name"></el-input>
            </el-form-item>
            <el-form-item label="开始时间">
              <el-input v-model="editPartVideoData.start"></el-input>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-input v-model="editPartVideoData.end"></el-input>
            </el-form-item>
            <el-form-item label="帧数">
              <el-input-number
                v-model="editPartVideoData.frames"
                :min="0"
                :max="9999"
                :step="1"></el-input-number>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="editPartVideoData.describe"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="partDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmData">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="videoDialogVisible"
      title="视频预览"
      width="672"
      destroy-on-close>
      <div class="dialog-container">
        <VideoPlayer ref="videoPlayerRef">
          <source :src="previewVideoUrl" type="video/mp4" />
        </VideoPlayer>
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
                :min="0"
                :max="imageData.end"
                :step="1"></el-input-number>
            </el-form-item>
            <el-form-item label="结束帧">
              <el-input-number
                v-model="imageData.end"
                :min="imageData.begin"
                :max="9999"
                :step="1"></el-input-number>
            </el-form-item>
            <el-form-item label="帧间隔">
              <el-input-number
                v-model="imageData.step"
                :min="1"
                :max="60"
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
            v-for="(image, index) in imageList"
            :key="image"
            :src="image"
            :preview-src-list="imageList"
            :initial-index="index"
            class="frame-image"
            fit="contain" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  export default {
    name: "VideoDetail",
  };
</script>

<script lang="ts" setup>
  import { computed, ref, onMounted } from "vue";
  import { ElMessage } from "element-plus";
  import {
    getDataList,
    getDataDetail,
    addData,
    updateData,
    addDataImage,
    updateDataImage,
    getDataImageDetail,
    getVideoInfo,
  } from "@/api/video";
  import VideoPlayer from "@/components/VideoPlayer.vue";
  import { translateTime } from "@/utils";

  const props = defineProps({
    filename: {
      type: String,
      default: "",
    },
  });

  const emits = defineEmits(["go-back"]);
  const goBack = () => {
    emits("go-back");
  };

  const sourceVideoPath = computed(() => {
    return `http://localhost:3005/video/${props.filename}`;
  });
  const sourceVideoStreams = ref([]);
  async function getVideoMetaData(id: string) {
    try {
      const res = await getVideoInfo(id);
      sourceVideoStreams.value = res;
    } catch (e) {
      ElMessage.error(e.message);
    }
  }

  const dataList = ref([]);
  async function queryData() {
    try {
      const res = await getDataList({ sourceName: props.filename });
      dataList.value = res;
    } catch (e) {
      ElMessage.error(e.message);
    }
  }

  const partDialogVisible = ref(false);
  const editPartVideoData = ref({
    uuid: "0",
    sourceName: "",
    name: "",
    start: "00:00:00",
    end: "00:00:00",
    frames: 0,
    describe: "",
  });
  const handleAddData = () => {
    editPartVideoData.value = {
      uuid: "0",
      sourceName: props.filename,
      name: "",
      start: "00:00:00",
      end: "00:00:00",
      frames: 0,
      describe: "",
    };
    partDialogVisible.value = true;
  };

  const handleEditData = (row: any) => {
    editPartVideoData.value = row;
    partDialogVisible.value = true;
  };

  const handleConfirmData = async () => {
    try {
      const data = {
        ...editPartVideoData.value,
        startIndex: editPartVideoData.value.start
          ? translateTime(editPartVideoData.value.start)
          : 0,
        endIndex: editPartVideoData.value.end
          ? translateTime(editPartVideoData.value.end)
          : 0,
      };
      if (editPartVideoData.value.uuid === "0") {
        await addData({ ...data, uuid: undefined });
        ElMessage.success("新增成功");
      } else {
        await updateData(data);
        ElMessage.success("更新成功");
      }
      partDialogVisible.value = false;
      queryData();
    } catch (e) {
      ElMessage.error(e.message);
    }
  };

  const videoDialogVisible = ref(false);
  const previewVideoUrl = ref("");
  const videoPlayerRef = ref();

  const handlePreviewData = (row: any) => {
    previewVideoUrl.value = `http://localhost:3005/videoPart/${row.id}`;
    if (sourceVideoStreams.value.length === 0) {
      getVideoMetaData(row.id);
    }
    videoDialogVisible.value = true;
  };

  const imageDialogVisible = ref(false);
  const imageList = ref([]);
  const imageData = ref({
    uuid: "0",
    frameId: 0,
    begin: 0,
    end: 1,
    step: 1,
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

  onMounted(() => {
    queryData();
    window.addEventListener("keydown", (event) => {
      console.log(event.code);
    });
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
  .content-nav {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding-bottom: 10px;
    width: 100%;
    border-bottom: 1px solid #ccc;
  }

  .content-container {
    width: 80%;
    margin: 0 10%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    .video-container {
      flex-grow: 1;
      flex-shrink: 0;
      margin-right: 20px;
    }
    .video-aside {
      flex-basis: 280px;
      padding-left: 10px;
      height: 100%;
      border-left: 1px solid #ccc;

      .video-part-header {
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #ccc;
      }
      .video-part-list {
        max-height: 500px;
        overflow-y: auto;
        .video-part-item {
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #ccc;
        }
      }
    }
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
    .frame-image {
      margin-right: 10px;
      width: 100px;
    }
  }
</style>
