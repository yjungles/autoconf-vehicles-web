export function storageUrl(path: string): string {
  const base = import.meta.env.VITE_BACKEND_BASE_URL
  return `${base}/storage/${path}`
}
