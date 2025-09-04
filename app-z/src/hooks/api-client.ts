// Self-contained API client with mock TanStack Query functionality
// This provides the same interface without external dependencies

// Types for API responses
interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

interface TableData {
  id: string | number
  [key: string]: unknown
}

// Define RequestInit type for our API client
interface ApiRequestInit {
  method?: string
  headers?: Record<string, string>
  body?: string
}

// API Client class
class ApiClient {
  private baseURL: string

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: ApiRequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`

    const config: ApiRequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        data,
        status: response.status
      }
    } catch (error) {
      throw new Error(`API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // GET requests
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  // POST requests
  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT requests
  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PATCH requests
  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE requests
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Create API client instance
export const apiClient = new ApiClient()

// Query keys factory with mutable arrays
export const tableQueryKeys = {
  all: ['table'] as Array<string>,
  lists: () => ['table', 'list'] as Array<string>,
  list: (filters: Record<string, unknown>) => ['table', 'list', { filters }] as Array<string | Record<string, unknown>>,
  details: () => ['table', 'detail'] as Array<string>,
  detail: (id: string | number) => ['table', 'detail', id] as Array<string | number>,
}

// Mock useQuery hook for development without TanStack Query
import React from 'react'

function useQuery<T>(options: {
  queryKey: Array<string | number | Record<string, unknown>>
  queryFn: () => Promise<T>
  enabled?: boolean
  staleTime?: number
  cacheTime?: number
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}) {
  const [data, setData] = React.useState<T | undefined>(undefined)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const fetchData = React.useCallback(async () => {
    if (options.enabled === false) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await options.queryFn()
      setData(result)
      options.onSuccess?.(result)
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err))
      setError(errorObj)
      options.onError?.(errorObj)
    } finally {
      setIsLoading(false)
    }
  }, [options])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    isError: !!error,
    isSuccess: !isLoading && !error && !!data
  }
}

// Mock useMutation hook
function useMutation<TData, TVariables>(options: {
  mutationFn: (variables: TVariables) => Promise<TData>
  onSuccess?: (data: TData, variables: TVariables) => void
  onError?: (error: Error, variables: TVariables) => void
  onMutate?: (variables: TVariables) => void
}) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const [data, setData] = React.useState<TData | undefined>(undefined)

  const mutate = React.useCallback(async (variables: TVariables) => {
    setIsLoading(true)
    setError(null)

    try {
      options.onMutate?.(variables)
      const result = await options.mutationFn(variables)
      setData(result)
      options.onSuccess?.(result, variables)
      return result
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err))
      setError(errorObj)
      options.onError?.(errorObj, variables)
      throw errorObj
    } finally {
      setIsLoading(false)
    }
  }, [options])

  return {
    mutate,
    data,
    error,
    isLoading,
    isError: !!error,
    isSuccess: !isLoading && !error && !!data
  }
}

// Custom hooks for table data management

// Fetch table data with pagination and filters
interface UseTableDataOptions {
  page?: number
  pageSize?: number
  filters?: Record<string, unknown>
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  enabled?: boolean
}

export function useTableData(
  endpoint: string,
  options: UseTableDataOptions = {}
) {
  const { page = 1, pageSize = 10, filters = {}, sortBy, sortOrder = 'asc', enabled = true } = options

  return useQuery({
    queryKey: tableQueryKeys.list({ page, pageSize, filters, sortBy, sortOrder }),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(sortBy && { sortBy, sortOrder }),
        ...Object.fromEntries(
          Object.entries(filters).map(([key, value]) => [key, String(value)])
        )
      })

      const response = await apiClient.get<PaginatedResponse<TableData>>(`${endpoint}?${params}`)
      return response.data
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Fetch single row data
export function useTableRow(
  endpoint: string,
  id: string | number
) {
  return useQuery({
    queryKey: tableQueryKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<TableData>(`${endpoint}/${id}`)
      return response.data
    },
    enabled: Boolean(id),
  })
}

// Create new row
export function useCreateTableRow(endpoint: string) {
  return useMutation({
    mutationFn: async (data: Partial<TableData>) => {
      return apiClient.post<TableData>(endpoint, data)
    },
    onSuccess: () => {
      console.log('Row created successfully')
      // In real TanStack Query, this would invalidate queries
    },
  })
}

// Update existing row
export function useUpdateTableRow(endpoint: string) {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Partial<TableData> }) => {
      return apiClient.patch<TableData>(`${endpoint}/${id}`, data)
    },
    onSuccess: (_, { id }) => {
      console.log(`Row ${id} updated successfully`)
      // In real TanStack Query, this would invalidate specific queries
    },
  })
}

// Delete row
export function useDeleteTableRow(endpoint: string) {
  return useMutation({
    mutationFn: async (id: string | number) => {
      return apiClient.delete<void>(`${endpoint}/${id}`)
    },
    onSuccess: (_, id) => {
      console.log(`Row ${id} deleted successfully`)
      // In real TanStack Query, this would remove from cache
    },
  })
}

// Bulk update rows
export function useBulkUpdateTableRows(endpoint: string) {
  return useMutation({
    mutationFn: async (updates: Array<{ id: string | number; data: Partial<TableData> }>) => {
      return apiClient.post<TableData[]>(`${endpoint}/bulk-update`, { updates })
    },
    onSuccess: () => {
      console.log('Bulk update completed successfully')
      // In real TanStack Query, this would invalidate all table queries
    },
  })
}

// Bulk delete rows
export function useBulkDeleteTableRows(endpoint: string) {
  return useMutation({
    mutationFn: async (ids: Array<string | number>) => {
      return apiClient.post<void>(`${endpoint}/bulk-delete`, { ids })
    },
    onSuccess: (_, ids) => {
      console.log(`Bulk delete completed: ${ids.length} rows`)
      // In real TanStack Query, this would remove all deleted items from cache
    },
  })
}

// Export API client for direct use
export { ApiClient }
export type { ApiResponse, PaginatedResponse, TableData, UseTableDataOptions }
