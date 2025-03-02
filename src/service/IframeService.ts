import {useHandleError} from '../use/handleError.ts'
import {ApiService} from './ApiService.ts'
import {DOMService} from './DOMService.ts'
import {TextService} from './TextService.ts'
import {ImageService} from './ImageService.ts'
import {useEditorStore} from '../store/editorStore.ts'


export class IframeService {
  private readonly iframe: HTMLIFrameElement
  private virtualDOM: Document | null = null
  private iframeDoc: Document | null = null
  pageName = ''
  pageTitle = ''
  private linkClickHandler: ((event: Event) => void) | null = null // Свойство для хранения обработчика блокировки кликов по ссылкам
  private formSubmitHandler: ((event: Event) => void) | null = null // Свойство для хранения обработчика блокировки отправки форм
  private clickHandler: ((event: MouseEvent) => void) | null = null // Свойство для хранения обработчика
  private activeService: TextService | ImageService | null = null
  
  constructor(iframe: HTMLIFrameElement) {
    this.iframe = iframe
  }
  
  private async loadIframe(url: string): Promise<void> {
    if (!this.iframe) throw new Error('Iframe не найден')
    
    return new Promise((resolve, reject) => {
      try {
        this.iframe.src = url
        this.iframe.onload = () => {
          this.iframeDoc = this.iframe.contentDocument
          
          // После успешной загрузки iframe инициализируем блокировку кликов по ссылкам и кнопкам
          this.blockInteractivity()
          
          resolve()
        }
        this.iframe.onerror = () => {
          reject(new  Error('Не удалось загрузить iframe'))
        }
      }
      catch (e) {
        reject(e)
      }
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
        useHandleError(error, 'Ошибка удаления временного файла', 'warn')
      }
      
    } catch (error) {
      useHandleError(error, `Загрузка страницы - ${page}`, 'error')
    }
  }
  
  // добавляем стили подсвечивающие редактируемый элемент
  injectStyles(type: 'text' | 'img'): void {
    if (!this.iframeDoc) return
    
    let styleId: string
    let styleContent: string
    
    switch (type) {
      case 'text':
        styleId = 'text-editor-styles'
        styleContent = `
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
        break
      case 'img':
        styleId = 'img-editor-styles'
        styleContent = `
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
        break
      default:
        return
    }
    
    // Проверяем, существует ли уже стиль с таким id
    const existingStyle = this.iframeDoc.getElementById(styleId)
    if (existingStyle) {
      existingStyle.innerHTML = styleContent
    }
    else {
      const style = this.iframeDoc.createElement('style')
      style.id = styleId
      style.innerHTML = styleContent
      this.iframeDoc.head.appendChild(style)
    }
    
    // Если тип 'img', добавляем tabindex="0" для всех img внутри [imgId]
    if (type === 'img') {
      this.iframeDoc.querySelectorAll('[imgId] img').forEach(img => img.setAttribute('tabindex', '0'))
    }
  }
  
  // метод для блокировки кликов на ссылки и кнопки внутри iframe
  private blockInteractivity(): void {
    if (!this.iframeDoc) return
    
    // Блокируем клики на ссылки
    this.linkClickHandler = (event: Event) => {
      const target = event.target as HTMLElement
      const linkOrButton = target.closest('a, button')
      
      // Проверяем, является ли цель клика ссылкой (<a>) или кнопкой (<button>)
      if (linkOrButton) {
        event.preventDefault() // Предотвращаем стандартное поведение
        useHandleError(
          new Error(`В режиме редактирования клики по ${linkOrButton.tagName.toLowerCase()} заблокированы`),
          'Блокировка интерактивности',
          'warn'
        )
      }
    }
    
    // Блокируем отправку форм
    this.formSubmitHandler = (event: Event) => {
      event.preventDefault() // Предотвращаем отправку формы
      useHandleError(
        new Error('В режиме редактирования отправка форм заблокирована'),
        'Блокировка интерактивности',
        'warn'
      )
    }
    
    // Добавляем обработчики
    this.iframeDoc.addEventListener('click', this.linkClickHandler, { capture: true })
    this.iframeDoc.addEventListener('submit', this.formSubmitHandler, { capture: true })
  }
  
  // метод для активации режима редактирования
  enableEditing(type: 'text' | 'img', service: TextService | ImageService): void {
    if (!this.iframeDoc || !this.virtualDOM) return
    
    // Вставляем стили редактирования текста или изображений
    this.injectStyles(type)
    
    this.activeService = service
    
    // Определяем селектор и атрибут в зависимости от того что выбрано текст или изображение
    const selector = type === 'text' ? 'text-editor' : '[imgId]'
    const attribute = type === 'text' ? 'nodeId' : 'imgId'
    
    // Удаляем предыдущие обработчики, если они есть
    if (this.clickHandler) {
      this.iframeDoc.body.removeEventListener('click', this.clickHandler)
      this.clickHandler = null
    }
    
    // Создаем новый обработчик на редактируемый элемент
    this.clickHandler = (event: MouseEvent) => {
      const element = (event.target as HTMLElement).closest<HTMLElement>(selector)
      if (!element) return
      
      event.preventDefault()
      const id = element.getAttribute(attribute)
      const virtualElement = this.virtualDOM!.body.querySelector<HTMLElement>(`[${attribute}="${id}"]`)
      
      if (id && virtualElement) {
        const editorState = useEditorStore()
        
        if (this.activeService) this.activeService.startEditing(element, virtualElement)
        
        // Устанавливаем режим редактирования и активный элемент
        editorState.setEditMode(type)
        editorState.setActiveElement(element)
      } else {
        useHandleError(
          new Error(`Элемент с атрибутом ${attribute}=${id} не найден в виртуальном DOM`),
          'Редактирование элемента',
          'warn'
        );
      }
    }
    
    // Добавляем новый обработчик
    this.iframeDoc.body.addEventListener('click', this.clickHandler)
  }
  
  // метод для деактивации режима редактирования
  disableEditing(type: 'text' | 'img' | 'all'): void {
    if (!this.iframeDoc) return
    
    // Удаление стилей из iframe
    if (type === 'text' || type === 'all') {
      this.iframeDoc.querySelector('style#text-editor-styles')?.remove()
    }
    if (type === 'img' || type === 'all') {
      this.iframeDoc.querySelector('style#img-editor-styles')?.remove()
    }
    
    // Удаляем обработчики, если они есть
    if (this.clickHandler) {
      this.iframeDoc.body.removeEventListener('click', this.clickHandler)
      this.clickHandler = null
    }

    if (type === 'text') {
      if (this.activeService) this.activeService.stopEditing()
    }
    if (type === 'img') {
      // state.destroyImgService() пока его нет , добавить позже
    }
    if (type === 'all') {
      if (this.activeService) this.activeService.stopEditing()
      // state.destroyImgService() пока его нет , добавить позже
    }
    
    this.activeService = null
  }
  
  // Очистка ссылок, обработчиков и прочего перед удалением экземпляра
  destroy(): void {
    this.disableEditing('all')
    if (this.iframeDoc && this.linkClickHandler) {
      this.iframeDoc.removeEventListener('click', this.linkClickHandler, { capture: true })
    }
    if (this.iframeDoc && this.formSubmitHandler) {
      this.iframeDoc.removeEventListener('submit', this.formSubmitHandler, { capture: true })
    }
    this.clickHandler = null
    this.linkClickHandler = null
    this.formSubmitHandler = null
    this.iframeDoc = null
    this.virtualDOM = null
  }
}
