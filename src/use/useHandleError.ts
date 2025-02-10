import {notify} from '@kyvg/vue3-notification'

export const handleError = (error: unknown, title: string, type: string): string => {
  const message = error instanceof Error ? error.message : 'Произошла неизвестная ошибка'
  notify({
    title,
    text: message,
    type
  })
  return message
}