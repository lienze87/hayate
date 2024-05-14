<template>
  <div class="main-content">
    <div class="content-header">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1" title="新增笔记">
          <template #title>
            <el-button type="primary" plain @click.stop.prevent="handleAddData">
              新增笔记
            </el-button>
          </template>
          <el-form :model="addFormData" class="form-add" label-width="120px">
            <el-form-item label="标题">
              <el-input
                v-model="addFormData.title"
                placeholder="请输入"
                clearable />
            </el-form-item>
            <el-form-item label="内容">
              <el-input
                v-model="addFormData.context"
                :autosize="{ minRows: 5, maxRows: 20 }"
                type="textarea"
                placeholder="请输入内容" />
            </el-form-item>
            <el-form-item>
              <div class="form-inline-block">
                <el-input
                  v-model="addFormData.subtitle"
                  placeholder="请输入次级标题">
                </el-input>
                <el-button type="primary" @click="handleConfirmData('add')">
                  确定
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="content-list">
      <div class="content-item" v-for="row in dataList" :key="row.uuid">
        <el-card>
          <template #header>
            <div v-if="editId === row.uuid" class="form-item">
              <el-input
                v-model="editFormData.title"
                placeholder="请输入"
                clearable />
            </div>
            <div class="form-inline-block" v-else>
              <div class="card-item-title">{{ row.title }}</div>
              <div class="card-item-header">
                <el-button type="success" @click="handleEditFormData(row)">
                  修改
                </el-button>
                <el-button type="danger" @click="handleDeleteData(row)">
                  删除
                </el-button>
              </div>
            </div>
          </template>
          <div class="card-item-content" v-if="editId === row.uuid">
            <div class="form-item">
              <el-input
                v-model="editFormData.context"
                :autosize="{ minRows: 5, maxRows: 20 }"
                type="textarea"
                placeholder="请输入内容" />
            </div>
            <div class="form-inline-block">
              <el-select
                v-model="editFormData.subtitle"
                placeholder="请选择类型"
                style="width: 150px">
                <el-option label="vue" value="vue"></el-option>
                <el-option label="js" value="js"></el-option>
                <el-option label="css" value="css"></el-option>
              </el-select>
              <div>
                <el-button type="primary" @click="handleConfirmData('edit')">
                  确定
                </el-button>
                <el-button @click="handleCancelAdd"> 取消 </el-button>
              </div>
            </div>
          </div>
          <div class="card-item-content" v-else>
            <p>{{ row.context }}</p>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, nextTick } from "vue";
  import { ElMessage } from "element-plus";
  import { getDataList, addData, updateData, deleteData } from "@/api/notes";

  const dataList = ref([]);
  const editId = ref("");
  const activeNames = ref("");

  const initFormData = {
    uuid: "0",
    title: "",
    subtitle: "",
    context: "",
    describe: "",
  };

  const editFormData = ref({ ...initFormData });
  const addFormData = ref({ ...initFormData });

  const handleAddData = () => {
    addFormData.value = { ...initFormData };

    activeNames.value = "1";
  };

  const handleEditFormData = (row: any) => {
    editFormData.value = { ...row };
    editId.value = row.uuid;
    activeNames.value = "0";
  };

  const handleDeleteData = async (row: any) => {
    try {
      await deleteData(row.id);
      ElMessage.success("删除成功");

      queryData();
      editId.value = "";
      activeNames.value = "";
    } catch (e) {
      ElMessage.error(e.message);
    }
  };

  const handleConfirmData = async (type: string) => {
    try {
      if (type === "add") {
        await addData({
          ...addFormData.value,
          uuid: undefined,
        });
        ElMessage.success("新增成功");
      } else {
        await updateData(editFormData.value);
        ElMessage.success("更新成功");
      }

      queryData();
      handleCancelAdd();
    } catch (e) {
      ElMessage.error(e.message);
    }
  };

  const handleCancelAdd = () => {
    editId.value = "";
    editFormData.value = { ...initFormData };
    activeNames.value = "";
  };

  async function queryData() {
    try {
      const res = await getDataList();
      dataList.value = res;
    } catch (e) {
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
    width: 100%;
    min-height: 60px;
  }
  .content-list {
    flex-grow: 1;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    .content-item {
      margin-bottom: 10px;
      width: 100%;
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
