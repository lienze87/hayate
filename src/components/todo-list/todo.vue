<template>
  <div class="container">
    <slot name="header">
      <h1>待办事项</h1>
    </slot>
    <div class="add-bar">
      <el-input v-model="newTodo" type="text" placeholder="输入待办事项" data-test="new-todo" />
      <button class="add-todo-btn" @click="addTodo">添加</button>
    </div>
    <ul class="todo-list">
      <li
        v-for="todo in todos"
        :key="todo.id"
        :class="['todo-item', todo.completed ? 'completed' : '']"
        data-test="todo-item"
      >
        <label>
          {{ todo.title }}
          <input type="checkbox" v-model="todo.completed" data-test="todo-checkbox" />
        </label>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { PropType, ref } from 'vue';

type TodoItem = {
  id: number;
  title: string;
  completed: boolean;
};

defineOptions({
  name: 'Todo',
});

const props = defineProps({
  data: {
    type: Array as PropType<TodoItem[]>,
    default: () => [
      {
        id: 1,
        title: 'eating',
        completed: false,
      },
    ],
  },
});

const emits = defineEmits(['add-todo']);

const newTodo = ref('');

const addTodo = () => {
  const data: TodoItem = {
    id: todos.value.length + 1,
    title: newTodo.value,
    completed: false,
  };
  todos.value.push(data);
  emits('add-todo', newTodo.value);
};

const todos = ref<TodoItem[]>(props.data);
</script>
<style scoped lang="scss"></style>
