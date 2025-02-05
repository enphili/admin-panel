import { useValidation  } from '../use/auth/useValidation.ts'

type EmitFunction = (event: 'authenticated', payload: boolean) => void

export class AuthService {
  private readonly login: string
  private readonly password: string
  private readonly emit: EmitFunction
  private csrfToken: string | null = null; // Храним CSRF-токен
  
  constructor(
    login: string = '', // Значение по умолчанию
    password: string = '', // Значение по умолчанию
    emit: EmitFunction = ()=>{} // Пустая функция по умолчанию
  ) {
    this.login = login
    this.password = password
    this.emit = emit
  }
  
  // Метод для получения CSRF-токена
  async fetchCsrfToken(): Promise<void> {
    const response = await fetch('api/getCsrfToken.php', {
      method: 'GET',
      credentials: 'include', // Передаем куки
      headers: { 'Content-Type': 'application/json' },
    });
    
    // Если ответ не успешный, выбрасываем ошибку
    if (!response.ok) {
      throw new Error(`Ошибка при получении CSRF-токена: ${response.statusText}`);
    }
    
    // Парсим данные и сохраняем токен
    const data = await response.json()
    this.csrfToken = data.token // Сохраняем токен
  }
  
  // безопасный способ доступа к приватному свойству csrfToken
  getCsrfToken(): string | null {
    return this.csrfToken
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
  async loginToServer() {
    // Валидация перед отправкой
    const validation = this.validate(false)
    if (!validation.success) {
      return {
        success: false,
        message: validation.message,
      }
    }
    
    // Проверяем, что CSRF-токен получен
    if (!this.csrfToken) {
      return {
        success: false,
        message: 'CSRF-токен не был получен. Пожалуйста, попробуйте снова.',
      };
    }
    
    // Если валидация пройдена, выполняем запрос
    try {
      const response = await fetch('api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: this.login,
          password: this.password,
          csrf_token: this.csrfToken
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