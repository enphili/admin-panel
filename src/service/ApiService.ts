import { CsrfManager } from './CsrfManager.ts'
import type {ApiResponse} from '../types/apiResponse.ts'

export class ApiService {
  private static csrfManager = new CsrfManager()
  
  // доступ к CSRF-токен через CsrfManager
  private static async fetchCsrfToken(): Promise<string> {
    return await this.csrfManager.fetchToken()
  }
  
  // Универсальный метод запросов
  private static async request<T>(method: 'GET' | 'POST', endpoint: string, payload?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const csrfToken = await this.fetchCsrfToken()
      
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken || '',
        },
        body: payload ? JSON.stringify(payload) : undefined,
      }
      
      const response = await fetch(endpoint, options)
      if (!response.ok) {
        console.error(`Ошибка HTTP! Статус: ${response.status}, URL: ${endpoint}`)
        throw new Error(`Ошибка HTTP! Статус: ${response.status}`)
      }
      
      const data: ApiResponse<T> = await response.json()
      if (!data.success) {
        console.error(`Запрос к ${endpoint} не удался: ${data.message || response.status}`)
        throw new Error(`Запрос не удался: ${data.message || response.status}`)
      }
      
      return data
    } catch (error) {
      console.error(`Ошибка запроса (${method} ${endpoint}): ${error}`)
      throw new Error(`Ошибка запроса: ${error}`)
    }
  }
  
  // Метод для GET-запросов
  static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint)
  }
  
  // Метод для POST-запросов
  static async post<T>(endpoint: string, payload: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, payload)
  }
  
  //Метод для загрузки HTML-файлов
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
      
      if (!response.ok) {
        console.error(`Ошибка загрузки HTML из ${path}: ${response.status}`)
        throw new Error(`Ошибка загрузки HTML: ${response.status}`)
      }
      
      return await response.text()
    }
    catch (error) {
      console.error(`Ошибка загрузки HTML из ${path}: ${error}`)
      throw new Error(`Ошибка загрузки HTML: ${error}`)
    }
  }
}
