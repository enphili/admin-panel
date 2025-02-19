export class TextService {
  private readonly element: HTMLElement // Основной элемент, который редактируется
  private readonly virtualElement: HTMLElement // Виртуальный элемент для хранения копии текста
  private readonly observer: MutationObserver // Наблюдатель за изменениями в элементе
  private history: string[] = [] // История изменений текста
  private historyIndex: number = -1 // Индекс текущего состояния в истории
  private isEditing: boolean = false // Флаг состояния редактирования
  private isReadonly: boolean = false // Флаг состояния только для чтения
  
  // Ссылки на обработчики событий для корректного удаления
  // чтобы не создавать новые привязанные функции каждый раз
  // и не использовать bind для привязки контекста
  private readonly clickHandler: (e: MouseEvent) => void
  private readonly blurHandler: () => void
  private readonly inputHandler: () => void
  private readonly keyDownHandler: (e: KeyboardEvent) => void
  private readonly pasteHandler: (e: ClipboardEvent) => void
  
  constructor(element: HTMLElement, virtualElement: HTMLElement) {
    this.element = element
    this.virtualElement = virtualElement
    
    // Создаем наблюдателя за изменениями в элементе
    this.observer = new MutationObserver(mutationsList => {
      for (const mutation of mutationsList) {
        // Если изменились символы или дочерние элементы, фиксируем изменения
        if (mutation.type === 'characterData' || mutation.type === 'childList') {
          this.onTextEdit()
        }
      }
    })
    
    // Привязка обработчиков событий
    this.clickHandler = e => this.onClick(e)
    this.blurHandler = () => this.onBlur()
    this.inputHandler = () => this.onTextEdit()
    this.keyDownHandler = e => this.onKeyDown(e)
    this.pasteHandler = e => this.onPaste(e)
    
    this.init()
    this.setupObserver()
  }
  
  private init(): void { // Добавляем обработчики событий к основному элементу
    this.element.addEventListener('click', this.clickHandler)
    this.element.addEventListener('blur', this.blurHandler)
    this.element.addEventListener('input', this.inputHandler)
    this.element.addEventListener('keydown', this.keyDownHandler)
    this.element.addEventListener('paste', this.pasteHandler)
  }
  
  private setupObserver(): void {
    // Начинаем отслеживать изменения в элементе
    this.observer.observe(this.element, {
      childList: true, // Отслеживание изменений в дочерних элементах
      characterData: true, // Изменения в текстовом содержимом
      subtree: true // Отслеживание изменений в дочерних узлах
    })
  }
  
  private onClick(e: MouseEvent): void {
    if (this.isReadonly) return // Если режим только чтения - ничего не делаем
    
    // Отключаем стандартное поведение кнопок и ссылок, если не зажат Meta (Windows) / Option (Mac)
    if ((this.element.tagName === 'A' || this.element.tagName === 'BUTTON') && !e.metaKey) {
      e.preventDefault()
    }
    
    this.startEditing()
  }
  
  private startEditing(): void { // Активируем режим редактирования
    this.isEditing = true
    this.element.contentEditable = 'true'
    this.element.focus()
  }
  
  private onBlur(): void {
    this.stopEditing() // При потере фокуса выключаем режим редактирования
  }
  
  private stopEditing(): void { // Деактивируем режим редактирования
    this.isEditing = false
    this.element.removeAttribute('contenteditable')
  }
  
  private onTextEdit(): void { // Обновляем виртуальный элемент и сохраняем изменения в историю
    this.virtualElement.textContent = this.element.textContent
    this.saveToHistory()
  }
  
  private onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') { // Деактивируем режим редактирования при нажатии Enter
      e.preventDefault()
      this.stopEditing()
      return
    }
    if (e.ctrlKey && e.key === 'z') { // шаг назад по истории
      this.undo()
      return
    }
  }
  
  private async onPaste(e: ClipboardEvent): Promise<void> {
    e.preventDefault()
    try {
      // Получаем текст из буфера обмена и вставляем его
      const text = await navigator.clipboard.readText()
      this.insertTextAtCursor(text)
    } catch (error) {
      console.error('Не удалось вставить текст из буфера обмена:', error)
    }
  }
  
  private insertTextAtCursor(text: string): void {
    const selection = document.getSelection() // Получаем текущий объект выделения текста в документе
    
    // Проверяем, что есть выделенный текст и хотя бы один активный диапазон (range)
    // Если нет - ничего не делаем
    if (!selection || selection.rangeCount === 0) return
    
    const range = selection.getRangeAt(0) // Берем первый выделенный диапазон (range) из selection
    range.deleteContents() // Удаляем содержимое текущего выделенного диапазона, если что-то было выделено
    
    const textNode = document.createTextNode(text) // Создаем новый текстовый узел с переданным текстом
    range.insertNode(textNode) // Вставляем новый текстовый узел на место курсора (или заменяем выделенный текст)
    
    // Устанавливаем курсор сразу после вставленного текста
    range.setStartAfter(textNode)
    range.setEndAfter(textNode)
    
    // Очищаем текущее выделение и добавляем новый диапазон, который содержит только что вставленный текст
    selection.removeAllRanges()
    selection.addRange(range)
  }
  
  private saveToHistory(): void {
    // Очищаем историю, если перемещаемся в прошлое
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1)
    }
    // Добавляем текущее состояние в историю
    this.history.push(this.element.textContent || '')
    this.historyIndex++
    
    // Ограничение истории до 100 записей
    if (this.history.length > 100) {
      this.history.shift()
      this.historyIndex--
    }
  }
  
  private undo(): void {
    if (this.historyIndex > 0) {
      this.historyIndex--
      this.element.textContent = this.history[this.historyIndex]
      this.virtualElement.textContent = this.history[this.historyIndex]
    }
  }
  
  enableEditing(): void {
    this.isReadonly = false
  }
  
  disableEditing(): void {
    this.isReadonly = true
  }
  
  // Очистка ресурсов
  destroy(): void  {
    this.observer.disconnect()
    this.element.removeEventListener('click', this.clickHandler)
    this.element.removeEventListener('blur', this.blurHandler)
    this.element.removeEventListener('input', this.inputHandler)
    this.element.removeEventListener('keydown', this.keyDownHandler)
    this.element.removeEventListener('paste', this.pasteHandler)
  }
}