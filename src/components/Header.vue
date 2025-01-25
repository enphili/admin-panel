<template>
  <header class="fl-row header">
    <div class="fl-row">
      <h2 class="header__title">Панель редактирования</h2>
      <div class="fl-row header__page-info">
        <p class="header__page-title">Профессиональный ремонт квартир</p>
        <p class="header__file-name">index.html</p>
      </div>
    </div>
    <h3 class="header__operation-title">
      {{ operationTitle }}
    </h3>
    <div class="fl-row header__actions">
      <div class="header__theme-toggle">
        <label class="toggle">
          <input
            type="checkbox"
            id="theme-switch"
            v-model="isDarkMode"
            @change="toggleTheme(isDarkMode)"
          />
          <span class="slider"></span>
        </label>
      </div>
      <AppButton text="Сохранить" class="filled-btn"></AppButton>
      <AppButton text="Выйти" class="outline-btn"></AppButton>
    </div>
  </header>
</template>

<script setup lang="ts">
import AppButton from './ui/AppButton.vue'
import {initTheme, toggleTheme} from '../use/useTheme.ts'

defineProps<{
  operationTitle: string
}>()

const isDarkMode = initTheme()


</script>

<style>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  justify-content: space-between;
  height: var(--header-height);
  width: 100%;
  padding: 0 20px;
  background: var(--main-color);
}
.header__title {
  color: var(--font-color);
  font-size: 12px;
  line-height: 15px;
  font-weight: normal;
  white-space: nowrap;
}
.header__page-info {
  margin-left: 50px;
}
.header__page-title {
  position: relative;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--font-color-transparent);
  font-size: 12px;
  line-height: 15px;
}
.header__page-title::after {
  content: '/';
  position: absolute;
  right: 0;
}
.header__file-name {
  padding-left: 3px;
  font-size: 12px;
  line-height: 15px;
  font-weight: bold;
  color: var(--font-color);
}
.header__operation-title {
  min-width: 336px;
  padding: 0 20px;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  color: var(--font-color);
}
.header__theme-toggle {
  margin-right: 50px;
}
.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}
.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--accent);
  border-radius: 25px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 2px;
  background-color: white;
  background-image: url("/image/sun.svg");
  background-repeat: no-repeat;
  background-position: center;
  transition: 0.4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: var(--accent-hover);
}
input:checked + .slider:before {
  background-image: url("/image/moon.svg");
  transform: translateX(25px);
}
.outline-btn {
  margin-left: 15px;
}
@media screen and (max-width: 1110px) {
  .header__page-title {
    display: none;
  }
}
@media screen and (max-width: 960px) {
  .header__title {
    display: none;
  }
  .header__page-info {
    margin-left: 0;
  }
}
@media screen and (max-width: 760px) {
  .header__operation-title {
    display: none;
  }
}
</style>