export const useLoadIframe = (iframe: HTMLIFrameElement, url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      iframe.src = url
    }
    catch(error) {
      reject(error)
    }
    
    const maxTime = 60000
    const interval = 200
    let timerCount = 0
    
    const timer = setInterval(() => {
      if (!iframe.contentDocument || iframe.contentDocument.readyState === 'complete') {
        clearInterval(timer)
        resolve()
      }
      else if (timerCount * interval > maxTime) {
        clearInterval(timer)
        reject(new  Error('Не удалось загрузить iframe'))
      }
      timerCount++
    }, interval)
  })
}