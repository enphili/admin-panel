const fs = require('fs-extra')
const path = require('path')
import { exec } from 'child_process'

const PROJECT_PATH = path.resolve(__dirname) // Путь к корню проекта
const DIST_PATH = path.join(PROJECT_PATH, 'dist') // Путь к папке билда
const BACKEND_SOURCE = path.resolve(PROJECT_PATH, 'backend') // Путь к исходной папке PHP API
const FRONTEND_DEST = path.join('K:', 'OSPanel', 'home', 'proremont.com', 'admin') // Путь к директории OpenServer, где находится приложение для сайта-донора
const BACKEND_DEST = path.join(FRONTEND_DEST, 'api') // Папка для backend на сайте на OpenServer

// Функция для выполнения команд в терминале
const runCommand = (cmd: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: PROJECT_PATH }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Ошибка выполнения команды "${cmd}":`)
        console.error(`STDOUT: ${stdout}`)
        console.error(`STDERR: ${stderr}`)
        reject(error)
      }
      
      console.log(stdout)
      console.log(`✅ Команда "${cmd}" выполнена успешно.`)
      resolve()
    })
  })
}

// Функция копирования файлов
const copyFiles = async (source: string, destination: string, filter?: (file: string) => boolean) => {
  if (!fs.existsSync(source)) {
    console.error(`❌ Исходная папка не найдена: ${source}`)
    throw new Error(`Исходная папка не найдена: ${source}`)
    
  }
  
  if (!fs.existsSync(destination)) {
    console.warn(`📁 Папка назначения не найдена, создаю: ${destination}`)
    fs.mkdirSync(destination, { recursive: true })
  }
  
  await fs.copy(source, destination, { filter })
  console.log(`✅ Файлы скопированы из ${source} в ${destination}`)
}

// Основная функция
const deploy = async () => {
  try {
    console.log('Проект находится в:', PROJECT_PATH) // Выводим путь к проекту
    console.log('🚀 Запуск сборки проекта...')
    await runCommand('npm run build')
    
    console.log('🗑️ Удаляем старые файлы на сервере...')
    fs.emptyDirSync(FRONTEND_DEST)
    
    console.log('📂 Копируем собранный фронтенд...')
    await copyFiles(DIST_PATH, FRONTEND_DEST)
    
    console.log('📂 Копируем backend...')
    await copyFiles(BACKEND_SOURCE, BACKEND_DEST, (file) => !file.endsWith('.log'))
    
    console.log('✅ Деплой завершен успешно!')
  } catch (error) {
    console.error('❌ Ошибка во время деплоя:')
    if (error instanceof Error) {
      console.error(error.message)
      console.error(error.stack)
    } else {
      console.error(error)
    }
    throw error
  }
}

// Запуск
deploy()
  .then(() => console.log('✅ Success!'))
  .catch(err => console.error('❌ Error!:', err))