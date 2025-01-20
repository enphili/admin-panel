<template>
  <button :class="['btn', className]" :type :disabled="isLoading">
    <span v-if="isLoading" class="loader"></span>
    <span v-else>{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
//Используем интерфейс IProps для строгой типизации с TypeScript
interface IProps {
  text: string,
  class?: string
  type?: 'button' | 'submit' | 'reset',
  isLoading?: boolean
}

// Деструктуризация с установкой значения по умолчанию
const {text, class: className, type = 'button', isLoading = false} = defineProps<IProps>()

</script>

<style>
.btn {
  min-width: 80px;
  min-height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3px 15px;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
  border: none;
  outline: none;
  transition: all 0.3s ease;
}
.filled-btn:hover {
  background: var(--accent-hover);
}
.filled-btn {
  background: var(--accent);
}
.filled-btn:disabled {
  background: gray;
  cursor: not-allowed;
}
.outline-btn {
  border: 2px solid var(--accent);
  background: transparent;
  color: var(--font-color);
}
.outline-btn:hover {
  background: var(--main-color-hover);
  border-color: var(--main-color-hover);
}
.loader {
  width: 20px;
  height: 20px;
  border: 4px solid transparent;
  border-top: 4px solid var(--body-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>