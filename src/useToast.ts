import * as React from 'react'
type ToastMessage = { id: number; title: string; description?: string }
let nextId = 0
const listeners = new Set<(message: ToastMessage | null) => void>()
let current: ToastMessage | null = null
export function toast({ title, description }: Omit<ToastMessage, 'id'>) {
  current = { id: ++nextId, title, description }
  listeners.forEach(fn => fn(current))
  return { id: current.id, dismiss: () => { current = null; listeners.forEach(fn => fn(null)) } }
}
export function useToast() {
  const [message, setMessage] = React.useState<ToastMessage | null>(current)
  React.useEffect(() => { listeners.add(setMessage); return () => { listeners.delete(setMessage) } }, [])
  React.useEffect(() => { if (!message) return; const timer = setTimeout(() => { current = null; listeners.forEach(fn => fn(null)) }, 3500); return () => clearTimeout(timer) }, [message])
  return { message, toast }
}
