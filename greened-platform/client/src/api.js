const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function api(path, options = {}) {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API}${path}`, { ...options, headers })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export function uploadFile(path, file, fields = {}) {
  const token = localStorage.getItem('token')
  const formData = new FormData()
  Object.entries(fields).forEach(([k, v]) => formData.append(k, v))
  formData.append('image', file)
  return fetch(`${API}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  }).then(async (r) => ({ status: r.status, body: await r.json() }))
}

