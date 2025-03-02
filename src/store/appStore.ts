import { defineStore } from 'pinia'
import { AuthService } from '../service/AuthService.ts'
import { IframeService } from '../service/IframeService.ts'
import { TextService } from '../service/TextService.ts'
import { ImageService } from '../service/ImageService.ts'
import { useHandleError } from '../use/handleError.ts'

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
  textService: TextService | null
  imageService: ImageService | null
  // ... будет дополняться полями
}

// Создание экземпляра AuthService
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
    iframeService: null,
    textService: null,
    imageService: null,
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
    
    // уничтожение старого экземпляра IframeService
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
    
    // создание нового экземпляра TextService
    createTextService(): TextService {
      if (!this.textService) this.textService = new TextService()
      return <TextService>this.textService
    },
    
    // создание нового экземпляра ImageService
    createImageService(): ImageService {
      if (!this.imageService) this.imageService = new ImageService()
      return this.imageService
    },
    
    // активация режима редактирования
    activateEditMode(type: 'text' | 'img') {
      if (!this.iframeService) return
      
      const service = type === 'text'
      ? this.createTextService()
      : this.createImageService()
      
      this.iframeService.enableEditing(type, service)
    },
    
    // деактивация режима редактирования
    deactivateEditMode(mode: 'text' | 'img' | 'all') {
      if (!this.iframeService) return

      if (mode === 'all') {
        this.iframeService.disableEditing('text')
        this.iframeService.disableEditing('img')
      } else {
        this.iframeService.disableEditing(mode)
      }
    },
  }
})
