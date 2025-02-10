import { CsrfManager } from './CsrfManager.ts'
import { handleError } from '../use/useHandleError.ts'

export class SettingsService {
  private static csrfManager = new CsrfManager()
  
  // доступ к CSRF-токену через CsrfManager
  private static async fetchCsrfToken(): Promise<string> {
    return await this.csrfManager.fetchToken()
  }
  
  static async saveSettings(payload: Record<string, string>): Promise<void> {
    try {
      const csrfToken = await this.fetchCsrfToken()
      
      const response = await fetch('api/save_settings.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken || ''
        },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP! Статус: ${response.status}`)
      }
      
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || 'Не удалось сохранить настройки')
      }
    }
    catch (error) {
      handleError(error, 'Сохранение настроек', 'error')
      throw error
    }
  }
}