export interface ApiResponse<T> {
  success: boolean
  message?: string // Опциональное поле для сообщений об ошибках
  data: T         // Данные, которые зависят от контекста запроса
}