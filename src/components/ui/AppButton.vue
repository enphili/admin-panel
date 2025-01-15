<template>
  <button :class="['filled-btn', className]" :type>{{ text }}</button>
</template>

<script setup lang="ts">
//Используем интерфейс IProps для строгой типизации с TypeScript
interface IProps {
  text: string,
  class?: string
  type?: 'button' | 'submit' | 'reset'
}

// Деструктуризация с установкой значения по умолчанию
const {text, class: className, type = 'button'} = defineProps<IProps>()

</script>

<style>
.filled-btn {
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
</style>