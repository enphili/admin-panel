import {useHandleError} from '../use/handleError.ts'
import {ApiService} from './ApiService.ts'
import {DOMService} from './DOMService.ts'
import {TextService} from './TextService.ts'
import {ImageService} from './ImageService.ts'

export class IframeService {
  private virtualDOM: Document | null = null
  private iframeDoc: Document | null = null
  pageName = ''
  pageTitle = ''
  
  constructor(private readonly iframe: HTMLIFrameElement) { }
  
  private async loadIframe(url: string): Promise<void> {
    if (!this.iframe) throw new Error('Iframe не найден')
    
    return new Promise((resolve, reject) => {
      try {
        this.iframe!.src = url
      }
      catch (e) {
        reject(e)
      }
      
      const maxTime = 60000
      const interval = 200
      let timerCount = 0
      
      const timer = setInterval(() => {
        if (!this.iframe!.contentDocument || this.iframe!.contentDocument.readyState === 'complete') {
          clearInterval(timer)
          this.iframeDoc = this.iframe.contentDocument
          return resolve()
        }
        
        if (timerCount * interval > maxTime) {
          clearInterval(timer)
          reject(new  Error('Не удалось загрузить iframe'))
        }
        
        timerCount++
      }, interval)
    })
  }
  
  async loadPage(page: string): Promise<void> {
    if (!this.iframe) { // Проверка наличия iframe
      useHandleError(new Error('iframe не найден'), `Загрузка страницы - ${page}`, 'error')
      return
    }
    
    try {
      // Нормализация пути: замена \ на / и удаление лишних символов и формирование URL для iframe
      const url = new URL(page, 'https://example')
      url.searchParams.set('hash', crypto.randomUUID()) // Добавление хеша для избегания кэширования запроса
      const fileName = url.pathname.split('/').pop() || 'unknown.html'
      
      // передаем название файла редактируемой страницы в header приложения
      this.pageName = fileName
      
      // Получение и обработка HTML
      const htmlContent = await ApiService.getHtml(url.pathname + url.search)
      this.virtualDOM = DOMService.processDOM(htmlContent) // Сохраняем виртуальный DOM
      
      if (this.virtualDOM) {
        this.pageTitle = this.virtualDOM.title || '' // передаем title редактируемой страницы в header приложения
      }
      
      // Сохранение обработанного HTML во временный файл
      const tempPageRes = await ApiService.post<string>('api/save_temp_page.php', {
        html: DOMService.serializeDOMToStr(this.virtualDOM), // Сериализуем DOM обратно в строку HTML
        fileName
      })
      
      const tempFilePath = tempPageRes.data || ''
      if (!tempFilePath) { // noinspection ExceptionCaughtLocallyJS
        throw new Error('Не удалось сохранить временный файл')
      }
      
      // Загрузка временного файла в iframe
      await this.loadIframe(tempFilePath)
      
      // Удаление временного файла на сервере
      try {
        await ApiService.post('api/delete_temp_page.php', { filePath: tempFilePath })
      } catch (error) {
        useHandleError(error, `Ошибка удаления временного файла}`, 'warn')
      }
      
      this.blockInteractivity()
      
    } catch (error) {
      useHandleError(error, `Загрузка страницы - ${page}`, 'error')
    }
  }
  
  private injectTextStyles(): void {
    if (!this.iframeDoc) return
    
    const style = this.iframeDoc.createElement('style')
    style.innerHTML = `
      text-editor:hover, text-editor:focus {
        outline-offset: 1px;
        position: relative;
        z-index: 1000;
      }
      text-editor:hover {
        outline: 2px solid orange;
      }
      text-editor:focus {
        outline: 2px solid red;
      }
    `
    this.iframeDoc.head.appendChild(style)
    
    // Добавляем tabindex="0" для всех img внутри [imgId]
    this.iframeDoc.querySelectorAll('[imgId] img').forEach(img => img.setAttribute('tabindex', '0'))
  }
  
  private injectImgStyles(): void {
    if (!this.iframeDoc) return
    
    const style = this.iframeDoc.createElement('style')
    style.innerHTML = `
      [imgId]:hover {
        outline: 2px solid orange;
      }
      [imgId]:has(img:focus) {
        outline: 2px solid red;
      }
      [imgId]:hover, [imgId]:has(img:focus) {
        outline-offset: -2px;
      }
    `
    this.iframeDoc.head.appendChild(style)
    
    // Добавляем tabindex="0" для всех img внутри [imgId]
    this.iframeDoc.querySelectorAll('[imgId] img').forEach(img => img.setAttribute('tabindex', '0'))
  }
  
  // метод для блокировки кликов на ссылки и кнопки внутри iframe
  private blockInteractivity(): void {
    if (!this.iframeDoc) return
    
    // Блокируем клики на ссылки
    this.iframeDoc.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement
      
      // Проверяем, является ли цель клика ссылкой (<a>) или кнопкой (<button>)
      const link = target.closest('a')
      const button = target.closest('button')
      if (link || button) {
        event.preventDefault() // Предотвращаем стандартное поведение
        useHandleError(new Error(
            `В режиме редактирования клики ${link ? 'по ссылкам' : 'по кнопкам'} заблокированы`),
          'Блокировка интерактивности',
          'warn')
      }
    })
    
    // Блокируем отправку форм
    this.iframeDoc.addEventListener('submit', (event: Event) => {
      event.preventDefault() // Предотвращаем отправку формы
      useHandleError(new Error('В режиме редактирования отправка форм заблокирована'), 'Блокировка интерактивности', 'warn')
    })
  }
  
  // метод для активации режима редактирования текста
  enableTextEditing(): void {
    if (!this.iframeDoc) return
    
    // Включаем инъекцию стилей и активацию сервисов
    this.injectTextStyles()
      
    // Редактирование текста
    this.iframeDoc.body.querySelectorAll<HTMLElement>('text-editor').forEach(element => {
      const id = element.getAttribute('nodeId')
      const virtualElement = this.virtualDOM!.body.querySelector<HTMLElement>(`[nodeId="${id}"]`)
      if (id && virtualElement) {
        new TextService(element, virtualElement)
      }
    })
  }
  
  // метод для активации режима редактирования изображений
  enableImgEditing(): void {
    if (!this.iframeDoc) return
    
    // Включаем инъекцию стилей и активацию сервисов
    this.injectImgStyles()
    
    // Редактирование изображений
    this.iframeDoc.body.querySelectorAll<HTMLElement>('[imgId]').forEach(element => {
      const id = element.getAttribute('imgId')
      const virtualElement = this.virtualDOM!.body.querySelector<HTMLElement>(`[imgId="${id}"]`)
      if (id && virtualElement) {
        new ImageService(element, virtualElement)
      }
    })
  }
  
  // Очистка ссылок, обработчиков и прочего перед удалением экземпляра
  destroy(): void {
    if (this.iframeDoc) this.iframeDoc = null
  }
}