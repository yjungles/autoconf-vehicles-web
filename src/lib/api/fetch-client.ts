const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type RequestOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>
}

function buildUrl(path: string, params?: RequestOptions['params']) {
  const url = new URL(`${API_BASE_URL}${path}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    })
  }

  return url.toString()
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const body = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    throw body
  }

  return body as T
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...rest } = options

  const response = await fetch(buildUrl(path, params), {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  })

  return parseResponse<T>(response)
}

export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  return parseResponse<T>(response)
}
