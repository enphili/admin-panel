import {notify} from '@kyvg/vue3-notification'

export const handleError = (error: unknown, title: string, type: string): void => {
  notify({
    title,
    text: error instanceof Error ? error.message : 'Произошла неизвестная ошибка',
    type
  })
}