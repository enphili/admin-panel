<template>
  <div class="form-wrapper">
    <form class="login-form" @submit.prevent="login">
      <fieldset>
        <legend class="form-title">Вход в панель редактирования</legend>
          <label for="name" class="form-label">Логин
            <input id="name" class="form-input" v-model="username" placeholder="укажите ваш логин" />
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
          </label>
        <AppButton
          text="Войти"
          type="submit"
        />
      </fieldset>
    </form>
  </div>
</template>

<script setup lang="ts">
import AppButton from '../components/ui/AppButton.vue'
import {computed, ref} from 'vue'

const emit = defineEmits<{
  authenticated: [value: boolean]
}>()

const username = ref('')
const password = ref('')
const isPassword = ref(true)

const img = computed(() => isPassword.value ? '/image/eye.svg' : '/image/eye-off.svg')

// Логика для аутентификации (пример)
const login = () => {
  if (username.value === 'admin' && password.value === 'admin') {
    // В данном примере мы просто меняем состояние на успешную аутентификацию
    // В реальной жизни сюда добавьте вашу логику аутентификации
    // и эмитим событие в родительский компонент (App.vue)
    emit('authenticated', true) // передаем true при успешной аутентификации
  } else {
    alert('Неверные данные для входа')
  }
}



</script>


<style scoped>
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
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
  font-size: 12px;
  color: var(--accent);
}
.password-label {
  position: relative;
}
.form-input {
  height: 30px;
  margin-bottom: 24px;
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

</style>