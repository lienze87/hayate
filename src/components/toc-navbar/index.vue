<template>
  <div class="content-wrapper">
    <div class="content-container">
      <div style="position: relative; width: 100%" class="doc-content">
        <div class="doc-base-anchor">
          <slot />
        </div>
      </div>
    </div>
    <toc :data="tocMenu" />
  </div>
</template>

<script lang="ts">
import './src/side-bar.scss';

import { defineComponent, onMounted, ref } from 'vue';

import Toc from './src/toc.vue';

export default defineComponent({
  name: 'TocNavbar',
  components: { Toc },
  setup(props: any) {
    const title = ref(props.title || '');

    const tocMenu = ref<any[]>([]);

    onMounted(() => {
      tocMenu.value = Array.from(document.querySelectorAll('.doc-title')).map((ele) => {
        return { link: `#${ele.id}`, text: ele.id };
      });
    });
    return { title, tocMenu };
  },
});
</script>

<style lang="scss" scoped></style>
