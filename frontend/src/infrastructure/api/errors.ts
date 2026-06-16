import { AxiosError } from 'axios';

export function toAppError(error: unknown): Error {
  if (error instanceof AxiosError) {
    if (error.response) {
      const detail = (error.response.data as { detail?: unknown } | undefined)?.detail;
      const message =
        typeof detail === 'string' ? detail : `Запрос завершился с ошибкой (${error.response.status})`;
      return new Error(message);
    }
    if (error.request) {
      return new Error('Сетевая ошибка: сервер недоступен.');
    }
  }
  return error instanceof Error ? error : new Error('Неизвестная ошибка');
}
