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
    >
    <span v-if="passwordErrorMessage" class="validate-text validate-path">{{ passwordErrorMessage }}</span>
  </label>

</template>

<script setup lang="ts">
import {useAppStore} from '../../store'
import {computed, onMounted, ref, watch} from 'vue'
import {useValidation} from '../../use/auth/useValidation.ts'

const store = useAppStore() //
const pathErrorMessage = ref('')
const loginErrorMessage = ref('')
const passwordErrorMessage = ref('')
const validPathRegex = /^[a-zA-Z0-9_/-]+$/ // Регулярное выражение для допустимых символов в пути

// Связываем поле inputPath с хранилищем
const inputPath = computed({
  get: () => store.settings.path,
  set: value => store.settings.path = value
})

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
  return inputPath.value !== store.initialSettings.path
    || reLogin.value !== store.initialSettings.login
    || rePassword.value !== store.initialSettings.password
})

const validatePath = () => {
  if (inputPath.value === '') {
    pathErrorMessage.value = 'Путь не может быть пустым'
    return
  }

  if (!validPathRegex.test(inputPath.value)) {
    pathErrorMessage.value = 'Разрешены только латинские буквы, цифры и `_`, `-`, `/`'
    return
  }

  pathErrorMessage.value = ''
}

const validateAll = () => {
  const validation = useValidation(reLogin.value, rePassword.value, true, true, true)
  validatePath()
  loginErrorMessage.value = validation.loginError
  passwordErrorMessage.value = validation.passwordError
  store.setHasChanges(checkChanges.value)
}

// Функция для удаления '/' при потере фокуса
const sanitizePath = () => {
  store.settings.path = inputPath.value.replace(/\//g, '') // Удаляем все '/'
  validatePath() // Проверяем валидность после очистки
}

// Следим за изменениями полей
watch([inputPath, reLogin, rePassword], () => validateAll())

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