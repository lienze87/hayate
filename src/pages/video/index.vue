<template>
  <div class="layout-container">
    <KeepAlive :include="['VideoList']">
      <VideoList
        v-if="pageType === 'LIST'"
        @change-page-type="changePageType" />
      <VideoDetail
        v-else
        :filename="selectFilename"
        @go-back="changePageType('LIST')" />
    </KeepAlive>
  </div>
</template>

<script lang="ts">
  export default {
    name: "Video",
  };
</script>

<script lang="ts" setup>
  import { ref } from "vue";
  import VideoList from "./list.vue";
  import VideoDetail from "./detail.vue";

  const pageType = ref("LIST");
  const selectFilename = ref("");
  function changePageType(type: string, filename = "") {
    pageType.value = type;
    selectFilename.value = filename;
  }
</script>
<style lang="scss" scoped></style>
