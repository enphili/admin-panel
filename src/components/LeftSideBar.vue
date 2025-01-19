<template>
  <nav :class="['sidebar', {'collapse': isCollapse}]">

    <LeftSideBarButton
      :isMenuButton=false
      iconName="arrow"
      @click.prevent="collapse"
    />

    <div class="sidebar-section">
      <h3 class="sidebar-section-title">Управление страницей</h3>
      <ul class="sidebar-menu">
        <li>
          <LeftSideBarButton
            :isMenuButton=true
            :selected="currentMenuItem === 'SelectPage'"
            iconName="list"
            text="Выбор страницы"
            @click="$emit('selectPage')"
          />
        </li>
        <li>
          <LeftSideBarButton
            :isMenuButton=true
            :selected="currentMenuItem === 'SelectBackups'"
            iconName="backup"
            text="Backup's"
            @click="$emit('selectBackups')"
          />
        </li>
      </ul>
    </div>

    <div class="sidebar-section">
      <h3 class="sidebar-section-title">Контент страницы</h3>
      <ul class="sidebar-menu">
        <li>
          <LeftSideBarButton
            :isMenuButton=true
            :selected="currentMenuItem === 'EditeHead'"
            iconName="code"
            text="Раздел head"
            @click="$emit('editeHead')"
          />
        </li>
        <li>
          <LeftSideBarButton
            :isMenuButton=true
            :selected="currentMenuItem === 'EditeText'"
            iconName="text"
            text="Текст"
            @click="$emit('editeText')"
          />
        </li>
        <li>
          <LeftSideBarButton
            :isMenuButton=true
            :selected="currentMenuItem === 'EditeImg'"
            iconName="img"
            text="Изображения"
            @click="$emit('editeImg')"
          />
        </li>
      </ul>
    </div>

    <div class="sidebar-section">
      <h3 class="sidebar-section-title">Управление панелью</h3>
      <ul class="sidebar-menu">
        <li>
          <LeftSideBarButton
            :isMenuButton=true
            :selected="currentMenuItem === 'Settings'"
            iconName="settings"
            text="Настройки"
            @click="$emit('goToSettings')"
          />
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import LeftSideBarButton from './ui/LeftSideBarButton.vue'

defineEmits<{
  (e: 'selectPage'): void,
  (e:'selectBackups'): void,
  (e: 'editeHead'): void,
  (e: 'editeText'): void,
  (e: 'editeImg'): void,
  (e: 'goToSettings'): void
}>()

defineProps<{currentMenuItem: string}>()

const isCollapse = ref(false)

const collapse = () => isCollapse.value = !isCollapse.value
</script>


<style >
.sidebar {
  position: fixed;
  left: 0;
  bottom: 0;
  height: calc(100vh - var(--header-height));
  display: flex;
  flex-direction: column;
  font-stretch: expanded;
  gap: 30px;
  width: var(--left-sidebar-width);
  border-top: 1px solid var(--lines);
  padding: 20px;
  background: var(--main-color);
  transition: width 0.1s ease;
  z-index: 99;
}
.sidebar.collapse {
  width: var(--left-sidebar-collapse-width);
}
.sidebar-section-title {
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: bold;
  line-height: 15px;
  text-wrap: nowrap;
  color: var(--lines);
}
.sidebar.collapse .sidebar-section-title {
  width: 0;
  overflow: hidden;
}
.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>