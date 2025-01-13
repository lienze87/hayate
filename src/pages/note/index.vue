<template>
  <div class="main-content">
    <div class="content-header">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1" title="新增笔记">
          <template #title>
            <el-button type="primary" plain @click.stop.prevent="handleAddData"> 新增笔记 </el-button>
          </template>
          <el-form :model="addFormData" class="form-add" label-width="120px">
            <el-form-item label="标题">
              <el-input v-model="addFormData.title" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="内容">
              <markdown-editor v-model="addFormData.context"></markdown-editor>
            </el-form-item>
            <el-form-item>
              <div class="form-inline-block">
                <div></div>
                <el-button type="primary" @click="handleConfirmData('add')"> 确定 </el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="content-list">
      <div v-for="row in dataList" :key="row.uuid" class="content-item">
        <el-card>
          <template #header>
            <div v-if="editId === row.uuid" class="form-item">
              <el-input v-model="editFormData.title" placeholder="请输入" clearable />
            </div>
            <div v-else class="form-inline-block">
              <div class="card-item-title">{{ row.title }}</div>
              <div class="card-item-header">
                <el-button type="success" @click="handleEditFormData(row)"> 修改 </el-button>
                <el-button type="danger" @click="handleDeleteData(row)"> 删除 </el-button>
              </div>
            </div>
          </template>
          <div v-if="editId === row.uuid" class="card-item-content">
            <div class="form-item">
              <markdown-editor v-model="editFormData.context"></markdown-editor>
            </div>
            <div class="form-inline-block">
              <div></div>
              <div>
                <el-button type="primary" @click="handleConfirmData('edit')"> 确定 </el-button>
                <el-button @click="handleCancelAdd"> 取消 </el-button>
              </div>
            </div>
          </div>
          <div v-else class="card-item-content">
            <div class="card-item-context" v-html="getHtml(row.context)"></div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Notes',
};
</script>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { marked } from 'marked';
import { onMounted, ref } from 'vue';

import { addData, deleteData, getDataList, updateData } from '@/api/notes';
import MarkdownEditor from '@/components/MarkdownEditor.vue';

const dataList = ref<{ uuid: string; title: string; context: string }[]>([]);
const editId = ref('');
const activeNames = ref('');

const initFormData = {
  uuid: '0',
  title: '',
  subtitle: '',
  context: '',
  describe: '',
};

const editFormData = ref({ ...initFormData });
const addFormData = ref({ ...initFormData });

const handleAddData = () => {
  addFormData.value = { ...initFormData };

  activeNames.value = '1';
};

const handleEditFormData = (row: any) => {
  editFormData.value = { ...row };
  editId.value = row.uuid;
  activeNames.value = '0';
};

const handleDeleteData = async (row: any) => {
  try {
    await deleteData(row.id);
    ElMessage.success('删除成功');

    queryData();
    editId.value = '';
    activeNames.value = '';
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};

const handleConfirmData = async (type: string) => {
  try {
    if (type === 'add') {
      await addData({
        ...addFormData.value,
        uuid: undefined,
      });
      ElMessage.success('新增成功');
    } else {
      await updateData(editFormData.value);
      ElMessage.success('更新成功');
    }

    queryData();
    handleCancelAdd();
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};

const handleCancelAdd = () => {
  editId.value = '';
  editFormData.value = { ...initFormData };
  activeNames.value = '';
};

const getHtml = (text: string) => {
  return marked.parse(text);
};

async function queryData() {
  try {
    const res = await getDataList();
    dataList.value = res;
  } catch (e: any) {
    ElMessage.error(e.message);
  }
}

onMounted(() => {
  queryData();
});
</script>
<style lang="scss" scoped>
.main-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: calc(100vh - 100px);
}

.content-header {
  position: sticky;
  top: -20px;
  width: 100%;
  min-height: 60px;
}

.content-list {
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  .content-item {
    width: 100%;
    margin-bottom: 10px;
  }
}

.form-item {
  display: flex;
  margin-bottom: 18px;
}

.form-inline-block {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.card-item-title {
  font-size: 24px;
  font-weight: 500;
}
</style>
