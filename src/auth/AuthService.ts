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
  private validate(): { success: boolean; message: string } {
    const { isLoginValid, loginError, isPasswordValid, passwordError } = useValidation(this.login, this.password)
    
    if (!isLoginValid) {
      return { success: false, message: loginError }
    }
    
    if (!isPasswordValid) {
      return { success: false, message: passwordError }
    }
    
    return { success: true, message: '' }
  }
  
  // Метод для авторизации
  async loginToServer() {
    // Валидация перед отправкой
    const validation = this.validate()
    if (!validation.success) {
      return {
        success: false,
        message: validation.message,
      }
    }
    
    // Если валидация пройдена, выполняем запрос
    try {
      const response = await fetch('api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: this.login,
          password: this.password,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        return { success: false, message: data.message || 'Неверные данные для входа' }
      }
      
      this.emit('authenticated', true)
      return { success: true }
    }
    catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Ошибка подключения' }
    }
  }
  
  // Метод для смены пароля
  async changePassword(oldPassword: string, newPassword: string) {}
  
}