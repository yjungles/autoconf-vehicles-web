import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL

axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true

type RequestOptions = {
  params?: Record<string, string | number | boolean | undefined>
  signal?: AbortSignal
  headers?: Record<string, string>
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export const backendApi = axios.create({
  baseURL: BACKEND_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      return Promise.reject(error.response.data)
    }

    if (error.request) {
      return Promise.reject({
        message: 'Não foi possível se comunicar com a API.',
      })
    }

    return Promise.reject({
      message: error.message || 'Ocorreu um erro inesperado.',
    })
  },
)

backendApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      return Promise.reject(error.response.data)
    }

    if (error.request) {
      return Promise.reject({
        message: 'Não foi possível se comunicar com a API.',
      })
    }

    return Promise.reject({
      message: error.message || 'Ocorreu um erro inesperado.',
    })
  },
)

export async function apiFetch<T>(
  path: string,
  options: RequestOptions & {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: unknown
  } = {},
): Promise<T> {
  const { method = 'GET', body, params, headers, signal } = options

  const response = await api.request<T>({
    url: path,
    method,
    data: body,
    params,
    headers,
    signal,
  })

  return response.data
}

export async function backendFetch<T>(
  path: string,
  options: RequestOptions & {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: unknown
  } = {},
): Promise<T> {
  const { method = 'GET', body, params, headers, signal } = options

  const response = await backendApi.request<T>({
    url: path,
    method,
    data: body,
    params,
    headers,
    signal,
  })

  return response.data
}

export async function apiUpload<T>(
  path: string,
  formData: FormData,
  options: RequestOptions = {},
): Promise<T> {
  const response = await api.request<T>({
    url: path,
    method: 'POST',
    data: formData,
    params: options.params,
    signal: options.signal,
    headers: {
      ...options.headers,
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}
