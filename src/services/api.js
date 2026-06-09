import axios from 'axios'

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()

export const api = axios.create({
  baseURL: configuredApiUrl || (import.meta.env.DEV ? 'http://localhost:5000/api' : ''),
  timeout: 12000,
})

api.interceptors.request.use((config) => {
  if (!configuredApiUrl && import.meta.env.PROD && !localDemoEnabled()) {
    return Promise.reject(new Error('Missing production API URL. Set VITE_API_URL to the deployed backend /api URL.'))
  }

  if (!apiSyncEnabled()) {
    return Promise.reject(new Error('API synchronization is disabled for local demo mode.'))
  }

  const token = localStorage.getItem('pbxcom-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function apiMessage(error, fallback = 'The server is not available.') {
  return error?.response?.data?.message ?? error?.message ?? fallback
}

export function localDemoEnabled() {
  return import.meta.env.VITE_ENABLE_LOCAL_DEMO === 'true' || localStorage.getItem('pbxcom-token')?.startsWith('mock-jwt-')
}

export function apiSyncEnabled() {
  return Boolean(configuredApiUrl) || !localDemoEnabled()
}

export async function fileToAttachment(file) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Unable to read attachment.'))
    reader.readAsDataURL(file)
  })

  return {
    name: file.name,
    type: file.type || 'application/octet-stream',
    size: file.size,
    dataUrl,
  }
}
