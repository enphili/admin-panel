import { defineStore } from 'pinia'
import { AuthService } from '../service/AuthService.ts'
import { IframeService } from '../service/IframeService.ts'
import {useHandleError} from '../use/handleError.ts'

interface State {
  hasChanges: boolean
  settings: {
    path: string
    login: string
    password: string
  }
  initialSettings: {
    path: string
    login: string
    password: string
  }
  csrfToken: string
  iframeService: IframeService | null
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
    csrfToken: '',
    iframeService: null
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
      this.iframeService = null
    },
    
    // создание нового экземпляра IframeService
    createIframeService(iframeElement: HTMLIFrameElement) {
      this.destroyIframeService() // Уничтожаем старый экземпляр
      this.iframeService = new IframeService(iframeElement)
    },
    
    // уничтожение старого экземпляр IframeService
    destroyIframeService() {
      if (this.iframeService) {
        this.iframeService.destroy()
        this.iframeService = null
      }
    },
    
    // загрузка выбранной страницы в iframe
    async loadPageInIframe(page: string) {
      if (!this.iframeService) return
      
      try {
        await this.iframeService.loadPage(page)
      } catch (error) {
        useHandleError(error, 'Загрузка во фрейм', 'error')
      }
    },
    
    // деактивация режима редактирования
    deactivateEditMode(mode: 'text' | 'img' | 'all') {
      if (!this.iframeService) return
      
      const modeActions = {
        text: () => this.iframeService!.disableTextEditing(),
        img: () => this.iframeService!.disableImgEditing(),
        all: () => {
          this.iframeService!.disableTextEditing()
          this.iframeService!.disableImgEditing()
        }
      }
      
      modeActions[mode]?.()
    },
    
  }
})