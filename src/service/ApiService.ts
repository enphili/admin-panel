import { CsrfManager } from './CsrfManager.ts'
import type {ApiResponse} from '../types/apiResponse.ts'

export class ApiService {
  private static csrfManager = new CsrfManager()
  
  // доступ к CSRF-токену через CsrfManager
  private static async fetchCsrfToken(): Promise<string> {
    return await this.csrfManager.fetchToken()
  }
  
  // Метод для GET-запросов
  static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const csrfToken = await this.fetchCsrfToken()
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken || '',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP! Статус: ${response.status}`)
      }
      
      const data: ApiResponse<T> = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || `Запрос не удался со статусом: ${response.status}`)
      }
      
      return data
    }
    catch (error) {
      throw error
    }
  }
  
  // Метод для POST-запросов
  static async post<T>(endpoint: string, payload: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const csrfToken = await this.fetchCsrfToken()
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken || '',
        },
        body: JSON.stringify(payload),
      })
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP! Статус: ${response.status}`)
      }
      
      const data: ApiResponse<T> = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || `Запрос не удался со статусом: ${response.status}`)
      }
      
      return data
    }
    catch (error) {
      throw error
    }
  }
  
  //Отдельный метод для загрузки HTML-файлов
  static async getHtml(path: string): Promise<string> {
    try {
      const csrfToken = await this.fetchCsrfToken()
      
      const response = await fetch(path, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken || '',
        }
      })
      
      if (!response.ok) throw new Error(`Ошибка при загрузке файла: ${response.status}`)
      
      return await response.text()
    }
    catch (error) {
      throw error
    }
  }
}
