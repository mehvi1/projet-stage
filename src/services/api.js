import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
  timeout: 12000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pbxcom-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function apiMessage(error, fallback = 'The server is not available.') {
  return error?.response?.data?.message ?? error?.message ?? fallback
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
