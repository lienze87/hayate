<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  options: {
    type: Object,
    default: {},
  },
});

function syntaxHighlight(json: string) {
  if (typeof json != "string") {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  json = json
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        var cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return `<span class="${cls}">${match}</span>`;
      },
    )
    .replace(/\{|\}|\[|\]/g, function (match) {
      return `<span class="pattern">${match}</span>`;
    })
    .replace(/\,/g, function (match) {
      return `<span class="comma">${match}</span>`;
    });

  const spanList = json.match(/<span(([\s\S])*?)<\/span>/g);
  function getClass(tag: string) {
    return tag.match(/=\"\w+\"/)[0].replace(/\"|=/g, "");
  }
  function getTagValue(tag: string) {
    return tag.match(/>.+</)[0].replace(/\"|<|>/g, "");
  }
  const breakLineList = spanList.map((str: string, index: number) => {
    const type = getClass(str);

    if (type === "pattern" && spanList[index + 1]) {
      if (spanList[index + 1] && getClass(spanList[index + 1]) === "comma") {
        if (
          spanList[index - 1] &&
          getClass(spanList[index - 1]) !== "pattern"
        ) {
          return "\n" + str;
        } else {
          return str;
        }
      }
    }

    if (["pattern", "comma"].includes(type)) {
      return str + "\n";
    }

    return str;
  });

  // return json;
  return breakLineList.join("");
}

const config = computed({
  get() {
    const text = JSON.stringify(props.options);
    return syntaxHighlight(text);
  },
  set(val) {
    console.log(val);
  },
});

function handleCopy(str: string) {
  const type = "text/plain";
  const blob = new Blob([str], { type });
  const data = [new ClipboardItem({ [type]: blob })];

  navigator.clipboard.write(data).then(
    () => {
      console.log("已复制到剪贴板");
    },
    () => {
      console.log("复制失败，请稍后重试");
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
    color: #f2f2f2;
    border-radius: 4px;
    background-color: #263238;
    word-break: break-all;
    white-space: pre;
  }
  :deep(.editor-content) {
    .key {
      color: #2c99ce;
    }
    .number {
      color: #f07178;
    }
    .string {
      color: #f07178;
    }
    .boolean {
      color: #d8cb33;
    }
    .null {
      color: #f72c5b;
    }
  }
}
</style>
