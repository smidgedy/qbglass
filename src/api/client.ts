export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(`/api/v2${path}`, {
    credentials: 'include',
    ...options,
  })
  if (res.status === 403) {
    throw new ApiError(403, 'Unauthorized')
  }
  if (!res.ok) {
    throw new ApiError(res.status, await res.text())
  }
  return res
}

export async function apiPost(path: string, data?: Record<string, string>): Promise<Response> {
  return apiFetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: data ? new URLSearchParams(data).toString() : undefined,
  })
}

export async function apiGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = params ? `${path}?${new URLSearchParams(params)}` : path
  const res = await apiFetch(url)
  return res.json()
}
