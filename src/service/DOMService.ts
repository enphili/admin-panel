export class DOMService {
  // Парсим строки HTML в объект Document
  static parseStrToDOM(html: string): Document {
    const parser = new DOMParser()
    // Поддерживает только HTML-документы (не XML)
    const doc = parser.parseFromString(html, 'text/html') // 'text/html' - только HTML
    
    // Проверяем наличие тега <parsererror> (для безопасности, несмотря на 'text/html')
    const parserError = doc.querySelector('parsererror')
    if (parserError) {
      throw new Error(`Ошибка парсинга HTML: ${parserError.textContent || 'Invalid HTML'}`)
    }
    
    // Дополнительная проверка на пустой документ
    if (!doc.body || !doc.body.innerHTML.trim()) {
      throw new Error('Недопустимый HTML: Тело документа пустое или неправильно сформировано')
    }
    
    return doc
  }
  
  // Оборачиваем текстовые узлы в элемент <text-editor>
  static wrapTextNodes(dom: Document, excludeTags: string[] = ['SCRIPT', 'STYLE']): Document { // Исключает текстовые узлы внутри тегов SCRIPT и STYLE по умолчанию
    const walker = dom.createTreeWalker(
      dom.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: node => {
          // Пропускаем текстовые узлы внутри исключенных тегов
          if (node.nodeValue?.trim() && !excludeTags.includes(node.parentNode?.nodeName || '')) {
            return NodeFilter.FILTER_ACCEPT
          }
          return NodeFilter.FILTER_SKIP
        }
      }
    )
    
    let node: Node | null
    
    while ( (node = walker.nextNode()) ) {
      if (
        node.nodeType === Node.TEXT_NODE &&
        node.nodeValue?.trim() &&
        node.parentNode &&
        !(node.parentNode.nodeName === 'TEXT-EDITOR') // Проверка на повторное оборачивание
      ) {
        const wrapper = dom.createElement('text-editor')
        wrapper.setAttribute('nodeId', crypto.randomUUID()) // Генерация уникального ID
        wrapper.contentEditable = 'true' // Добавляем атрибут для редактирования
        
        // Заменяем текстовый узел оберткой
        node.parentNode.replaceChild(wrapper, node)
        wrapper.appendChild(node)
      }
    }
    
    return dom
  }
  
  // Оборачиваем изображения в <div> с уникальным imgId
  static wrapImages(dom: Document): Document {
    const images = dom.querySelectorAll('img')
    
    images.forEach(img => {
      // Проверяем, не является ли родительский элемент уже оберткой
      if (img.parentNode instanceof Element && img.parentNode?.hasAttribute('imgId')) {
        return // Пропускаем изображение, если оно уже обернуто
      }
      
      const wrapper = dom.createElement('div')
      wrapper.setAttribute('imgId', crypto.randomUUID())
      wrapper.classList.add('img-wrapper')
      
      // Определяем, находится ли изображение внутри <picture>
      const parentPicture = img.closest('picture')
      if (parentPicture && parentPicture.parentNode) {
        // Проверяем, не является ли родительский элемент <picture> уже обернутым
        if (parentPicture.parentNode instanceof Element && parentPicture.parentNode.hasAttribute('imgId')) {
          return // Пропускаем <picture>, если он уже обернут
        }
        
        // Оборачиваем весь <picture>
        parentPicture.parentNode.replaceChild(wrapper, parentPicture)
        wrapper.appendChild(parentPicture)
      }
      else if (img.parentNode) {
        // Оборачиваем только <img>, если оно вне <picture>
        img.parentNode.replaceChild(wrapper, img)
        wrapper.appendChild(img)
      }
    })
    
    return dom
  }
  
  // Сериализуем DOM обратно в строку HTML
  static serializeDOMToStr(dom: Document, fullDocument = true): string {
    let serializedHTML = fullDocument
    ? new XMLSerializer().serializeToString(dom) // Сериализация всего документа (включая DOCTYPE, <html>, <head>, <body>)
    : dom.body?.innerHTML || '' // Сериализация только содержимого <body>
    
    // Дополнительная проверка на валидность HTML
    const testDoc = new DOMParser().parseFromString(serializedHTML, 'text/html')
    if (!testDoc.body || !(testDoc.body instanceof HTMLElement) || !testDoc.body.innerHTML.trim()) {
      throw new Error('Ошибка сериализации: Получен некорректный HTML')
    }
    
    return serializedHTML
  }
  
  // Удаляем обертки <text-editor> и восстанавливаем оригинальные текстовые узлы
  static unWrapTextNodes(dom: Document): Document {
    dom.querySelectorAll('text-editor').forEach(textEditor => {
      // Проверяем, что textContent не пустой и содержит значимый текст
      const textContent = textEditor.textContent?.trim() || ''
      if (textEditor.parentNode) {
        if (textContent) {
          textEditor.parentNode.replaceChild(dom.createTextNode(textContent), textEditor) // Заменяем обертку на текстовый узел
        }
        else {
          // Если текст пустой, просто удаляем обертку без создания текстового узла
          textEditor.remove()
        }
      }
    })
    
    return dom
  }
  
  // Удаляет обертки <div> вокруг изображений и восстанавливает их оригинальное положение
  static unWrapImages(dom: Document): Document {
    // Находим все обертки с атрибутом imgId
    dom.querySelectorAll('[imgId]').forEach(wrapper => {
      // Проверяем, содержит ли обертка <picture>
      const picture = wrapper.querySelector('picture')
      if (picture && wrapper.parentNode) {
        // Если обертка содержит <picture>
        wrapper.parentNode.replaceChild(picture, wrapper)
      }
      else {
        // Если обертка содержит только <img>
        const img = wrapper.querySelector('img')
        if (img instanceof HTMLImageElement && wrapper.parentNode) {
          wrapper.parentNode.replaceChild(img, wrapper)
        }
        else {
          // Пропускаем некорректные обертки и выводим предупреждение
          console.warn(`Некорректная обертка найдена и пропущена:`, wrapper.outerHTML || wrapper.textContent)
        }
      }
    })
    
    return dom
  }
  
  // Метод обработки DOM
  static processDOM = (html: string) => {
    let dom = this.parseStrToDOM(html) // Преобразуем строку HTML в объект DOM
    return this.wrapImages(this.wrapTextNodes(dom)) // Оборачиваем текстовые узлы и изображения
  }
}
