<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
  options: {
    type: Object,
    default: () => {},
  },
});

function syntaxHighlight(json: string) {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, undefined, 2);
  }

  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lineArr = json.match(/.+\n/g);
  if (!lineArr) return '';
  const lineList = lineArr.map((line: string) => {
    const keys = line.split(' ').map((key: string) => {
      if (key !== ' ' && key.slice(-1)[0] === ':') {
        return `<span class="key">${key}</span>`;
      }
      return key.replace(/\{|\}|\[|\]/g, (match: string) => {
        return `<span class="pattern">${match}</span>`;
      });
    });
    return keys.join(' ');
  });

  return lineList.join('');
}

const config = computed(() => {
  // 第三个参数自动插入空格进行缩进
  const json = JSON.stringify(props.options, undefined, 2);
  return syntaxHighlight(json);
});

function handleCopy(str: string) {
  const type = 'text/plain';
  const blob = new Blob([str], { type });
  const data = [new ClipboardItem({ [type]: blob })];

  navigator.clipboard.write(data).then(
    () => {
      console.log('已复制到剪贴板');
    },
    () => {
      console.log('复制失败，请稍后重试');
    },
  );
}

const onCopy = () => {
  const text = JSON.stringify(props.options);
  handleCopy(text);
};
</script>

<template>
  <div class="main-editor">
    <div class="action-bar">
      <el-button type="primary" @click="onCopy">复制</el-button>
    </div>
    <div class="editor-content" v-html="config"></div>
  </div>
</template>

<style lang="scss" scoped>
.main-editor {
  width: 800px;

  .editor-content {
    padding: 20px 10px;
    color: #ce9178;
    white-space: pre;
    background-color: #263238;
    border-radius: 4px;
  }

  :deep(.editor-content) {
    .key {
      color: #569ccb;
    }

    .pattern {
      color: #d46ed6;
    }
  }
}
</style>
