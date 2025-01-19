<template>
  <div>
    <Header></Header>

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
  overflow: hidden;
  transition: width 0.1s ease;
  z-index: 20;
}
.right-sidebar.active {
  width: var(--right-sidebar-width);
  padding: 30px 20px;
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