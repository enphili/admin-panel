<template>
    <Header
      :operationTitle="operationTitle[currentMenuItem]"
      :fileName="pageName"
      :pageTitle="pageTitle"
    ></Header>

    <LeftSideBar
      @selectPage="setMenuItem('SelectPage')"
      @selectBackups="setMenuItem('SelectBackups')"
      @editeHead="setMenuItem('EditeHead')"
      @editeText="setMenuItem('EditeText')"
      @editeImg="setMenuItem('EditeImg')"
      @goToSettings="setMenuItem('Settings')"
      :currentMenuItem
    />

    <iframe
      ref="adminIframe"
      :class="['iframe', {'short': isRightSideBarActive}]"
    ></iframe>

    <div :class="['right-sidebar', {'active': isRightSideBarActive}]">
      <KeepAlive>
        <component
          v-if="currentMenuItem && menuItems[currentMenuItem]"
          :is="menuItems[currentMenuItem]"
          :key="currentMenuItem"
          @selectPage="loadPageInIframe"
        />
      </KeepAlive>
    </div>
</template>

<script setup lang="ts">
import Header from '../components/Header.vue'
import LeftSideBar from '../components/LeftSideBar.vue'
import SelectPage from '../components/rightSideBar/SelectPage.vue'
import SelectBackups from '../components/rightSideBar/SelectBackups.vue'
import EditeHead from '../components/rightSideBar/EditeHead.vue'
import EditeText from '../components/rightSideBar/EditeText.vue'
import EditeImg from '../components/rightSideBar/EditeImg.vue'
import Settings from '../components/rightSideBar/Settings.vue'
import { ref } from 'vue'
import { useLoadIframe } from '../use/loadIframe.ts'
import { useHandleError } from '../use/handleError.ts'
import { ApiService } from '../service/ApiService.ts'
import { DOMService } from '../service/DOMService.ts'
import { TextService } from '../service/TextService'
import { ImageService } from '../service/ImageService.ts'
import {MetaService} from '../service/MetaService.ts'
import {FaviconService} from '../service/FaviconService.ts'

defineEmits<{
  authenticated: [value: boolean]
}>()

const isRightSideBarActive = ref(false)
const menuItems = {
  SelectPage,
  SelectBackups,
  EditeHead,
  EditeText,
  EditeImg,
  Settings
}
type MenuItemKey = keyof typeof menuItems
const currentMenuItem = ref<MenuItemKey | ''>('')
const operationTitle = {
  '': 'Начните редактирование, выбрав пункт на левой панели',
  SelectPage: 'Выбор страницы для редактирования',
  SelectBackups: 'Восстановление резервной копии',
  EditeHead: 'Редактирование раздела Head',
  EditeText: 'Редактирование текста',
  EditeImg: 'Редактирование изображений',
  Settings: 'Настройки панели управления'
}
const adminIframe = ref<HTMLIFrameElement | null>(null)
const virtualDOM = ref<Document | null>(null)
const pageName = ref<string>('')
const pageTitle = ref<string>('')

// Устанавливаем текущий пункт меню
const setMenuItem = (menuKey: MenuItemKey) => {
  if (currentMenuItem.value === menuKey) {
    // Если выбран тот же пункт меню, скрываем панель
    isRightSideBarActive.value = false
    currentMenuItem.value = ''
  } else {
    // Если выбран другой пункт меню, показываем панель и обновляем содержимое
    isRightSideBarActive.value = true // Панель остаётся видимой
    currentMenuItem.value = menuKey
  }
}

// Метод для активации режима редактирования
const enableEditing = () => {
  if (!adminIframe.value || !virtualDOM.value) return
  const iframeDoc = adminIframe.value.contentDocument
  if (!iframeDoc) return

  // Редактирование текста
  iframeDoc.body.querySelectorAll<HTMLElement>('text-editor').forEach(element => {
    const id = element.getAttribute('nodeId')
    const virtualElement = virtualDOM.value!.body.querySelector<HTMLElement>(`[nodeId="${id}"]`)
    if (id && virtualElement) {
      new TextService(element, virtualElement)
    }
  })

  // Редактирование изображений
  iframeDoc.body.querySelectorAll<HTMLElement>('[imgId]').forEach(element => {
    const id = element.getAttribute('imgId')
    const virtualElement = virtualDOM.value!.body.querySelector<HTMLElement>(`[imgId="${id}"]`)
    if (id && virtualElement) {
      new ImageService(element, virtualElement)
    }
  })

  // Редактирование метаданных
  new MetaService(virtualDOM.value!)

  // Редактирование favicons
  new FaviconService(virtualDOM.value!)
}

