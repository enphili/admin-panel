import { defineStore } from 'pinia'
import { AuthService } from '../service/AuthService.ts'

interface State {
  hasChanges: boolean;
  settings: {
    path: string;
    login: string;
    password: string;
  };
  initialSettings: {
    path: string;
    login: string;
    password: string;
  };
  csrfToken: string;
  // ... будет дополняться полями
}

const authService = new AuthService()

export const useAppStore = defineStore('appState', {
  state: (): State => ({
    hasChanges: false, // флаг показывающий были ли пользователем внесены какие-либо изменения
    settings: { // изменения на вкладке Настройка
      path: window.location.pathname, // храним начальный путь расположения приложения
      login: '', // начальное значение логина
      password: '' // временное хранение только на время сессии
    },
    initialSettings: {
      path: window.location.pathname,
      login: '',
      password: ''
    },
    csrfToken: ''
  }),
  
  getters: {},
  
  actions: {
    async initialize() {
      await authService.fetchCsrfToken()
      this.csrfToken = authService.getCsrfToken() || ''
    },
    
    setInitialSettings() {
      this.initialSettings = JSON.parse(JSON.stringify(this.settings)) // глубокое копирование
    },
    
    setHasChanges(val: boolean) {
      this.hasChanges = val
    }
  }
})