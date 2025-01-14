const fs = require('fs-extra')
const path = require('path')

// Путь к исходной папке PHP API
const source = path.resolve(__dirname, './backend')

// Путь к директории OpenServer, где находится сайт-донор
const destination = 'K:/openserver/domains/proremont.com/admin/api'

// Функция для копирования файлов
const copyBackend = async (): Promise<void> => {
  try {
    // Проверка доступности путей
    if (!fs.existsSync(source)) {
      console.error('Исходная папка не найдена:', source)
      process.exit(1)
    }
    if (!fs.existsSync(destination)) {
      console.warn('Папка назначения не найдена, создаю:', destination)
      fs.mkdirSync(destination, { recursive: true })
    }
    
    await fs.copy(source, destination, {
      filter: (file: string) => !file.endsWith('.log') // Исключить файлы с расширением .log
    })
    console.log('PHP-файлы успешно скопированы!')
  } catch (error) {
    console.error('Ошибка копирования файлов из', source, 'в', destination, ':', error)
  }
}

// Выполнение скрипта
(async () => {
  try {
    await copyBackend()
  } catch (error) {
    console.error('Необработанная ошибка:', error)
  }
})()