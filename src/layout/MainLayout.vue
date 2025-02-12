<template>
    <Header
      :operationTitle="operationTitle[currentMenuItem]"
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
import {ref} from 'vue'
import {useHandleError} from '../use/handleError.ts'
import { ApiService } from '../service/ApiService.ts'
import {useLoadIframe} from '../use/loadIframe.ts'

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

// Загружаем выбранную страницу в iframe
const loadPageInIframe = async (page: string) => {
  // Нормализуем путь: заменяем \ на / и убираем лишние символы
  const normalizedPath = page.replace(/\\/g, '/').replace('//', '/')
  const fullPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}` // Формируем URL для iframe

  try {
    // Загружаем содержимое страницы через GET-запрос
    const htmlContent = await ApiService.getHtml(fullPath)
    const fileName = normalizedPath.split('/').pop() || 'unknown.html'

    // Сохраняем содержимое во временный файл через POST-запрос
    const saveResponse = await ApiService.post<string>(
      'api/save_temp_page.php',
      { html: htmlContent, fileName}
    )

    if (!saveResponse.data) {
      throw new Error('Не удалось сохранить временный файл')
    }

    // Загружаем временный файл в iframe
    if (!adminIframe.value) throw new Error('iframe не найден')
    await useLoadIframe(adminIframe.value, saveResponse.data)
  }
  catch (error) {
    useHandleError(error, 'Редактируемая страница', 'error')
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