<template>
  <h3 :id="title" class="doc-title">
    <span>{{ title }}</span>
    <a class="header-anchor" :href="`#${title}`" aria-hidden="true">#</a>
  </h3>
  <slot />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Anchor',
  components: {},
  props: {
    title: {
      type: String,
    },
  },
  setup() {},
});
</script>

<style lang="scss" scoped>
.doc-title {
  position: relative;
  display: flex;
  align-items: center;
  margin: 0;
  opacity: 0;

  .header-anchor {
    position: absolute;
    padding-right: 0.23em;
    margin-top: 0.125em;
    margin-left: -0.87em;
    font-size: 0.85em;
    opacity: 0;
  }
}

.doc-title:hover {
  .header-anchor {
    opacity: 1;
  }
}
</style>
