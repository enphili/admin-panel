const useToggleTheme = (isDarkMode: boolean): void => {
  if (isDarkMode) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const useInitTheme = (): boolean => {
  const savedTheme: string | null = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark')
    return true
  } else {
    document.documentElement.classList.remove('dark')
    return false
  }
}


export { useToggleTheme, useInitTheme }