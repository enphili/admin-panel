<template>
  <p class="subtitle">Выбрать файл backup'а</p>
  <ul class="pages-list">
    <li
      v-for="(backup, index) in backups"
      :key="index"
      @contextmenu.prevent="openContextMenu($event, index)"
    >
      <a
        href="#"
        class="page-link"
      >
        {{ `${index + 1}. ${backup}`}}
      </a>
    </li>
  </ul>
  <p class="subtitle second">Удалить все файлы backup для данной страницы</p>
  <AppButton text="Удалить" class="filled-btn" @click="removeAllBackups"></AppButton>

  <!-- Контекстное меню -->
  <Teleport to="body">
    <div
      v-show="contextMenu.visible"
      ref="menuRef"
      class="context-menu"
      :style="{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }"
    >
      <a v-if="contextMenu.fileIndex !== null" @click="deleteFile(contextMenu.fileIndex)">Удалить данный файл</a>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import AppButton from '../ui/AppButton.vue'
import {ref, onMounted, onBeforeUnmount} from 'vue'

const backups = ref([
  '10_01_2025-15.15-politica.html',
  '11_01_2025-19.28-politica.html',
  '11_01_2025-19.50-politica.html',
  '11_01_2025-20.15-politica.html',
  '11_01_2025-21.18-politica.html',
])

const menuRef = ref<HTMLElement | null>(null)

const contextMenu = ref<{
  x: number,
  y: number,
  visible: boolean,
  fileIndex: number | null
}>({
  visible: false,
  x: 0,
  y: 0,
  fileIndex: null
})

const removeAllBackups = () => backups.value = []

const openContextMenu = (event: MouseEvent, index: number | null) => {
  if (menuRef.value) {
    const menuRect = menuRef.value.getBoundingClientRect() // Получаем размеры меню
    const menuWidth = menuRect.width // Ширина контекстного меню
    const viewportWidth = document.documentElement.clientWidth // Видимая ширина окна

    let x = event.clientX
    let y = event.clientY

    // Если меню выходит за правую границу, корректируем координаты
    if (x + menuWidth > viewportWidth) {
      x = viewportWidth - menuWidth - 5 // Смещаем меню влево
    }

    // Устанавливаем позицию меню
    contextMenu.value = {
      visible: true,
      x,
      y,
      fileIndex: index
    }
  }
}

const closeContextMenu = () => contextMenu.value.visible = false

const closeOnClickOutside = (event: MouseEvent) => {
  if (contextMenu.value.visible && menuRef.value && !menuRef.value.contains(event.target as Node)) {
    closeContextMenu()
  }
}

const deleteFile = (index: number | null) => {
  if (index !== null) {
    backups.value.splice(index, 1)
    closeContextMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', closeOnClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeOnClickOutside)
})

</script>

<style>
.context-menu {
  position: fixed;
  min-width: 150px;
  padding: 8px;
  border-radius: var(--border-radius) 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: var(--main-color-hover);
  z-index: 100;
  overflow: hidden;
}
.context-menu a {
  display: block;
  padding: 8px;
  font-size: 11px;
  font-weight: normal;
  line-height: 12px;
  color: var(--font-color);
  text-decoration: none;
  text-wrap: nowrap;
  cursor: pointer;
  transition: color 0.2s ease;
}
</style>