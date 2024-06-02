<template>
  <el-table
    ref="tableRef"
    v-bind="$attrs"
    :key="uid"
    v-loading="currentLoading"
    :data="dataList"
    :height="tableAutoHeight || undefined"
    :max-height="500"
  >
    <template v-for="(column, index) in currentColumns" :key="`${index}-${column.prop || 'default'}`">
      <template v-if="column.prop && $slots[column.prop]">
        <el-table-column :label="column.label" v-bind="column.opts">
          <template #default="scope">
            <slot :name="column.prop" :row="scope.row" :column="scope.column" :value="scope.value" />
          </template>
        </el-table-column>
      </template>
      <simple-column v-else :column="column" />
    </template>
  </el-table>
</template>

<script lang="ts">
import { ElTable } from 'element-plus';
import { defineComponent, nextTick, PropType, ref, watch } from 'vue';

import SimpleColumn from './column/index';
import type { ColumnProps } from './types';

export default defineComponent({
  name: 'SimpleTable',
  components: {
    SimpleColumn,
  },
  props: {
    initData: {
      type: Array<any>,
      default: () => [],
    },
    columns: {
      type: Array as PropType<ColumnProps[]>,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    autoHeight: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const tableRef = ref<InstanceType<typeof ElTable>>();

    const tableAutoHeight = ref(0);

    const uid = ref(1);

    const currentLoading = ref(props.loading);
    watch(
      () => props.loading,
      (newLoading) => {
        currentLoading.value = newLoading;
      },
    );

    const dataList = ref(props.initData);

    watch(
      () => props.initData,
      (newVal) => {
        dataList.value = newVal;
        nextTick(() => {
          if (props.autoHeight) {
            tableAutoHeight.value = getAutoHeight();
            console.log('tableHeight', tableAutoHeight.value);
          }
        });
      },
      {
        deep: true,
      },
    );

    const currentColumns = ref<ColumnProps[]>(props.columns);
    watch(
      () => props.columns,
      (newColumns: any) => {
        uid.value++;
        currentColumns.value = newColumns;
      },
      {
        immediate: true,
      },
    );

    function getAutoHeight() {
      function getParentBottom(el: HTMLElement, rootClass: string, result: number): any {
        if (!el.offsetParent) {
          return result;
        }

        if (el.offsetParent?.className === rootClass) {
          return result;
        }

        const computedStyle = window.getComputedStyle(el.offsetParent, null);

        const paddingBottom = parseInt(computedStyle.getPropertyValue('padding-bottom').replace('px', ''), 10);

        const marginBottom = parseInt(computedStyle.getPropertyValue('margin-bottom').replace('px', ''), 10);

        const newResult = result + paddingBottom + marginBottom;

        return getParentBottom(el.offsetParent as HTMLElement, rootClass, newResult);
      }

      const rootHeight = document.body.clientHeight;
      const rootClass = 'app-main';
      const rootElement = document.querySelector(`.${rootClass}`);
      const rootOffsetTop = rootElement
        ? parseInt(window.getComputedStyle(rootElement, null).getPropertyValue('padding-top').replace('px', ''), 10)
        : 0;
      const tableParentOffsetTop = tableRef.value?.$el.offsetParent.offsetTop;
      const tableOffsetTop = tableRef.value?.$el.offsetTop;

      const pageBoxHeight = 64;

      const tableParentOffsetBottom = getParentBottom(tableRef.value?.$el, rootClass, 0);

      const tableAutoHeight =
        rootHeight - rootOffsetTop - tableParentOffsetTop - tableOffsetTop - pageBoxHeight - tableParentOffsetBottom;

      return tableAutoHeight;
    }

    return { currentLoading, dataList, currentColumns, tableRef, uid, tableAutoHeight };
  },
});
</script>

<style lang="scss" scoped></style>
