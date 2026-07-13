import { createContext, useContext } from 'react'

export const ToastContext = createContext(null)

// Safe outside the provider (no-ops) so components stay testable in isolation.
const noop = { success: () => {}, error: () => {} }

export function useToast() {
  return useContext(ToastContext) || noop
}
