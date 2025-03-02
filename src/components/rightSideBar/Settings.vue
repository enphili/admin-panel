<template>
  <p class="subtitle">Адрес панели</p>
  <label for="inputPath" class="settings-input">
    <input
      id="inputPath"
      class="rightSideBar-input mb30"
      type="text"
      placeholder="введите путь до панели"
      v-model="inputPath"
      @blur="sanitizePath"
    >
    <span v-if="pathErrorMessage" class="validate-text validate-path" v-html="pathErrorMessage"></span>
  </label>

  <p class="subtitle">Логин</p>
  <label for="reLogin" class="settings-input">
    <input
      id="reLogin"
      class="rightSideBar-input mb30"
      type="text"
      placeholder="введите логин"
      v-model="reLogin"
    >
    <span v-if="loginErrorMessage" class="validate-text validate-path" v-html="loginErrorMessage"></span>
  </label>

  <p class="subtitle">Пароль</p>
  <label for="rePassword" class="settings-input">
    <input
      id="rePassword"
      class="rightSideBar-input mb30"
      type="text"
      placeholder="введите пароль"
      v-model="rePassword"
    >
    <span v-if="passwordErrorMessage" class="validate-text validate-path" v-html="passwordErrorMessage"></span>
  </label>

</template>

<script setup lang="ts">
import {useAppStore} from '../../store/appStore.ts'
import {computed, onMounted, ref, watch} from 'vue'
import {useValidation} from '../../use/auth/validation.ts'

const store = useAppStore() //
const pathErrorMessage = ref('')
const loginErrorMessage = ref('')
const passwordErrorMessage = ref('')
const validPathRegex = /^[a-zA-Z0-9_/-]+$/ // Регулярное выражение для допустимых символов в пути

// Связываем поле inputPath с хранилищем
const initialPath = computed(() => store.initialSettings.path) // Исходное значение пути
const inputPath = ref(initialPath.value) // Локальная копия значения поля

// Связываем поле reLogin с хранилищем
const reLogin = computed({
  get: () => store.settings.login.trim(),
  set: value => store.settings.login = value.trim()
})

// Связываем поле rePassword с хранилищем
const rePassword = computed({
  get: () => (store.settings.password || '').trim(),
  set: value => store.settings.password = value.trim()
})

// Функция для проверки изменений
const checkChanges = computed(() => {
  return (
    inputPath.value !== '' && inputPath.value !== initialPath.value // Проверка пути
    || reLogin.value !== store.initialSettings.login // Проверка логина
    || rePassword.value !== store.initialSettings.password // Проверка пароля
  )
})

// Функция для валидации пути
const validatePath = () => {
  if (inputPath.value === '') {
    // Если поле пустое, считаем валидацию успешной
    pathErrorMessage.value = ''
    return true
  }

  if (!validPathRegex.test(inputPath.value)) {
    pathErrorMessage.value = 'Разрешены только латинские буквы, цифры и `_`, `-`, `/`'
    return false
  }

  pathErrorMessage.value = ''
  return true
}

// Обработчик потери фокуса для inputPath
const sanitizePath = () => {
  if (inputPath.value.trim() === '') {
    // Если поле пустое, сбрасываем значение к исходному
    pathErrorMessage.value = '' // Очищаем сообщение об ошибке
    inputPath.value = ''
    store.settings.path = initialPath.value
    return
  }

  // Иначе очищаем '/' и обновляем store
  const sanitizedValue = inputPath.value.replace(/\//g, '').trim()
  inputPath.value = sanitizedValue
  store.settings.path = sanitizedValue

  validatePath() // Проверяем валидность после очистки
}

// Функция для валидации логина
const validateLogin = () => {
  if (reLogin.value.trim() === '') {
    loginErrorMessage.value = ''
    return true
  }
  const validation = useValidation(reLogin.value, rePassword.value, true, true, true)
  loginErrorMessage.value = validation.loginError
  return !validation.loginError
}

// Функция для валидации пароля
const validatePassword = () => {
  if (rePassword.value.trim() === '') {
    passwordErrorMessage.value = ''
    return true
  }
  const validation = useValidation(reLogin.value, rePassword.value, true, true, true)
  passwordErrorMessage.value = validation.passwordError
  return !validation.passwordError
}

// Следим за изменениями полей
watch([ inputPath, reLogin, rePassword], () => {
  store.setHasChanges(checkChanges.value) // Устанавливаем флаг hasChanges
  validatePath() // Валидация пути
  validateLogin() // Проверка логина
  validatePassword() // Проверка пароля
})

onMounted(() => {
  store.setInitialSettings() // Запоминаем начальные настройки
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