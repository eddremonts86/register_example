// Self-contained Query Provider with mock TanStack Query functionality
// This provides the same interface without external dependencies

'use client'

import React from 'react'

// Types
type QueryKey = Array<string | number | Record<string, unknown>>
type QueryFn<T> = () => Promise<T>

// Mock QueryClient implementation
class MockQueryClient {
  private cache: Map<string, unknown> = new Map()
  private invalidationListeners: Set<() => void> = new Set()

  // Add cache subscription
  onCacheChange(listener: () => void) {
    this.invalidationListeners.add(listener)
    return () => this.invalidationListeners.delete(listener)
  }

  // Mock methods that match TanStack Query API
  prefetchQuery<T>(options: {
    queryKey: QueryKey
    queryFn: QueryFn<T>
    staleTime?: number
  }) {
    const key = JSON.stringify(options.queryKey)

    if (!this.cache.has(key)) {
      options.queryFn().then(data => {
        this.cache.set(key, data)
        this.invalidationListeners.forEach(listener => listener())
      })
    }
  }

  invalidateQueries(options?: { queryKey?: QueryKey }) {
    if (options?.queryKey) {
      const prefix = JSON.stringify(options.queryKey)
      for (const key of this.cache.keys()) {
        if (key.startsWith(prefix)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
    this.invalidationListeners.forEach(listener => listener())
  }

  removeQueries(options: { queryKey: QueryKey }) {
    const key = JSON.stringify(options.queryKey)
    this.cache.delete(key)
    this.invalidationListeners.forEach(listener => listener())
  }

  clear() {
    this.cache.clear()
    this.invalidationListeners.forEach(listener => listener())
  }

  getQueryData(queryKey: QueryKey) {
    const key = JSON.stringify(queryKey)
    return this.cache.get(key)
  }

  setQueryData(queryKey: QueryKey, data: unknown) {
    const key = JSON.stringify(queryKey)
    this.cache.set(key, data)
    this.invalidationListeners.forEach(listener => listener())
  }

  // Get cache size (for DevTools)
  getCacheSize() {
    return this.cache.size
  }
}

// Create global query client instance
const queryClient = new MockQueryClient()

// Query Provider Component
interface QueryProviderProps {
  children: React.ReactNode
  client?: MockQueryClient
}

const QueryClientContext = React.createContext<MockQueryClient>(queryClient)

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

    return unsubscribe
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

// Export only the component (for Fast Refresh compatibility)
export default QueryProvider

// Hooks module - separate from component exports
const QueryHooks = {
  useQueryClient(): MockQueryClient {
    return React.useContext(QueryClientContext)
  },

  useQuery<T = unknown>(options: {
    queryKey: QueryKey
    queryFn: QueryFn<T>
    enabled?: boolean
    staleTime?: number
    cacheTime?: number
    refetchOnWindowFocus?: boolean
    retry?: number | boolean
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
  }) {
    const [data, setData] = React.useState<T | undefined>(undefined)
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<Error | null>(null)
    const [isError, setIsError] = React.useState(false)
    const [isFetching, setIsFetching] = React.useState(false)

    const client = QueryHooks.useQueryClient()
    const queryKey = options.queryKey
    const enabled = options.enabled !== false

    const fetchData = React.useCallback(async () => {
      if (!enabled) return

      setIsLoading(true)
      setIsFetching(true)
      setError(null)
      setIsError(false)

      try {
        // Check cache first
        const cached = client.getQueryData(queryKey) as T
        if (cached) {
          setData(cached)
          setIsLoading(false)
          setIsFetching(false)
          options.onSuccess?.(cached)
          return
        }

        // Fetch new data
        const result = await options.queryFn()
        client.setQueryData(queryKey, result)
        setData(result)
        options.onSuccess?.(result)
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err))
        setError(errorObj)
        setIsError(true)
        options.onError?.(errorObj)
      } finally {
        setIsLoading(false)
        setIsFetching(false)
      }
    }, [enabled, queryKey, options, client])

    React.useEffect(() => {
      fetchData()
    }, [fetchData])

    return {
      data,
      error,
      isLoading,
      isError,
      isFetching,
      isSuccess: !isLoading && !isError && data !== undefined,
      refetch: fetchData,
      status: isLoading ? 'loading' : isError ? 'error' : 'success'
    }
  },

  useMutation<TData = unknown, TVariables = unknown>(options: {
    mutationFn: (variables: TVariables) => Promise<TData>
    onSuccess?: (data: TData, variables: TVariables, context?: unknown) => void
    onError?: (error: Error, variables: TVariables, context?: unknown) => void
    onMutate?: (variables: TVariables) => Promise<unknown> | unknown
    onSettled?: (data: TData | undefined, error: Error | null, variables: TVariables, context?: unknown) => void
  }) {
    const [data, setData] = React.useState<TData | undefined>(undefined)
    const [error, setError] = React.useState<Error | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const [isError, setIsError] = React.useState(false)

    const mutate = React.useCallback(async (variables: TVariables) => {
      setIsLoading(true)
      setError(null)
      setIsError(false)

      let context: unknown
      try {
        // Call onMutate if provided
        if (options.onMutate) {
          context = await options.onMutate(variables)
        }

        const result = await options.mutationFn(variables)
        setData(result)

        options.onSuccess?.(result, variables, context)
        options.onSettled?.(result, null, variables, context)

        return result
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err))
        setError(errorObj)
        setIsError(true)

        options.onError?.(errorObj, variables, context)
        options.onSettled?.(undefined, errorObj, variables, context)

        throw errorObj
      } finally {
        setIsLoading(false)
      }
    }, [options])

    const mutateAsync = mutate

    return {
      mutate,
      mutateAsync,
      data,
      error,
      isLoading,
      isError,
      isSuccess: !isLoading && !isError && data !== undefined,
      status: isLoading ? 'loading' : isError ? 'error' : data !== undefined ? 'success' : 'idle'
    }
  }
}

// Export hooks separately
export const useQueryClient = QueryHooks.useQueryClient
export const useQuery = QueryHooks.useQuery
export const useMutation = QueryHooks.useMutation
