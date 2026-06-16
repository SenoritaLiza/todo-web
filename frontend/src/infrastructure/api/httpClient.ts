import axios, { type AxiosInstance } from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from '../../shared/config/appConfig';

export const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});
