<template>
  <el-upload
    v-model:file-list="fileList"
    class="img-uploader"
    :action="POST_URL"
    accept=".bmp,.jpeg,.jpg,.png,.gif,.heif,.m4v,.mp4,.mov,.avi,.webm,.mkv"
    :show-file-list="false"
    :on-success="handleUploadSuccess"
    v-bind="$attrs"
  >
    <el-icon v-if="fileList.length === 0" class="img-uploader-icon">
      <plus />
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
import { Plus } from '@element-plus/icons-vue';
import type { UploadFile, UploadUserFile } from 'element-plus';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';

const props = defineProps({
  url: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:url']);
const POST_URL = '/api/upload';
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
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;

  :deep(.el-upload) {
    width: 100%;

    .img-uploader-icon {
      width: 100%;
      height: 76px;
      font-size: 28px;
      color: #8c939d;
      text-align: center;
    }

    .img-uploader-file-item {
      position: relative;
      width: 100%;

      .item-actions {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-size: 20px;
        color: #fff;
        background-color: rgba(0, 0, 0, 50%);
        opacity: 0;

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
        display: block;
        width: 100%;
        height: 76px;
      }
    }
  }
}

.img-uploader:hover {
  border-color: var(--el-color-primary);
}
</style>
