import { defineStore } from 'pinia'

export const useAppStore = defineStore('appState', {
  state: () => ({
    hasChanges: false,
  }),
  
  getters: {},
  
  actions: {
    setHasChanges(val: boolean) {
      this.hasChanges = val
    }
  }
})