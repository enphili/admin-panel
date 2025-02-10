import { useValidation  } from '../use/auth/useValidation.ts'
import { CsrfManager } from './CsrfManager.ts'
import { handleError } from '../use/useHandleError.ts'

type EmitFunction = (event: 'authenticated', payload: boolean) => void

export class AuthService {
  private readonly login: string
  private readonly password: string
  private readonly emit: EmitFunction
  private csrfManager: CsrfManager
  
  constructor(
    login: string = '', // Значение по умолчанию
    password: string = '', // Значение по умолчанию
    emit: EmitFunction = ()=>{} // Пустая функция по умолчанию
  ) {
    this.login = login
    this.password = password
    this.emit = emit
    this.csrfManager = new CsrfManager()
  }
  
  // доступ к CSRF-токену через CsrfManager
  async fetchCsrfToken(): Promise<string> {
    return await this.csrfManager.fetchToken()
  }
  
  // Метод для валидации данных
  private validate(detailedErrors: boolean = false): { success: boolean; message: string } {
    const {
      isLoginValid,
      loginError,
      isPasswordValid,
      passwordError
    } = useValidation(this.login, this.password, detailedErrors)
    
    if (!isLoginValid) {
      return { success: false, message: loginError }
    }
    
    if (!isPasswordValid) {
      return { success: false, message: passwordError }
    }
    
    return { success: true, message: '' }
  }
  
  // Метод для авторизации
  async loginToServer(): Promise<{ success: boolean; message?: string }> {
    // Валидация перед отправкой
    const validation = this.validate(false)
    if (!validation.success) {
      return { success: false, message: validation.message }
    }
    
    // Если валидация пройдена, выполняем запрос
    try {
      const csrfToken = await this.fetchCsrfToken()
      
      const response = await fetch('api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken || '', // Отправляем CSRF-токен в заголовке
        },
        body: JSON.stringify({
          login: this.login,
          password: this.password
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
  
  // Метод для выхода из системы
  async logout(): Promise<boolean> {
    try {
      const csrfToken = await this.fetchCsrfToken()
      
      const response = await fetch('api/logout.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken || ''
        },
        credentials: 'include',
      })
      
      if (!response.ok) {
        throw new Error(`Ошибка при выходе: ${response.statusText}`)
      }
      
      this.emit('authenticated', false) // Уведомляем о выходе из системы
      return true // Выход успешен
    }
    catch (error) {
      handleError(error, 'Выход из системы', 'error')
      throw error
    }
  }
}
