import * as React from "react"

const Toast = React.createContext<{
  toast: (props: any) => void
} | undefined>(undefined)

export function useToast() {
  const context = React.useContext(Toast)
  if (!context) {
    return {
      toast: (props: any) => {
        console.log('[v0] Toast:', props)
      }
    }
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<any[]>([])

  const toast = (props: any) => {
    const id = Math.random()
    setToasts(prev => [...prev, { ...props, id }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  return (
    <Toast.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded-md text-sm ${
              t.variant === 'destructive'
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            {t.title && <div className="font-semibold">{t.title}</div>}
            {t.description && <div>{t.description}</div>}
          </div>
        ))}
      </div>
    </Toast.Provider>
  )
}
