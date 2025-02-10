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
      path: window.location.pathname.replace(/^\/|\/$/g, ''), // храним начальный путь расположения приложения без '/'
      login: '', // начальное значение логина
      password: '' // временное хранение только на время сессии
    },
    initialSettings: {
      path: window.location.pathname.replace(/^\/|\/$/g, ''), // Удаляем '/' с обоих концов
      login: '',
      password: ''
    },
    csrfToken: ''
  }),
  
  getters: {},
  
  actions: {
    async initialize() {
      this.csrfToken = await authService.fetchCsrfToken() || ''
    },
    
    setInitialSettings() {
      this.initialSettings = JSON.parse(JSON.stringify(this.settings)) // глубокое копирование
    },
    
    setHasChanges(val: boolean) {
      this.hasChanges = val
    },
    
    clearUserState() {
      this.hasChanges = false
      this.settings = {
        path: '',
        login: '',
        password: ''
      }
      this.initialSettings = {
        path: '',
        login: '',
        password: ''
      }
      this.csrfToken = ''
    }
  }
})