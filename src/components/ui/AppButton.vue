<template>
  <button :class="['filled-btn', className]" :type :disabled="isLoading">
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
.filled-btn {
  min-width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 15px;
  border-radius: 5px;
  background: var(--accent);
  color: white;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
  border: none;
  outline: none;
}
.filled-btn:disabled {
  background: gray;
  cursor: not-allowed;
}
.loader {
  width: 20px;
  height: 20px;
  border: 4px solid transparent;
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>