export interface ApiResponse<T = undefined> {
  success: boolean
  message?: string // Опциональное поле для сообщений об ошибках
  data?: T         // Данные, которые зависят от контекста запроса
}