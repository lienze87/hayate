<template>
  <div class="main-content">
    <el-table class="data-table" :data="tableData">
      <el-table-column prop="outline" label="大纲">
        <template #default="scope">
          <el-input
            v-model="scope.row.outline"
            :rows="3"
            type="textarea"
            placeholder="概括拍摄内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="scene" label="景别" width="180" />
      <el-table-column prop="cameraOperation" label="运镜" width="180" />
      <el-table-column prop="reference" label="参考图">
        <template #default="scope">
          <ImgUploader v-model:url="scope.row.reference" />
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
            placeholder="详细描述分镜"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="video" label="已拍摄片段">
        <template #default="scope">
          <el-input v-model="scope.row.video"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="copywriting" label="台词文案">
        <template #default="scope">
          <el-input
            v-model="scope.row.copywriting"
            :rows="3"
            type="textarea"
            placeholder="请输入文案"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="describe" label="备注">
        <template #default="scope">
          <el-input
            v-model="scope.row.describe"
            :rows="3"
            type="textarea"
            placeholder="请输入备注"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
  export default {
    name: "Script",
  };
</script>

<script setup lang="ts">
  import { ref } from "vue";
  import ImgUploader from "@/components/ImgUploader.vue";

  const tableData = ref([
    {
      uuid: "0",
      outline: "",
      scene: "中景",
      cameraOperation: "固定",
      reference: "",
      duration: "",
      cameraDescription: "",
      video: "",
      copywriting: "",
      describe: "",
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
