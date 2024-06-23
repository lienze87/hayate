import { defineStore } from 'pinia';

export const useCommonStore = defineStore('common', {
  state: () => ({
    status: 200,
  }),
  getters: {
    online: (state) => state.status === 200,
  },
  actions: {
    setServerStatus(status: number) {
      this.status = status;
    },
  },
  persist: true,
});
