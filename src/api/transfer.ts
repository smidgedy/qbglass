import { apiPost } from './client'

export async function toggleSpeedLimitsMode(): Promise<void> {
  await apiPost('/transfer/toggleSpeedLimitsMode')
}
