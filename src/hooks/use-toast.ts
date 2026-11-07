import * as React from 'react'

type Toast = { id: string; title: string; description?: string }
const listeners = new Set<(toast: Toast | null) => void>()
let current: Toast | null = null
let nextId = 0

function broadcast(toast: Toast | null) {
  current = toast
  listeners.forEach(listener => listener(current))
}
export function toast(title: string, description?: string) {
  const item = { id: String(++nextId), title, description }
  broadcast(item)
  return { dismiss: () => broadcast(null) }
}
export function useToast() {
  const [activeToast, setActiveToast] = React.useState<Toast | null>(current)
  React.useEffect(() => {
    listeners.add(setActiveToast)
    return () => { listeners.delete(setActiveToast) }
  }, [])
  return { activeToast, dismiss: () => broadcast(null), toast }
}
