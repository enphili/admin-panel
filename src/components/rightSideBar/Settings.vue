<template>
  <p class="subtitle">Адрес панели</p>
  <label for="inputPath" class="settings-input">
    <input
      id="inputPath"
      class="rightSideBar-input mb30"
      type="text"
      placeholder="введите путь до панели"
      v-model="inputPath"
      @input="validatePath"
    >
    <span v-if="pathErrorMessage" class="validate-text validate-path">{{ pathErrorMessage }}</span>
  </label>

  <p class="subtitle">Логин</p>
  <label for="reLogin" class="settings-input">
    <input
      id="reLogin"
      class="rightSideBar-input mb30"
      type="text"
      placeholder="введите логин"
      v-model="reLogin"
      @input="validateLogin"
    >
    <span v-if="loginErrorMessage" class="validate-text validate-path">{{ loginErrorMessage }}</span>
  </label>

  <p class="subtitle">Пароль</p>
  <label for="rePassword" class="settings-input">
    <input
      id="rePassword"
      class="rightSideBar-input mb30"
      type="text"
      placeholder="введите пароль"
      v-model="rePassword"
      @input="validatePassword"
    >
    <span v-if="passwordErrorMessage" class="validate-text validate-path">{{ passwordErrorMessage }}</span>
  </label>

</template>

<script setup lang="ts">
import { useAppStore } from '../../store'
import {ref, onMounted, watch, computed} from 'vue'

const inputPath = ref('')
const originalPath = ref('') // Тут хранится исходное значение пути
const reLogin = ref('')
const rePassword = ref('')
const pathErrorMessage = ref('')
const loginErrorMessage = ref('')
const passwordErrorMessage = ref('')

// Регулярное выражение для допустимых символов
const validPathRegex = /^[a-zA-Z0-9_/-]+$/
const validPasswordRegex = /^[a-zA-Z0-9!@#$%^&*]*$/

const store = useAppStore()

// Функция для проверки изменений
const hasChanges = computed(() => {
  return (
    inputPath.value !== originalPath.value ||  // Изменился ли путь
    reLogin.value.trim() !== '' ||            // Было пусто → стало не пусто
    rePassword.value.trim() !== ''            // Было пусто → стало не пусто
  )
})

// Следим за изменениями полей
watch(hasChanges, value => {
  store.setHasChanges(value)
}, { immediate: true })

const validatePath = () => {
  if (inputPath.value === '') {
    pathErrorMessage.value = ''
    return
  }

  if (!validPathRegex.test(inputPath.value)) {
    pathErrorMessage.value = 'Разрешены только латинские буквы, цифры и `_`, `-`, `/`'
    return
  }

  pathErrorMessage.value = ''
}
const validateLogin = () => {
  if (reLogin.value === '') {
    loginErrorMessage.value = ''
    return
  }

  if (!validPathRegex.test(reLogin.value)) {
    loginErrorMessage.value = 'Разрешены только латинские буквы, цифры и `_`, `-`'
    return
  }

  loginErrorMessage.value = ''
}
const validatePassword = () => {
  if (rePassword.value === '') {
    passwordErrorMessage.value = ''
    return
  }

  if (!validPasswordRegex.test(rePassword.value)) {
    passwordErrorMessage.value = 'Пароль должен содержать только латинские буквы, цифры, символы !@#$%^&*'
    return
  }

  passwordErrorMessage.value = ''
}

// На момент монтирования компонента определяем текущий путь и сохраняем его как оригинальный
onMounted(() => {
  originalPath.value = inputPath.value = window.location.pathname // Например, "/admin"
})
</script>

<style>
.settings-input {
  position: relative;
}
.mb30 {
  margin-bottom: 30px;
}
.validate-path {
  position: absolute;
  top: 25px;
  left: 5px;
  right: 5px;
}
</style>