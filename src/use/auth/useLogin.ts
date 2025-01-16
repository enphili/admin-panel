import { useValidation } from './useValidation'


// хук аутентификации
export const useLogin = async <T extends (event: 'authenticated', payload: boolean) => void> (
  login: string,
  password: string,
  emit: T
) => {
  // Валидация входных данных
  const {
    isLoginValid,
    loginValidateMessage,
    isPasswordValid,
    passwordValidateMessage
  } = useValidation(login, password)
  
  // Проверяем, прошла ли валидация
  if (!isLoginValid && !isPasswordValid) {
    return {
      isValidationError: true, // Флаг ошибки валидации
      fall: '',
      loginValidateMessage,
      passwordValidateMessage,
      isLoginValid,
      isPasswordValid,
    }
  }
  
  // Если валидация пройдена, отправляем запрос на сервер
  try {
    const response = await fetch('/api/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login,
        password,
      })
    })
    
    const data = await response.json()
    
    // Проверяем, был ли запрос успешным
    if (data.success && data.isLogin) {
      // Успешная авторизация
      emit('authenticated', true) // передаем true при успешной аутентификации
      return {
        isValidationError: false,
        isFall: false,
        fall: '',
        loginValidateMessage,
        passwordValidateMessage,
      }
    } else {
      // Ошибка авторизации
      return {
        isValidationError: false,
        isFall: true,
        fall: data.message || 'Неверные данные для входа',
        loginValidateMessage,
        passwordValidateMessage,
      }
    }
  }
  catch (error) {
    // Ошибка сети или сервера
    return {
      isValidationError: false,
      isFall: true,
      fall: 'Ошибка подключения к серверу',
      loginValidateMessage,
      passwordValidateMessage,
    }
  }
}