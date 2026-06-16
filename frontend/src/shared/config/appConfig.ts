const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/tasks';
const timeoutRaw = import.meta.env.VITE_API_TIMEOUT_MS;

export const API_BASE_URL: string = baseURL;
export const API_TIMEOUT_MS: number = Number(timeoutRaw ?? 10000);
