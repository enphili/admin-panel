<template>
    <Header
      :operation-title="operationTitle"
      :file-name="pageName"
      :page-title="pageTitle"
    ></Header>

    <LeftSideBar
      @selectPage="setMenuItem('SelectPage')"
      @selectBackups="setMenuItem('SelectBackups')"
      @editeHead="setMenuItem('EditeHead')"
      @editeText="activateTextEditing"
      @editeImg="activateImgEditing"
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
import {computed, ref} from 'vue'
import {IframeService} from '../service/IframeService.ts'
import {useHandleError} from '../use/handleError.ts'

defineEmits<{ authenticated: [value: boolean] }>()

const isRightSideBarActive = ref(false)
const menuItems = { SelectPage, SelectBackups, EditeHead, EditeText, EditeImg, Settings }
const currentMenuItem = ref<keyof typeof menuItems | ''>('')

const adminIframe = ref<HTMLIFrameElement | null>(null)
const pageName = ref<string>('')
const pageTitle = ref<string>('')

const operationTitle = computed(() => ({
  '': 'Начните редактирование, выбрав пункт на левой панели',
  SelectPage: 'Выбор страницы для редактирования',
  SelectBackups: 'Восстановление резервной копии',
  EditeHead: 'Редактирование раздела Head',
  EditeText: 'Редактирование текста',
  EditeImg: 'Редактирование изображений',
  Settings: 'Настройки панели управления'
}[currentMenuItem.value] || ''))

const iframeService = ref<IframeService | null>(null)

// Устанавливаем текущий пункт меню
const setMenuItem = (menuKey: keyof typeof menuItems) => {
  currentMenuItem.value = currentMenuItem.value === menuKey ? '' : menuKey
    isRightSideBarActive.value = !!currentMenuItem.value
}

const loadPageInIframe = async (page: string) => {
  if (!adminIframe.value) return

  // Уничтожаем старый экземпляр перед созданием нового
  if (iframeService.value) {
    iframeService.value.destroy()
    iframeService.value = null
  }

  iframeService.value = new IframeService(adminIframe.value)

  try {
    await iframeService.value.loadPage(page)
    pageName.value = iframeService.value.pageName
    pageTitle.value = iframeService.value.pageTitle
  }
  catch (error) {
    useHandleError(error, 'Загрузка во фрейм', 'error')
  }
}

const activateTextEditing = async () => {
  setMenuItem('EditeText')

  if (!adminIframe.value) return
  if (!iframeService.value) return

  iframeService.value.enableTextEditing()
}

const activateImgEditing = () => {
  setMenuItem('EditeImg')

  if (!adminIframe.value) return
  if (!iframeService.value) return

  iframeService.value.disableTextEditing()
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
/*noinspection CssUnusedSymbol*/
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

/*noinspection CssUnusedSymbol*/
.iframe.short {
  width: calc(100% - var(--right-sidebar-width) - var(--left-sidebar-collapse-width));
}
</style>