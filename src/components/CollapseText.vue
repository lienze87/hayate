<template>
  <div
    ref="TextMoreRef"
    :class="`text-more${showMore ? '' : ' multi-ellipsis'}`"
    :style="showMore ? '' : `max-height: ${maxHeight}px; --line-height: ${lineHeight}px;`"
  >
    <slot :key="uid" />
    <template v-if="isOverflow">
      <div v-if="!showMore" class="open" @click="handleChange(true)">
        查看全部
        <div class="text-transition" />
      </div>
      <div v-else class="close" @click="handleChange(false)">收起</div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

defineOptions({
  name: 'CollapseText',
});

const emit = defineEmits(['change']);

const props = defineProps({
  lineNum: {
    type: Number,
    default: 2,
  },
  lineHeight: {
    type: Number,
    default: 24,
  },
});

const showMore = ref(false);
const uid = ref(1);
const maxHeight = computed(() => props.lineNum * props.lineHeight);

const TextMoreRef = ref();
const isOverflow = ref(false);

const handleChange = (val: boolean) => {
  showMore.value = val;
  emit('change', val);
};

let textMoreObserver: MutationObserver | null = null;
// 通过MutationObserver监听slot变化，然后判断是否overflow
const initTextMoreListener = () => {
  const targetNode = TextMoreRef.value;
  const config = { childList: true, attributes: true, subtree: true };
  textMoreObserver = new MutationObserver((mutationsList: any) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const contentHeight = TextMoreRef.value?.firstElementChild?.scrollHeight;
        isOverflow.value = contentHeight && contentHeight > maxHeight.value;
      }
    }
  });
  textMoreObserver.observe(targetNode, config);
};

onMounted(() => {
  initTextMoreListener();
  // 绑定事件后，再次触发observer
  uid.value++;
});

onUnmounted(() => {
  textMoreObserver?.disconnect();
});
</script>

<style lang="scss" scoped>
.text-more {
  --line-height: 24px;

  position: relative;
  font-size: 14px;
  line-height: var(--line-height);
  overflow-x: hidden;
  :deep(img) {
    width: 100%;
    object-fit: contain;
  }

  &.multi-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .open {
    position: absolute;
    bottom: 0;
    right: 0;
    color: #1989fa;
    background: #fff;
    &::before {
      content: '\002026';
      color: #323233;
    }
  }
  .text-transition {
    position: absolute;
    top: 0px;
    left: -40px;
    margin: 0px;
    min-width: 0px;
    width: 40px;
    height: var(--line-height);
    background: linear-gradient(to right, rgba(255, 255, 255, 0), rgb(255, 255, 255));
    box-sizing: border-box;
  }
  .close {
    text-align: right;
    color: #1989fa;
  }
}
</style>
