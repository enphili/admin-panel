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
            <img
              class="input-eye"
              :src="img"
              width="16"
              height="16"
              @click="isPasswordHidden = !isPasswordHidden"
              alt="переключение видимости пароля"
            />
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
import { useAppStore } from '../store'
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

// иконка для переключения видимости пароля
const img = computed(() => isPasswordHidden.value
  ? `${import.meta.env.BASE_URL}image/eye.svg`
  : `${import.meta.env.BASE_URL}image/eye-off.svg`
)

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
  position: absolute;
  bottom: 30px;
  right: 5px;
  cursor: pointer;
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