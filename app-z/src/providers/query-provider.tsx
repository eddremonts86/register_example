// Self-contained Query Provider with mock TanStack Query functionality
// This provides the same interface without external dependencies

'use client'

import React from 'react'
import { MockQueryClient, QueryClientContext, queryClient } from '../hooks/query-hooks'

// Query Provider Component
interface QueryProviderProps {
  children: React.ReactNode
  client?: MockQueryClient
}

export function QueryProvider({ children, client = queryClient }: QueryProviderProps) {
  return (
    <QueryClientContext.Provider value={client}>
      {children}
      <ReactQueryDevtools />
    </QueryClientContext.Provider>
  )
}

// Mock DevTools component
function ReactQueryDevtools() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [cacheSize, setCacheSize] = React.useState(0)
  const client = React.useContext(QueryClientContext)

  React.useEffect(() => {
    const updateCacheSize = () => {
      setCacheSize(client.getCacheSize())
    }

    // Update cache size when cache changes
    const unsubscribe = client.onCacheChange(updateCacheSize)
    updateCacheSize()

    return () => {
      unsubscribe()
    }
  }, [client])

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
          onClick={() => setIsOpen(true)}
          type="button"
          aria-label="Open React Query DevTools"
        >
          ⚛️ Query DevTools
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-50 h-48 p-4 text-sm font-sans">
      <div className="flex justify-between items-center mb-4">
        <h3 className="m-0 text-sm font-bold">Query DevTools (Mock)</h3>
        <button
          className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm transition-colors"
          onClick={() => setIsOpen(false)}
          type="button"
          aria-label="Close DevTools"
        >
          ✕
        </button>
      </div>

      <div className="text-xs text-gray-600">
        <p>📦 Cache Entries: {cacheSize}</p>
        <p>🔄 Active Queries: {cacheSize}</p>
        <p className="mt-4 font-mono">
          Mock implementation - Install @tanstack/react-query-devtools for full features
        </p>
      </div>
    </div>
  )
}

export default QueryProvider
