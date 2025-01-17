<template>
  <nav :class="['sidebar', {'collapse': isCollapse}]">
    <button class="sidebar-toggle-btn" @click.prevent="collapse">
      <img src="/image/arrow.svg" width="13" height="12" alt="Развернуть меню">
    </button>

    <div class="sidebar-section">
      <h3 class="sidebar-section-title">Управление страницей</h3>
      <ul class="sidebar-menu">
        <li>
          <button class="sidebar-menu-btn">
            <img src="/image/list.svg" width="17" height="10" alt="Иконка пункта меню выбор страницы">
            <span class="tooltip">Выбор страницы</span>
          </button>
        </li>
        <li>
          <button class="sidebar-menu-btn">
            <img src="/image/backup.svg" width="17" height="13" alt="Иконка пункта меню Backup's">
            <span class="tooltip">Backup's</span>
          </button>
        </li>
      </ul>
    </div>

    <div class="sidebar-section">
      <h3 class="sidebar-section-title">Контент страницы</h3>
      <ul class="sidebar-menu">
        <li>
          <button class="sidebar-menu-btn">
            <img src="/image/code.svg" width="17" height="13" alt="Иконка пункта меню head">
            <span class="tooltip">Раздел head</span>
          </button>
        </li>
        <li>
          <button class="sidebar-menu-btn">
            <img src="/image/text.svg" width="14" height="15" alt="Иконка пункта меню текст">
            <span class="tooltip">Текст</span>
          </button>
        </li>
        <li>
          <button class="sidebar-menu-btn">
            <img src="/image/img.svg" width="17" height="15" alt="Иконка пункта меню изображения">
            <span class="tooltip">Изображения</span>
          </button>
        </li>
      </ul>
    </div>

    <div class="sidebar-section">
      <h3 class="sidebar-section-title">Управление панелью</h3>
      <ul class="sidebar-menu">
        <li>
          <button class="sidebar-menu-btn">
            <img src="/image/settings.svg" width="17" height="17" alt="Иконка настроек">
            <span class="tooltip">Настройки</span>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {ref} from 'vue'

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
  transition: width 0.2s ease;
  z-index: 99;
}
.sidebar.collapse {
  width: var(--left-sidebar-collapse-width);
}
.sidebar-toggle-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
  width: 25px;
  height: 25px;
  border-radius: 5px;
  border: none;
  background: none;
  outline: none;
  cursor: pointer;
  transform: rotate(180deg);
}
.sidebar.collapse .sidebar-toggle-btn {
  transform: rotate(0);
  align-self: center;
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
.sidebar-menu-btn {
  position: relative;
  display: flex;
  align-items: center;
  padding: 3px 0;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  text-wrap: nowrap;
  color: var(--font-color);
  background: none;
  cursor: pointer;
}
.sidebar.collapse .tooltip {
  position: absolute;
  top: 50%;
  left: 130%;
  transform: translateY(-50%);
  background-color: var(--font-color);
  color: var(--body-color);
  padding: 5px 10px;
  font-size: 12px;
  border-radius: 5px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
  z-index: 100;
}
.sidebar.collapse .sidebar-menu-btn:hover .tooltip {
  opacity: 1;
  visibility: visible;
}
.sidebar.collapse .sidebar-menu-btn {
  justify-content: center;
}
.sidebar-menu-btn img {
  width: 17px;
  height: 17px;
  margin-right: 10px;
}
.sidebar.collapse .sidebar-menu-btn img {
  margin-right: 0;
}
</style>