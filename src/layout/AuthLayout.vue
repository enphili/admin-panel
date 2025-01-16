<template>
  <div class="form-wrapper">
    <form class="login-form" @submit.prevent="login">
      <fieldset>
        <legend class="form-title">Вход в панель редактирования</legend>
          <label for="name" class="form-label">Логин
            <input
              id="name"
              type="text"
              class="form-input"
              v-model="username"
              placeholder="укажите ваш логин"
            />
            <span class="validate-text">{{ loginValidateMessage }}</span>
          </label>

          <label for="password" class="form-label password-label">Пароль
            <input
              id="password"
              class="form-input"
              v-model="password"
              :type="isPassword ? 'password' : 'text'"
              placeholder="введите пароль"
            />
            <img
              class="input-eye"
              :src="img"
              width="16"
              height="16"
              @click="isPassword = !isPassword"
              alt="переключение видимости пароля"
            />
            <span class="validate-text">{{ passwordValidateMessage }}</span>
          </label>
        <AppButton
          text="Войти"
          type="submit"
        />
      </fieldset>
    </form>
    <Transition name="fade">
      <p v-if="idDone" class="form-message done-message">{{ done }}</p>
    </Transition>
    <Transition name="fade">
      <p v-if="isFall"  class="form-message fall-message">{{ fall }}</p>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import AppButton from '../components/ui/AppButton.vue'
import {computed, ref, watch} from 'vue'
import {useLogin} from '../use/auth/useLogin.ts'
import {useValidation} from '../use/auth/useValidation.ts'

const emit = defineEmits<{
  authenticated: [value: boolean]
}>()

// Локальные состояния
const username = ref('')
const password = ref('')
const isPassword = ref(true)
const isFall = ref(false)
const fall = ref('Ошибка авторизации')
const done = ref('Вы успешно авторизовались')
const idDone = ref(false)

// Валидационные сообщения
const loginValidateMessage = ref('')
const passwordValidateMessage = ref('')

// Обновляем валидацию при изменении полей
watch([username, password], ([newUsername, newPassword]) => {
  const validation = useValidation(newUsername, newPassword)
  loginValidateMessage.value = validation.loginValidateMessage
  passwordValidateMessage.value = validation.passwordValidateMessage
})

const img = computed(() => isPassword.value ? '/image/eye.svg' : '/image/eye-off.svg')

// Функция входа
const login = async () => {
  const result = await useLogin(username.value, password.value, emit)

  if (result.isFall) {
    fall.value = result.fall
    isFall.value = true
    idDone.value = false
    setTimeout(() => {
      isFall.value = false
    }, 2500)
  } else {
    idDone.value = true
    isFall.value = false
  }
}

</script>


<style>
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
  color: var(--accent);
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
   border-radius: 5px;
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