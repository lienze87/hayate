<template>
  <el-upload
    class="img-uploader"
    v-model:file-list="fileList"
    :action="POST_URL"
    accept=".bmp,.jpeg,.jpg,.png,.gif,.heif,.m4v,.mp4,.mov,.avi,.webm,.mkv"
    :show-file-list="false"
    :on-success="handleUploadSuccess"
    v-bind="$attrs"
  >
    <el-icon v-if="fileList.length === 0" class="img-uploader-icon">
      <Plus />
    </el-icon>
    <div v-else class="img-uploader-file-item">
      <el-popover placement="bottom" trigger="hover">
        <template #reference>
          <el-image :src="fileList[0].url" fit="contain" class="item-thumbnail" />
        </template>
        <div class="item-actions">
          {{ fileList[0].name }}
        </div>
      </el-popover>
    </div>
  </el-upload>
</template>

<script lang="ts">
export default {
  name: 'ImgUploader',
};
</script>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { UploadFile, UploadUserFile } from 'element-plus';
import { Plus, ZoomIn, Delete } from '@element-plus/icons-vue';

const props = defineProps({
  url: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:url']);
const POST_URL = 'http://localhost:3005/upload';
const fileList = ref<UploadUserFile[]>([]);

const handleUploadSuccess = (response: any, file: UploadFile) => {
  ElMessage.success('上传成功');
  fileList.value = [{ ...file, url: response.data }];
  emit('update:url', response.data);
};

onMounted(() => {
  if (props.url) {
    fileList.value = [
      {
        name: props.url.split('/').slice(-1)[0],
        url: props.url,
      },
    ];
  }
});
</script>

<style lang="scss" scoped>
.img-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  :deep(.el-upload) {
    width: 100%;
    .img-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100%;
      height: 76px;
      text-align: center;
    }
    .img-uploader-file-item {
      position: relative;
      width: 100%;

      .item-actions {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 20px;
        opacity: 0;
        background-color: rgba(0, 0, 0, 0.5);
        span {
          display: none;
          cursor: pointer;
        }
      }

      .item-actions:hover {
        opacity: 1;
        span {
          display: inline-flex;
        }
      }

      .item-thumbnail {
        width: 100%;
        height: 76px;
        display: block;
      }
    }
  }
}

.img-uploader:hover {
  border-color: var(--el-color-primary);
}
</style>
