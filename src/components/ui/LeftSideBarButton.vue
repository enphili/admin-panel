<template>
    <button
      :class="[isMenuButton ? 'sidebar-menu-btn' : 'sidebar-toggle-btn', {'current': selected}]"
      type = 'button'
    >
      <div :class="[isMenuButton ? 'menu-icon' : 'toggle-icon']">
        <component :is="getIconComponent(iconName)"></component>
      </div>
      <span v-if="text" class="tooltip">{{ text }}</span>
    </button>
</template>

<script setup lang="ts">
import ArrowIcon from './ArrowIcon.vue'
import ListIcon from './ListIcon.vue'
import BackupIcon from './BackupIcon.vue'
import CodeIcon from './CodeIcon.vue'
import TextIcon from './TextIcon.vue'
import ImgIcon from './ImgIcon.vue'
import SettingsIcon from './SettingsIcon.vue'

interface IProps {
  text?: string,
  selected?: boolean,
  iconName: string,
  isMenuButton: boolean,
}

const {text, selected, iconName, isMenuButton} = defineProps<IProps>()

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'arrow':
      return ArrowIcon
    case 'list':
      return ListIcon
    case 'backup':
      return BackupIcon
    case 'code':
      return CodeIcon
    case 'text':
      return TextIcon
    case 'img':
      return ImgIcon
    case 'settings':
      return SettingsIcon
    default:
      return null
  }
}
</script>

<style>
.sidebar-toggle-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  border: none;
  background: none;
  outline: none;
  cursor: pointer;
  transform: rotate(180deg);
  transition: background-color .2s ease;
}
.sidebar-toggle-btn svg {
  width: 20px;
  height: 20px;
}
.sidebar-toggle-btn svg path {
  stroke: var(--font-color);
}
.sidebar-toggle-btn:hover {
  background-color: var(--main-color-hover);
}
.sidebar.collapse .sidebar-toggle-btn {
  transform: rotate(0);
  align-self: center;
}
.sidebar-menu-btn {
  position: relative;
  display: flex;
  align-items: center;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  text-wrap: nowrap;
  color: var(--font-color);
  background: none;
  cursor: pointer;
  transition: color 0.2s ease;
}
.sidebar-menu-btn.current {
  color: var(--accent);
}
.toggle-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
}
.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  width: 25px;
  margin-right: 10px;
}
.sidebar.collapse .menu-icon {
  margin-right: 0;
}
.sidebar.collapse .tooltip {
  position: absolute;
  top: 50%;
  left: 130%;
  transform: translateY(-50%);
  background-color: var(--font-color);
  color: var(--main-color);
  padding: 5px 10px;
  border: 1px solid var(--main-color);
  font-size: 12px;
  border-radius: 5px;
  white-space: nowrap;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transition: opacity, width 0.3s ease;
  z-index: 100;
}
.sidebar.collapse .sidebar-menu-btn:hover {
  background-color: var(--main-color-hover);
}
.sidebar.collapse .sidebar-menu-btn:hover .tooltip {
  opacity: 1;
  visibility: visible;
}
.sidebar.collapse .sidebar-menu-btn {
  justify-content: center;
  border-radius: 5px;
}
.sidebar-menu-btn svg {
  width: 17px;
  height: 17px;
}
.sidebar-menu-btn svg path, .sidebar-menu-btn svg rect {
  fill: var(--font-color);
}
.sidebar-menu-btn.current svg path, .sidebar-menu-btn.current svg rect {
  fill: var(--accent);
}
.sidebar.collapse .sidebar-menu-btn svg {
  margin-right: 0;
}
</style>