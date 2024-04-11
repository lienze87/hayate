<script lang="ts" setup>
  import * as echarts from "echarts";
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
    json = json.replace(
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
      }
    );

    return json;
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
</script>

<template>
  <div id="main-editor" v-html="config"></div>
</template>

<style lang="scss" scoped>
  #main-editor {
    padding: 20px 10px;
    color: #f2f2f2;
    word-break: break-word;
    border-radius: 4px;
    background-color: #263238;
    .key {
      color: #f07178;
    }
    .number {
      color: #2c99ce;
    }
    .string {
      color: #2c99ce;
    }
    .boolean {
      color: #d8cb33;
    }
    .null {
      color: #f72c5b;
    }
  }
</style>
