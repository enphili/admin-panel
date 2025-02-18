import {notify} from '@kyvg/vue3-notification'

export const useHandleError = (error: unknown, title: string, type: 'warn' | 'success' | 'error'): string => {
  const message = error instanceof Error ? error.message : 'Произошла неизвестная ошибка'
  notify({
    title: title,
    text: message,
    type: type
  })
  return message
}