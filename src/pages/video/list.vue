<template>
  <div class="main-content">
    <div class="content-nav">
      <el-upload
        v-model:file-list="uploadFileList"
        class="upload-demo"
        action="http://localhost:3005/upload"
        :show-file-list="false"
        :on-success="handleUploadSuccess"
      >
        <el-button type="primary">上传文件</el-button>
      </el-upload>
    </div>
    <div class="video-list">
      <el-card
        v-for="item in videoList"
        :key="item.filename"
        class="video-item"
        @click="handleCheckDetail(item)"
      >
        <template #header>{{ item.filename }}</template>
        <img :src="item.poster" />
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "VideoList",
};
</script>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getVideoList } from "@/api/video";

const emit = defineEmits(["changePageType"]);

const uploadFileList = ref([]);
const handleUploadSuccess = () => {
  ElMessage.success("上传成功");
  getDataList();
};

const videoList = ref([]);

async function getDataList() {
  try {
    const res = await getVideoList();
    videoList.value = res.map((ele: string) => {
      return {
        filename: ele,
        poster: `http://localhost:3005/${ele.split(".mp4")[0]}.jpg`,
      };
    });
  } catch (e) {
    ElMessage.error(e.message);
  }
}

const handleCheckDetail = (row: any) => {
  emit("changePageType", "DETAIL", row.filename);
};
onMounted(() => {
  getDataList();
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
.video-list {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  .video-item {
    margin-right: 10px;
    margin-bottom: 10px;
    width: 384px;
    img {
      width: 100%;
      object-fit: contain;
    }
  }
}
</style>
