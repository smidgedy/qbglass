import { apiGet } from './client'
import type { MainDataResponse } from './types'

export async function fetchMainData(rid: number): Promise<MainDataResponse> {
  return apiGet<MainDataResponse>('/sync/maindata', { rid: String(rid) })
}
