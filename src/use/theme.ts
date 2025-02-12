import {notify} from '@kyvg/vue3-notification'

const useToggleTheme = (isDarkMode: boolean): void => {
  try {
    const themeClass = isDarkMode ? 'dark' : ''
    const storedTheme = isDarkMode ? 'dark' : 'light'
    
    document.documentElement.classList.toggle('dark', isDarkMode)
    localStorage.setItem('theme', storedTheme)
    
    notify({
      title: 'Тема',
      text: `Переключение на ${storedTheme === 'dark'? 'темную' : 'светлую'} тему успешно`,
      type: 'success'
    })
  }
  catch (error) {
    notify({
      title: 'Тема',
      text: error instanceof Error ? error.message : 'Ошибка переключения темы',
      type: 'error'
    })
  }
}

const useInitTheme = (): boolean => {
  try {
    const savedTheme: string | null = localStorage.getItem('theme')
    const defaultTheme = 'light' // Дефолтная тема
    
    const themeClass = savedTheme === 'dark' ? 'dark' : defaultTheme
    document.documentElement.classList.add(themeClass)
    
    return themeClass === 'dark'
  }
  catch (error) {
    notify({
      title: 'Тема',
      text: error instanceof Error ? error.message : 'Ошибка при установке темы',
      type: 'error'
    })
    return false // Возвращаем дефолтную тему (светлая)
  }
}

export { useToggleTheme, useInitTheme }