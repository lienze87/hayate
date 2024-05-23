<template>
  <div class="markdown-editor">
    <div class="markdown-editor-actions">
      <el-button type="primary" @click="handlePreview">预览</el-button>
    </div>
    <div class="markdown-text-input">
      <el-input v-model="context" :autosize="{ minRows: 5, maxRows: 20 }" type="textarea" placeholder="请输入内容" />
    </div>
    <el-dialog v-model="dialogVisible" title="预览" width="640" destroy-on-close>
      <div class="markdown-preview">
        <span v-if="!html">暂无内容</span>
        <div v-else class="markdown-preview-html" v-html="html"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { marked } from 'marked';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const dialogVisible = ref(false);
const localContext = ref(props.modelValue);

const context = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
    localContext.value = val;
  },
});

const html = computed(() => {
  const result = marked.parse(localContext.value);

  return result;
});

const handlePreview = () => {
  dialogVisible.value = true;
};

defineExpose({});
</script>

<style lang="scss" scoped>
.markdown-editor {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  .markdown-editor-actions {
    margin-bottom: 5px;
    width: 100%;
  }
  .markdown-text-input {
    width: 100%;
  }
}
.markdown-preview {
  position: relative;
  .markdown-preview-html {
    min-height: 100px;
    max-height: 600px;
    border-top: 1px solid #ccc;
    overflow: auto;
  }
}
</style>
