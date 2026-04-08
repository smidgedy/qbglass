import { useState, useCallback, createContext, useContext } from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'
import { clsx } from 'clsx'

interface ToastMessage {
  id: number
  text: string
  type: 'success' | 'error'
}

interface ToastContextType {
  toast: (text: string, type?: 'success' | 'error') => void
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

let nextId = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  const toast = useCallback((text: string, type: 'success' | 'error' = 'success') => {
    const id = nextId++
    setMessages((prev) => [...prev, { id, text, type }])
    setTimeout(() => setMessages((prev) => prev.filter((m) => m.id !== id)), 3000)
  }, [])

  const dismiss = (id: number) => setMessages((prev) => prev.filter((m) => m.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 pointer-events-none md:bottom-6 md:left-auto md:right-6 md:translate-x-0">
        {messages.map((m) => (
          <div
            key={m.id}
            className={clsx(
              'pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg animate-slide-up',
              m.type === 'success' ? 'bg-accent-green/20 text-accent-green border border-accent-green/30' : 'bg-accent-red/20 text-accent-red border border-accent-red/30',
            )}
            style={{ backdropFilter: 'blur(16px)' }}
          >
            {m.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {m.text}
            <button onClick={() => dismiss(m.id)} className="ml-1 opacity-60 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
