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
      <el-card v-for="item in videoList" :key="item.filename" class="video-item" @click="handleCheckDetail(item)">
        <template #header>{{ item.filename }}</template>
        <img :src="item.poster" />
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'VideoList',
};
</script>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';

import { getVideoList } from '@/api/video';

const emit = defineEmits(['changePageType']);

const uploadFileList = ref([]);
const handleUploadSuccess = () => {
  ElMessage.success('上传成功');
  getDataList();
};

const videoList = ref<
  {
    filename: string;
    poster: string;
  }[]
>([]);

async function getDataList() {
  try {
    const res = await getVideoList();
    videoList.value = res.map((ele: string) => {
      return {
        filename: ele,
        poster: `http://localhost:3005/${ele.split('.mp4')[0]}.jpg`,
      };
    });
  } catch (e: any) {
    ElMessage.error(e.message);
  }
}

const handleCheckDetail = (row: any) => {
  emit('changePageType', 'DETAIL', row.filename);
};
onMounted(() => {
  getDataList();
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

.content-nav {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
}

.video-list {
  display: flex;
  flex-flow: wrap;
  align-items: flex-start;
  justify-content: flex-start;

  .video-item {
    width: 384px;
    margin-right: 10px;
    margin-bottom: 10px;

    img {
      width: 100%;
      object-fit: contain;
    }
  }
}
</style>
