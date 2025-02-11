<template>
  <p class="subtitle">Выбрать файл страницы</p>
  <ul class="pages-list">
    <li v-for="(page, index) in displayPages" :key="index">
      <a href="#" class="page-link" @click="openPage(pages[index])">
        {{ `${(index + 1).toString().padStart(2, '0')}. ${page}` }}
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ApiService } from '../../service/ApiService.ts'
import {handleError} from '../../use/useHandleError.ts'
import type {ApiResponse} from '../../types/apiResponse.ts'

const emit = defineEmits<{
  (event: 'selectPage', page: string): void // Эмитируем событие при выборе страницы
}>()

const pages = ref<string[]>([]) // Полные пути к файлам

// Функция для загрузки списка страниц с сервера
const fetchPages = async () => {
  try {
    const response: ApiResponse<string[]> = await ApiService.get('api/get_pages.php') // Обновляем список страниц
    pages.value = response.data
  } catch (error) {
    handleError(error, 'Список страниц', 'error')
  }
}

// Отображаемые названия файлов (без путей)
const displayPages = computed(() => {
  return pages.value.map(page => {
    // Заменяем все обратные слеши на прямые и извлекаем имя файла
    const normalizedPath = page.replace(/\\\\/g, '/').replace(/\\/g, '/')
    return normalizedPath.split('/').pop() || ''
  })
})

// Функция для выбора страницы
const openPage = (page: string) => {
  emit('selectPage', page) // Эмитируем событие с выбранным файлом
}

// Загружаем страницы при монтировании компонента
onMounted(() => {
  fetchPages()
})

</script>

<style>
.subtitle {
  margin-bottom: 20px;
  font-size: 12px;
  font-weight: normal;
  line-height: 15px;
  color: var(--font-color);
}
.pages-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 15px;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius) 5px;
  list-style: none;
  overflow-y: auto;
  overflow-x: hidden;
}
.pages-list li:hover a {
  color: var(--accent);
}
.second {
  margin-top: 30px;
}
.pages-list::-webkit-scrollbar {
  width: 8px;
}
.pages-list::-webkit-scrollbar-track {
  border-radius: 4px;
  background: var(--main-color);
  transition: background-color 0.3s ease;
}
.pages-list::-webkit-scrollbar-thumb {
  background-color: var(--main-color);
  border-radius: 4px;
  transition: background-color 0.3s ease;
}
.pages-list:hover::-webkit-scrollbar-thumb {
  background: var(--main-color-hover);
}
.page-link {
  font-size: 12px;
  font-weight: normal;
  line-height: 15px;
  color: var(--font-color);
  text-decoration: none;
  transition: color 0.1s ease;
}
</style>