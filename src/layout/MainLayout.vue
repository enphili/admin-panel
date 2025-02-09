<template>
  <div>
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

    <div :class="['iframe', {'short': isRightSideBarActive}]"></div>

    <div :class="['right-sidebar', {'active': isRightSideBarActive}]">
      <KeepAlive>
        <component
          v-if="currentMenuItem && menuItems[currentMenuItem]"
          :is="menuItems[currentMenuItem]"
          :key="currentMenuItem"
        />
      </KeepAlive>
    </div>
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

const setMenuItem = (menuKey: MenuItemKey) => {
  if (menuItems[menuKey]) {
    isRightSideBarActive.value = true
    currentMenuItem.value = menuKey
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
  margin-top: var(--header-height);
  margin-left: var(--left-sidebar-collapse-width);
  margin-right: 0;
  transition: margin-right 0.1s ease;
}
.iframe.short {
  margin-right: var(--right-sidebar-width);
}
</style>