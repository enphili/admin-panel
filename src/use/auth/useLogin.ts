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
  
  if (!isLoginValid && !isPasswordValid) {
    // Возвращаем результаты валидации, если она не пройдена
    return {
      isFall: false, // Ошибок авторизации нет, это ошибка валидации
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
        isFall: false,
        idDone: true,
        fall: '',
      }
    } else {
      // Ошибка авторизации
      return {
        isFall: true,
        idDone: false,
        fall: data.message || 'Неверные данные для входа',
      }
    }
  }
  catch (error) {
    // Ошибка сети или сервера
    return {
      isFall: true,
      idDone: false,
      fall: 'Ошибка подключения к серверу',
    }
  }
}