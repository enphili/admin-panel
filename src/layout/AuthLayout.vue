<template>
  <div class="auth-layout">
    <div class="form-wrapper">
      <form class="login-form" @submit.prevent="handleLogin">
        <fieldset>
          <legend class="form-title">Вход в панель редактирования</legend>
          <label for="name" class="form-label">Логин
            <input
              id="name"
              type="text"
              class="form-input"
              v-model="username"
              placeholder="укажите ваш логин"
              @blur="isUsernameTouched = true"
            />
            <span class="validate-text">{{ loginError }}</span>
          </label>

          <label for="password" class="form-label password-label">Пароль
            <input
              id="password"
              class="form-input"
              v-model="password"
              :type="isPasswordHidden ? 'password' : 'text'"
              placeholder="введите пароль"
              @blur="isPasswordTouched = true"
            />
            <svg
              v-if="isPasswordHidden"
              @click="isPasswordHidden = !isPasswordHidden"
              class="input-eye"
              width="18"
              height="14"
              viewBox="0 0 18 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 6.81818C1 6.81818 3.90909 1 9 1C14.0909 1 17 6.81818 17 6.81818C17 6.81818 14.0909 12.6364 9 12.6364C3.90909 12.6364 1 6.81818 1 6.81818Z" stroke="#2C2A40" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 9C10.205 9 11.1818 8.02317 11.1818 6.81818C11.1818 5.6132 10.205 4.63636 9 4.63636C7.79502 4.63636 6.81818 5.6132 6.81818 6.81818C6.81818 8.02317 7.79502 9 9 9Z" stroke="#2C2A40" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg
              v-else
              @click="isPasswordHidden = !isPasswordHidden"
              class="input-eye"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M13.32 13.32C12.0768 14.2676 10.563 14.7926 9 14.8182C3.90909 14.8182 1 9 1 9C1.90465 7.31411 3.15937 5.84117 4.68 4.68M7.47273 3.35636C7.97333 3.23918 8.48586 3.18061 9 3.18182C14.0909 3.18182 17 9 17 9C16.5585 9.8259 16.032 10.6034 15.4291 11.32M10.5418 10.5418C10.3421 10.7562 10.1012 10.9281 9.83357 11.0474C9.56593 11.1666 9.27702 11.2307 8.98407 11.2359C8.69111 11.2411 8.40012 11.1872 8.12844 11.0774C7.85677 10.9677 7.60998 10.8044 7.4028 10.5972C7.19562 10.39 7.03229 10.1432 6.92255 9.87156C6.81282 9.59988 6.75893 9.30889 6.7641 9.01593C6.76927 8.72298 6.83339 8.43407 6.95264 8.16643C7.07189 7.8988 7.24382 7.65793 7.45818 7.45818M1 1L17 17" stroke="#2C2A40" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="validate-text">{{ passwordError }}</span>
          </label>

          <AppButton
            text="Войти"
            class="filled-btn"
            type="submit"
            :isLoading="isLoading"
          />
        </fieldset>
      </form>
      <Transition name="fade">
        <p v-if="authErrorMessage"  class="form-message fall-message">{{ authErrorMessage }}</p>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppButton from '../components/ui/AppButton.vue'
import {computed, onMounted, ref} from 'vue'
import {useValidation} from '../use/auth/validation.ts'
import {AuthService} from '../service/AuthService.ts'
import { useNotification } from "@kyvg/vue3-notification"
import { useAppStore } from '../store/appStore.ts'
import {useHandleError} from '../use/handleError.ts'

const emit = defineEmits<{
  authenticated: [value: boolean]
}>()

const store = useAppStore()
const username = ref('')
const password = ref('')
const isPasswordHidden = ref(true)
const isLoading = ref(false)
const authErrorMessage = ref('')
const { notify }  = useNotification()

// Флаги "трогали ли поля"
const isUsernameTouched = ref(false)
const isPasswordTouched = ref(false)

// Валидация полей
const validation = computed(() => useValidation(
  username.value,
  password.value,
  false,
  false,
  false
))
// Отображаем ошибку только если поле ввода было в фокусе
const loginError = computed(() => isUsernameTouched.value ? validation.value.loginError : '')
const passwordError = computed(() => isPasswordTouched.value ? validation.value.passwordError : '')

// Функция входа
const handleLogin = async () => {
  if (!isUsernameTouched.value) isUsernameTouched.value = true
  if (!isPasswordTouched.value) isPasswordTouched.value = true

  // Проверяем валидность полей перед отправкой
  if (!validation.value.isLoginValid || !validation.value.isPasswordValid) return

  isLoading.value = true
  authErrorMessage.value = ''

  try {
    const authService = new AuthService(username.value, password.value, emit)

    // Получаем CSRF-токен
    await authService.fetchCsrfToken()

    // Выполняем авторизацию
    const result = await authService.loginToServer()

    if (result.success) {
      notify({
        title: 'Авторизация',
        text: 'Вы успешно вошли в систему!',
        type: 'success',
      })
    }
    else {
      authErrorMessage.value = result.message || 'Неизвестная ошибка'
      setTimeout(() => authErrorMessage.value = '', 2500)
    }
  }
  catch (error) {
    authErrorMessage.value = useHandleError(error, 'Авторизация', 'error')
    setTimeout(() => authErrorMessage.value = '', 2500)
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  store.initialize() // Инициализация приложения
})
</script>

<style>
.auth-layout {
  height: 100vh;
  width: 100%;
  background: var(--main-color);
}
.form-wrapper {
  position: absolute;
  top: calc(50% - 504px / 2);
  left: calc(50% - 390px / 2);
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  width: 390px;
  height: 504px;
}
.form-title {
  margin-bottom: 60px;
  width: 100%;
  font-size: 31px;
  font-weight: 700;
  text-align: center;
}
.login-form {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.form-label {
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: var(--lines);
}
.password-label {
  position: relative;
}
.form-input {
  height: 30px;
  padding-right: 30px;
  background: transparent;
  border: none;
  outline: none;
  border-bottom: 1px solid var(--lines);
  color: var(--font-color);
  font-size: 16px;
}
.input-eye {
  width: 16px;
  height: 16px;
  position: absolute;
  bottom: 30px;
  right: 5px;
  cursor: pointer;
}
.input-eye path, .eye-off path {
  stroke: var(--lines);
}
.validate-text {
  height: 28px;
  font-size: 11px;
  color: rgb(173, 85, 85);
}
.form-message {
   margin-top: 24px;
   display: flex;
   justify-content: center;
   align-items: center;
   height: 60px;
   border-radius: var(--border-radius) 5px;
   padding: 5px 15px;
   color: white;
 }
.done-message {
  background: rgb(88, 173, 85);
}
.fall-message {
  background: rgb(173, 85, 85);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>