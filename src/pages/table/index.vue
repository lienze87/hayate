<template>
  <div class="main-content">
    <el-table class="data-table" :data="tableData">
      <el-table-column prop="outline" label="大纲">
        <template #default="scope">
          <el-input v-model="scope.row.outline" :rows="3" type="textarea" placeholder="概括拍摄内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="scene" label="景别" width="180">
        <template #default="scope">
          <el-select v-model="scope.row.scene">
            <el-option label="远景" value="far"></el-option>
            <el-option label="中景" value="middle"></el-option>
            <el-option label="近景" value="near"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="cameraOperation" label="运镜" width="180" />
      <el-table-column prop="reference" label="参考图">
        <template #default="scope">
          <img-uploader v-model:url="scope.row.reference" />
        </template>
      </el-table-column>
      <el-table-column prop="duration" label="时长" width="180">
        <template #default="scope">
          <el-input v-model="scope.row.duration"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="cameraDescription" label="分镜描述">
        <template #default="scope">
          <el-input
            v-model="scope.row.cameraDescription"
            :rows="3"
            type="textarea"
            placeholder="详细描述分镜"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="copywriting" label="台词文案">
        <template #default="scope">
          <el-input v-model="scope.row.copywriting" :rows="3" type="textarea" placeholder="请输入文案"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="describe" label="备注">
        <template #default="scope">
          <el-input v-model="scope.row.describe" :rows="3" type="textarea" placeholder="请输入备注"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <simple-table :init-data="tableData" :columns="dataColumns">
      <template #reference="scope">
        <img-uploader v-model:url="scope.row.reference" />
      </template>
    </simple-table>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ActionScript',
};
</script>

<script setup lang="ts">
import { ref } from 'vue';

import ImgUploader from '@/components/ImgUploader.vue';
import SimpleTable from '@/components/simple-table';

const tableData = ref([
  {
    uuid: '0',
    outline: '一段故事',
    scene: 'middle',
    cameraOperation: '固定',
    reference: '',
    duration: '5',
    cameraDescription: '拍摄主角',
    copywriting: '啊',
    describe: '一段备注',
  },
]);
const sceneObj: Record<string, string> = {
  far: '远景',
  middle: '中景',
  near: '近景',
};
const dataColumns = ref<any[]>([
  {
    label: '大纲',
    prop: 'outline',
  },
  {
    label: '景别',
    prop: 'scene',
    formatter: (row: any) => {
      return sceneObj[row.scene];
    },
  },
  {
    label: '运镜',
    prop: 'cameraOperation',
  },
  {
    label: '参考图',
    prop: 'reference',
  },
  {
    label: '时长',
    prop: 'duration',
  },
  {
    label: '分镜描述',
    prop: 'cameraDescription',
  },
  {
    label: '台词文案',
    prop: 'copywriting',
  },
  {
    label: '备注',
    prop: 'describe',
  },
  {
    label: '操作',
    prop: '',
    extType: 'btn',
    btnList: [
      {
        text: '编辑',
        handler: (row: any) => {
          console.log(row);
        },
      },
    ],
  },
]);
</script>
<style lang="scss" scoped>
.main-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: calc(100vh - 100px);
}
.data-table {
  width: 100%;
}
</style>
