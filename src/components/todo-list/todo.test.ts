import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import type { ElInput } from 'element-plus';
import { describe, expect, test } from 'vitest';
import { h, nextTick } from 'vue';

import Todo from './todo.vue';

describe('TodoList', () => {
  test('default render should be eating', async () => {
    const wrapper = mount(Todo);
    // 断言元素不存在时使用find, 断言元素存在时使用get\
    const todo = wrapper.find('[data-test="todo-item"]');
    expect(todo.exists()).toBe(true);
    expect(todo.isVisible()).toBe(true);
    expect(todo.text()).toBe('eating');

    expect(wrapper.findAll('[data-test="todo-item"]')).toHaveLength(1);
  });

  test('should show header when set header sort', async () => {
    const wrapper = mount(Todo, {
      global: {
        provide: {
          sort: 'header',
        },
      },
      slots: {
        main: h('div', 'Main Content'),
        scoped: `<template #scoped="scope">
        Hello {{ scope.msg }}
        </template>
      `,
        header: {
          template: '<h1>123</h1>',
        },
      },
    });
    expect(wrapper.html()).toContain('<h1>123</h1>');
    expect(wrapper.get('h1').text()).toBe('123');
  });

  test('add todo', async () => {
    const wrapper = mount(Todo);

    const input = wrapper.findComponent({ name: 'ElInput' }) as VueWrapper<InstanceType<typeof ElInput>>;
    await input.setValue('sleeping');

    expect(input.emitted('update:modelValue')).toBeTruthy();
    expect(input.emitted('update:modelValue')?.[0]).toEqual(['sleeping']);

    expect(input.get('input').element.value).toBe('sleeping');
    await wrapper.get('.add-todo-btn').trigger('click');

    expect(wrapper.emitted('add-todo')).toBeTruthy();
    expect(wrapper.emitted('add-todo')?.[0]).toEqual(['sleeping']);

    await nextTick();
    expect(wrapper.findAll('[data-test="todo-item"]')).toHaveLength(2);
  });

  test('complete todo', async () => {
    const wrapper = mount(Todo);

    await wrapper.get('[data-test="todo-checkbox"]').setValue(true);

    expect(wrapper.get('[data-test="todo-item"]').classes()).toContain('completed');
  });
});
