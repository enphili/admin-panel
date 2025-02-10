export class CsrfManager {
  private token: string | null = null
  
  // Метод для получения CSRF-токена с сервера
  async fetchToken(): Promise<string> {
    if (this.token) return this.token // Если токен уже существует, возвращаем его
    
    const response = await fetch('api/get_csrf_token.php', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    
    if (!response.ok) {
      throw new Error(`Ошибка при получении CSRF-токена: ${response.statusText}`)
    }
    
    const data = await response.json()
    if (!data.token) {
      throw new Error('CSRF-токен не был получен. Пожалуйста, попробуйте снова')
    }
    
    this.token = data.token // Здесь мы уверены, что data.token — это string
    if (this.token === null) { // и чтобы убедить в этом TypeScript
      throw new Error('Неожиданное значение null для CSRF-токена')
    }
    return this.token
  }
}