import { useValidation  } from '../use/auth/useValidation.ts'

type EmitFunction = (event: 'authenticated', payload: boolean) => void

export class AuthService {
  private readonly login: string
  private readonly password: string
  private readonly emit: EmitFunction
  
  constructor(login: string, password: string, emit: EmitFunction) {
    this.login = login
    this.password = password
    this.emit = emit
  }
  
  // Метод для валидации данных
  validate() {
    const {
      isLoginValid,
      loginValidateMessage,
      isPasswordValid,
      passwordValidateMessage
    } = useValidation(this.login, this.password)
    
    return {
      isValid: isLoginValid && isPasswordValid,
      loginValidateMessage,
      passwordValidateMessage,
    }
  }
  
  // Метод для авторизации
  async loginToServer() {
    // Валидация перед отправкой
    const validation = this.validate()
    if (!validation.isValid) {
      return {
        isValidationError: true,
        loginValidateMessage: validation.loginValidateMessage,
        passwordValidateMessage: validation.passwordValidateMessage,
      }
    }
    
    // Если валидация пройдена, выполняем запрос
    try {
      const response = await fetch('/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: this.login,
          password: this.password,
        }),
      })
      
      const data = await response.json()
      if (data.success && data.isLogin) {
        this.emit('authenticated', true)
        return {
          isValidationError: false,
          isFall: false,
          fall: '',
          loginValidateMessage: '',
          passwordValidateMessage: '',
        }
      } else {
        return {
          isValidationError: false,
          isFall: true,
          fall: data.message || 'Неверные данные для входа',
          loginValidateMessage: '',
          passwordValidateMessage: '',
        }
      }
    } catch (error) {
      return {
        isValidationError: false,
        isFall: true,
        fall: 'Ошибка подключения к серверу',
        loginValidateMessage: '',
        passwordValidateMessage: '',
      }
    }
  }
  
  // Метод для смены пароля
  async changePassword(oldPassword: string, newPassword: string) {}
  
}