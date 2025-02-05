export class SettingsService {
  
  static async saveSettings(payload: Record<string, string>): Promise<void> {
    const response = await fetch('api/saveSettings.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error('Ошибка при сохранении настроек')
    }
    
    const data = await response.json()
    if (!data.success) {
      throw new Error(data.message || 'Не удалось сохранить настройки')
    }
  }
  
}