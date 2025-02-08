// Регулярное выражение для проверки только латинских букв и цифр
const nonLatinPattern = /[^a-zA-Z0-9_-]/ // Проверяет, есть ли недопустимые символы
// Регулярное выражение для проверки наличия не-латинских букв
const russianLettersPattern = /[а-яёА-ЯЁ]/ // Проверяет наличие русских букв

// Функция валидации логина
const validateLogin = (login: string, detailedErrors: boolean = false, allowEmpty: boolean = false): { isValid: boolean, message: string } => {
  if (!login && allowEmpty) { // Если поле пустое и пустое значение разрешено
    return { isValid: true, message: '' }
  }
  
  if (!login) { // Если поле пустое, но пустое значение запрещено
    return { isValid: false, message: 'Поле логина не может быть пустым.' }
  }
  
  const errors = []
  if (russianLettersPattern.test(login)) { // Проверка на русские буквы
    errors.push('Логин должен содержать только буквы латинского алфавита')
  }
  
  if (nonLatinPattern.test(login)) { // Проверка на запрещённые символы
    errors.push('В логин разрешены только символы "_" и "-".')
  }
  
  if (login.length < 4) { // длина логина не менее 4
    errors.push('Логин должен быть не менее 4 символов')
  }
  
  if (errors.length > 0) {
    return {
      isValid: false,
      message: detailedErrors ? errors.join(' ') : 'Логин не соответствует требованиям безопасности.'
    }
  }
  
  return { isValid: true, message: '' }
}

// Функция валидации пароля
const validatePassword = (password: string, detailedErrors: boolean = false, allowEmpty: boolean = false): { isValid: boolean, message: string } => {
  if (!password && allowEmpty) { // Если поле пустое и пустое значение разрешено
    return { isValid: true, message: '' }
  }
  
  if (!password) { // Если поле пустое, но пустое значение запрещено
    return { isValid: false, message: 'Пароль не может быть пустым.' }
  }
  
  if (password === 'admin') { // Исключение для пароля "admin"
    return { isValid: true, message: '' }
  }
  
  const errors = []
  // Проверка на недопустимые символы
  if (!/^[-a-zA-Z0-9!@#$%^&*]+$/.test(password)) {
    errors.push('В пароле разрешены только латинские буквы, цифры и специальные символы.')
  }
  
  // Проверка длины
  if (password.length < 5) {
    errors.push('Пароль должен быть не менее 5 символов.')
  }
  
  // Проверка на заглавные буквы
  if (!/[A-Z]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну заглавную букву.')
  }
  
  // Проверка на строчные буквы
  if (!/[a-z]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну строчную букву.')
  }
  
  // Проверка на цифры
  if (!/\d/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну цифру.')
  }
  
  // Проверка на специальные символы
  if (!/[!@#$%^&*-]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы один специальный символ.')
  }
  
  if (errors.length > 0) {
    return {
      isValid: false,
      message: detailedErrors ? errors.join(' ') : 'Пароль не соответствует требованиям безопасности.'
    }
  }
  
  return { isValid: true, message: '' }
}

// Хук для валидации
export const useValidation = (
  login: string,
  password: string,
  detailedErrors: boolean = false,
  allowEmptyLogin: boolean = false,
  allowEmptyPassword: boolean = false
) => {
  const loginError = validateLogin(login, detailedErrors, allowEmptyLogin)
  const passwordError = validatePassword(password, detailedErrors, allowEmptyPassword)
  
  return {
    isLoginValid: loginError.isValid,
    loginError: loginError.message,
    isPasswordValid: passwordError.isValid,
    passwordError: passwordError.message,
  }
}

