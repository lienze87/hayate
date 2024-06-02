<template>
  <div class="layout-container">
    <KeepAlive :include="['VideoList']">
      <video-list v-if="pageType === 'LIST'" @change-page-type="changePageType" />
      <video-detail v-else :filename="selectFilename" @go-back="changePageType('LIST')" />
    </KeepAlive>
  </div>
</template>

<script lang="ts">
export default {
  name: 'VideoIndex',
};
</script>

<script lang="ts" setup>
import { ref } from 'vue';

import VideoDetail from './detail.vue';
import VideoList from './list.vue';

const pageType = ref('LIST');
const selectFilename = ref('');
function changePageType(type: string, filename = '') {
  pageType.value = type;
  selectFilename.value = filename;
}
</script>
<style lang="scss" scoped></style>