// Метод для инъекций стилей
const injectStyles = () => {
  if (!adminIframe.value) return
  const iframeDoc = adminIframe.value.contentDocument
  if (!iframeDoc) return

  const style = iframeDoc.createElement('style')
  style.innerHTML = `
    text-editor:hover {
      outline: 3px solid orange;
      outline-offset: 3px;
    }
    text-editor:focus {
      outline: 3px solid red;
      outline-offset: 3px;
    }
    [imgId]:hover {
      outline: 3px solid orange;
      outline-offset: 3px;
    }
    [imgId]:focus {
      outline: 3px solid red;
      outline-offset: 3px;
    }
  `
  iframeDoc.head.appendChild(style)
}

// Загрузка выбранной страницу в iframe
const loadPageInIframe = async (page: string) => {
  // Проверка наличия iframe
  if (!adminIframe.value) {
    useHandleError(new Error('iframe не найден'), `Загрузка страницы - ${page}`, 'error')
    return
  }

  try {
    // Нормализация пути: замена \ на / и удаление лишних символов и формирование URL для iframe
    const url = new URL(page, 'https://example')
    url.searchParams.set('hash', crypto.randomUUID()) // добавление хеша для избегания кэширования запроса
    const fileName = url.pathname.split('/').pop() || 'unknown.html'

    pageName.value = fileName // передаем название файла редактируемой страницы в header приложения

    // Получение и обработка HTML
    const htmlContent = await ApiService.getHtml(url.pathname + url.search)
    virtualDOM.value = DOMService.processDOM(htmlContent) // Сохраняем виртуальный DOM

    if (virtualDOM.value) {
      pageTitle.value = virtualDOM.value.title || '' // передаем title редактируемой страницы в header приложения
    }

    // Сохранение обработанного HTML во временный файл
    const tempPageRes = await ApiService.post<string>('api/save_temp_page.php', {
      html: DOMService.serializeDOMToStr(virtualDOM.value), // Сериализуем DOM обратно в строку HTML
      fileName
    })
    const tempFilePath = tempPageRes.data || ''
    if (!tempFilePath) {
      console.error(`Не удалось сохранить временный файл для ${fileName}`)
      throw new Error('Не удалось сохранить временный файл')
    }

    // Загрузка временного файла в iframe
    await useLoadIframe(adminIframe.value, tempFilePath)

    // Удаление временного файла на сервере
    try {
      await ApiService.post('api/delete_temp_page.php', { filePath: tempFilePath })
    } catch (error) {
      console.error(error, `Ошибка удаления временного файла: ${tempFilePath}`)
      useHandleError(error, `Удаление файла`, 'warn')
    }

    enableEditing() // Активируем режим редактирования
    injectStyles() // Инжектируем стили

  }
  catch (error) {
    useHandleError(error, `Загрузка страницы - ${page}`, 'error')
  }
}

</script>

<style>
.right-sidebar {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 0;
  height: calc(100vh - var(--header-height));
  border-top: 1px solid var(--lines);
  background: var(--main-color);
  overflow-x: hidden;
  overflow-y: scroll;
  transition: width 0.1s ease;
  z-index: 20;
}
.right-sidebar.active {
  width: var(--right-sidebar-width);
  padding: 30px 20px;
}
.right-sidebar::-webkit-scrollbar {
  width: 8px;
}
.right-sidebar::-webkit-scrollbar-track {
  border-radius: 4px;
  background: var(--main-color);
  transition: background-color 0.3s ease;
}
.right-sidebar::-webkit-scrollbar-thumb {
  background-color: var(--main-color);
  border-radius: 4px;
  transition: background-color 0.3s ease;
}
.right-sidebar:hover::-webkit-scrollbar-thumb {
  background: var(--main-color-hover);
}
.iframe {
  margin: var(--header-height) auto -3px var(--left-sidebar-collapse-width);
  width: calc(100% - var(--left-sidebar-collapse-width));
  height: calc(100vh - var(--header-height));
  border: none;
  box-sizing: border-box;
  transition: margin-right 0.1s ease;
}
.iframe.short {
  width: calc(100% - var(--right-sidebar-width) - var(--left-sidebar-collapse-width));
}
</style>