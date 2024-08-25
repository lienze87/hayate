<template>
  <div class="collapse-container">
    <div class="expand-btn" @click="handleClick">
      <slot name="expand" :is-expand="showExpand">
        <span>{{ showExpand ? '收起' : '展开' }}</span>
      </slot>
    </div>
    <div class="transition" :style="`max-height: ${isExpand ? '3000px' : '0px'}`" @transitionend="handleTransitionend">
      <slot name="default" />
      <div class="expand-btn" @click="handleClick">
        <slot name="collapse">
          <span>收起</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

defineOptions({
  name: 'CollapseBlock',
});

const props = defineProps({
  expand: {
    type: Boolean,
    default: false,
  },
});

const isExpand = ref(false);
const showExpand = ref(false);

function handleClick() {
  isExpand.value = !isExpand.value;
  // 展开评论时，先变更提示文字，后动画
  if (isExpand.value === true) {
    showExpand.value = isExpand.value;
  }
}

// 收起评论时，先动画，后变更提示文字
function handleTransitionend() {
  if (isExpand.value === false) {
    showExpand.value = isExpand.value;
  }
}

onMounted(() => {
  isExpand.value = props.expand;
});
</script>

<style lang="scss" scoped>
.transition {
  transition: max-height 0.5s ease-in-out;
  will-change: max-height;
  overflow: hidden;
}

.expand-btn {
  padding: 0 10px;
  font-size: 14px;
  line-height: 32px;
  color: #4e87ff;
  text-align: left;
}
</style>
