// Query hooks for mock TanStack Query functionality
// Separated from components to maintain Fast Refresh compatibility

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

// Context for query client
const QueryClientContext = React.createContext<MockQueryClient>(queryClient)

// Hook to get query client
export function useQueryClient(): MockQueryClient {
  return React.useContext(QueryClientContext)
}

// Mock useQuery hook
export function useQuery<T = unknown>(options: {
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

  const client = useQueryClient()
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
}

// Mock useMutation hook
export function useMutation<TData = unknown, TVariables = unknown>(options: {
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

// Export the context and client for provider
export { MockQueryClient, QueryClientContext, queryClient }
export type { QueryFn, QueryKey }
