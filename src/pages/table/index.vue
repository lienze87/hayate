<template>
  <div class="main-content">
    <div class="action_bar">
      <el-button type="primary" @click="handleAddData">新增</el-button>
    </div>
    <el-table :data="dataList">
      <el-table-column type="index" width="50" />
      <el-table-column prop="episode" label="集数">
        <template #default="scope">
          <div v-if="editId === scope.row.id">
            <el-input v-model="scope.row.episode"></el-input>
          </div>
          <span v-else>{{ scope.row.episode }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称">
        <template #default="scope">
          <div v-if="editId === scope.row.id">
            <el-input v-model="scope.row.name"></el-input>
          </div>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="start" label="起始帧">
        <template #default="scope">
          <div v-if="editId === scope.row.id">
            <el-input v-model="scope.row.start"></el-input>
          </div>
          <span v-else>{{ scope.row.start }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="end" label="结束帧">
        <template #default="scope">
          <div v-if="editId === scope.row.id">
            <el-input v-model="scope.row.end"></el-input>
          </div>
          <span v-else>{{ scope.row.end }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="frames" label="帧数">
        <template #default="scope">
          <div v-if="editId === scope.row.id">
            <el-input v-model="scope.row.frames"></el-input>
          </div>
          <span v-else>{{ scope.row.frames }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="describe" label="描述">
        <template #default="scope">
          <div v-if="editId === scope.row.id">
            <el-input v-model="scope.row.describe"></el-input>
          </div>
          <span v-else>{{ scope.row.describe }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            v-if="editId === scope.row.id"
            type="primary"
            @click="handleConfirmData(scope.row)">
            确定
          </el-button>
          <el-button v-else type="success" @click="handleEditData(scope.row)">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, nextTick } from "vue";
  import { ElMessage } from "element-plus";
  import { getDataList, addData, updateData } from "@/api/table";
  import { randomHex } from "@/utils";

  const dataList = ref([]);
  const editId = ref("");

  // 01:12+12 -> 1*60*24+12*24+12
  // 1691 -> 01:10+11
  function translateTime(param: string | number) {
    if (typeof param === "string") {
      const reg = /^[0-9]{2}\:[0-9]{2}\+[0-9]{1,2}$/;
      if (!reg.test(param)) {
        throw new Error("格式错误");
      }
      let minutes = parseInt(param.split(":")[0]) * 60 * 24;
      let seconds = parseInt(param.split(":")[1].split("+")[0]) * 24;
      let frames = parseInt(param.split(":")[1].split("+")[1]);

      return minutes + seconds + frames;
    }

    if (typeof param === "number") {
      let minutes = Math.floor(param / (60 * 24));
      let seconds = Math.floor((param % (60 * 24)) / 24);
      let frames = param % 24;
      return `${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}+${frames}`;
    }
  }

  const handleAddData = () => {
    dataList.value.push({
      uuid: "0",
      episode: 1,
      name: "",
      start: "0",
      end: "0",
      frames: 0,
      describe: "",
    });
    nextTick(() => {
      editId.value = "0";
    });
  };

  const handleEditData = (row: any) => {
    editId.value = row.id;
  };

  const handleConfirmData = async (row: any) => {
    try {
      const data = {
        ...row,
        startIndex: row.start ? translateTime(row.start) : 0,
        endIndex: row.end ? translateTime(row.end) : 0,
        uuid: randomHex(),
      };
      if (row.uuid === "0") {
        await addData(data);
        ElMessage.success("新增成功");
      } else {
        await updateData(data);
        ElMessage.success("更新成功");
      }
      // const targetIndex = dataList.value.findIndex(
      //   (ele: any) => ele.uuid === editId.value
      // );
      // dataList.value.splice(targetIndex, 1, data);
      queryData();
      editId.value = "";
    } catch (e) {
      ElMessage.error(e.message);
    }
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
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: calc(100vh - 100px);
  }
</style>
