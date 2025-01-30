// Регулярное выражение для проверки только латинских букв и цифр
const nonLatinPattern = /[^a-zA-Z0-9_-]/ // Проверяет, есть ли недопустимые символы
// Регулярное выражение для проверки наличия не-латинских букв
const russianLettersPattern = /[а-яёА-ЯЁ]/ // Проверяет наличие русских букв

// Функция валидации логина
const validateLogin = (login: string): { isValid: boolean, message: string } => {
  // Проверка на не пустой логин
  if (!login) {
    return { isValid: false, message: 'Поле логина не может быть пустым.' }
  }
  
  // Проверка на русские буквы
  if (russianLettersPattern.test(login)) {
    return { isValid: false, message: 'Логин должен содержать только буквы латинского алфавита' }
  }
  
  // Проверка на запрещённые символы
  if (nonLatinPattern.test(login)) {
    return { isValid: false, message: 'В логин разрешены только символы "_" и "-".' }
  }
  
  return { isValid: true, message: '' }
}

// Функция валидации пароля
const validatePassword = (password: string): { isValid: boolean, message: string } => {
  if (!password) {
    return { isValid: false, message: 'Пароль не может быть пустым.' }
  }
  
  // Исключение для пароля "admin"
  if (password === 'admin') {
    return { isValid: true, message: '' }
  }
  
  // Длина пароля
  if (password.length < 6) {
    return { isValid: false, message: 'Пароль должен быть не менее 6 символов.' }
  }
  
  // Проверка на наличие заглавной буквы
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Пароль должен содержать хотя бы одну заглавную букву.' }
  }
  
  // Проверка на наличие строчной буквы
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Пароль должен содержать хотя бы одну строчную букву.' }
  }
  
  // Проверка на наличие хотя бы одной цифры
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Пароль должен содержать хотя бы одну цифру.' }
  }
  
  // Проверка на наличие хотя бы одного специального символа
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { isValid: false, message: 'Пароль должен содержать хотя бы один специальный символ.' }
  }
  
  return { isValid: true, message: '' }
}

// Хук для валидации
export const useValidation = (login: string, password: string) => {
  const loginError = validateLogin(login)
  const passwordError = validatePassword(password)
  
  return {
    isLoginValid: loginError.isValid,
    loginError: loginError.message,
    isPasswordValid: passwordError.isValid,
    passwordError: passwordError.message,
  }
}

