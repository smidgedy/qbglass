import { apiPost, apiFetch } from './client'

export async function login(username: string, password: string): Promise<boolean> {
  const res = await apiPost('/auth/login', { username, password })
  const text = await res.text()
  return text === 'Ok.'
}

export async function logout(): Promise<void> {
  await apiPost('/auth/logout')
}

export async function checkAuth(): Promise<boolean> {
  try {
    await apiFetch('/app/version')
    return true
  } catch {
    return false
  }
}
