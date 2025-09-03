// Self-contained table store with mock Zustand functionality
// This provides the same interface without external dependencies

import React from 'react'

// Types for table data
export interface TableData {
  id: string | number
  [key: string]: unknown
}

export interface ColumnDef {
  id: string
  header: string
  accessorKey?: string
  accessor?: (row: TableData) => unknown
  cell?: (props: { getValue: () => unknown; row: { original: TableData } }) => React.ReactNode
  enableSorting?: boolean
  enableFiltering?: boolean
  meta?: {
    type?: 'text' | 'number' | 'date' | 'boolean' | 'select'
    options?: Array<{ label: string; value: string }>
  }
}

export interface TableFilters {
  [key: string]: string | number | boolean | null
}

export interface SortingState {
  id: string
  desc: boolean
}

export interface PaginationState {
  pageIndex: number
  pageSize: number
}

export interface TableState {
  // Data
  data: TableData[]
  filteredData: TableData[]
  columns: ColumnDef[]

  // Pagination
  pagination: PaginationState
  totalRows: number

  // Sorting
  sorting: SortingState[]

  // Filtering
  filters: TableFilters
  globalFilter: string

  // Selection
  rowSelection: Record<string, boolean>
  selectedRows: TableData[]

  // Editing
  editingRows: Record<string, boolean>
  editingData: Record<string, Partial<TableData> | undefined>

  // Loading states
  isLoading: boolean
  isError: boolean
  error: string | null

  // Actions
  setData: (data: TableData[]) => void
  setColumns: (columns: ColumnDef[]) => void

  // Pagination actions
  setPageIndex: (pageIndex: number) => void
  setPageSize: (pageSize: number) => void
  nextPage: () => void
  previousPage: () => void
  canNextPage: () => boolean
  canPreviousPage: () => boolean

  // Sorting actions
  setSorting: (sorting: SortingState[]) => void
  toggleSorting: (columnId: string) => void
  clearSorting: () => void

  // Filtering actions
  setFilters: (filters: TableFilters) => void
  setFilter: (columnId: string, value: string | number | boolean | null) => void
  setGlobalFilter: (filter: string) => void
  clearFilters: () => void

  // Selection actions
  setRowSelection: (selection: Record<string, boolean>) => void
  toggleRowSelection: (rowId: string) => void
  toggleAllRowsSelection: () => void
  clearRowSelection: () => void

  // Editing actions
  setEditingRows: (editingRows: Record<string, boolean>) => void
  toggleRowEditing: (rowId: string) => void
  setEditingData: (rowId: string, data: Partial<TableData>) => void
  saveEditingRow: (rowId: string) => void
  cancelEditingRow: (rowId: string) => void

  // Loading actions
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void

  // Utility actions
  reset: () => void
  addRow: (row: TableData) => void
  updateRow: (rowId: string | number, data: Partial<TableData>) => void
  deleteRow: (rowId: string | number) => void
  deleteSelectedRows: () => void
}

// Custom hook to use the table store with React state
export function useTableStore() {
  const [state, setState] = React.useState<Omit<TableState, keyof TableActions>>(() => ({
    data: [],
    filteredData: [],
    columns: [],
    pagination: { pageIndex: 0, pageSize: 10 },
    totalRows: 0,
    sorting: [],
    filters: {},
    globalFilter: '',
    rowSelection: {},
    selectedRows: [],
    editingRows: {},
    editingData: {} as Record<string, Partial<TableData> | undefined>,
    isLoading: false,
    isError: false,
    error: null,
  }))

  // Type for table actions
  type TableActions = Pick<TableState,
    | 'setData' | 'setColumns'
    | 'setPageIndex' | 'setPageSize' | 'nextPage' | 'previousPage' | 'canNextPage' | 'canPreviousPage'
    | 'setSorting' | 'toggleSorting' | 'clearSorting'
    | 'setFilters' | 'setFilter' | 'setGlobalFilter' | 'clearFilters'
    | 'setRowSelection' | 'toggleRowSelection' | 'toggleAllRowsSelection' | 'clearRowSelection'
    | 'setEditingRows' | 'toggleRowEditing' | 'setEditingData' | 'saveEditingRow' | 'cancelEditingRow'
    | 'setLoading' | 'setError'
    | 'reset' | 'addRow' | 'updateRow' | 'deleteRow' | 'deleteSelectedRows'
  >

  // Memoize actions to prevent re-renders
  const actions = React.useMemo(() => ({
    setData: (data: TableData[]) => setState(prev => ({
      ...prev,
      data,
      filteredData: data,
      totalRows: data.length,
    })),

    setColumns: (columns: ColumnDef[]) => setState(prev => ({ ...prev, columns })),

    setPageIndex: (pageIndex: number) => setState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, pageIndex }
    })),

    setPageSize: (pageSize: number) => setState(prev => ({
      ...prev,
      pagination: { pageIndex: 0, pageSize }
    })),

    nextPage: () => setState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, pageIndex: prev.pagination.pageIndex + 1 }
    })),

    previousPage: () => setState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, pageIndex: Math.max(0, prev.pagination.pageIndex - 1) }
    })),

    canNextPage: () => {
      const totalPages = Math.ceil(state.totalRows / state.pagination.pageSize)
      return state.pagination.pageIndex < totalPages - 1
    },

    canPreviousPage: () => state.pagination.pageIndex > 0,

    setSorting: (sorting: SortingState[]) => setState(prev => ({ ...prev, sorting })),

    toggleSorting: (columnId: string) => setState(prev => {
      const existingSort = prev.sorting.find(s => s.id === columnId)
      if (!existingSort) {
        return { ...prev, sorting: [{ id: columnId, desc: false }] }
      }
      if (!existingSort.desc) {
        return { ...prev, sorting: [{ id: columnId, desc: true }] }
      }
      return { ...prev, sorting: [] }
    }),

    clearSorting: () => setState(prev => ({ ...prev, sorting: [] })),

    setFilters: (filters: TableFilters) => setState(prev => ({ ...prev, filters })),

    setFilter: (columnId: string, value: string | number | boolean | null) => setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [columnId]: value }
    })),

    setGlobalFilter: (globalFilter: string) => setState(prev => ({ ...prev, globalFilter })),

    clearFilters: () => setState(prev => ({ ...prev, filters: {}, globalFilter: '' })),

    setRowSelection: (rowSelection: Record<string, boolean>) => setState(prev => {
      const selectedRows = prev.data.filter(row => rowSelection[String(row.id)])
      return { ...prev, rowSelection, selectedRows }
    }),

    toggleRowSelection: (rowId: string) => setState(prev => {
      const newSelection = { ...prev.rowSelection }
      newSelection[rowId] = !newSelection[rowId]
      const selectedRows = prev.data.filter(row => newSelection[String(row.id)])
      return { ...prev, rowSelection: newSelection, selectedRows }
    }),

    toggleAllRowsSelection: () => setState(prev => {
      const allSelected = prev.data.every(row => prev.rowSelection[String(row.id)])
      const newSelection: Record<string, boolean> = {}

      if (!allSelected) {
        prev.data.forEach(row => {
          newSelection[String(row.id)] = true
        })
      }

      const selectedRows = allSelected ? [] : prev.data
      return { ...prev, rowSelection: newSelection, selectedRows }
    }),

    clearRowSelection: () => setState(prev => ({ ...prev, rowSelection: {}, selectedRows: [] })),

    setEditingRows: (editingRows: Record<string, boolean>) => setState(prev => ({ ...prev, editingRows })),

    toggleRowEditing: (rowId: string) => setState(prev => ({
      ...prev,
      editingRows: { ...prev.editingRows, [rowId]: !prev.editingRows[rowId] }
    })),

    setEditingData: (rowId: string, data: Partial<TableData>) => setState(prev => ({
      ...prev,
      editingData: { ...prev.editingData, [rowId]: { ...prev.editingData[rowId], ...data } }
    })),

    saveEditingRow: (rowId: string) => setState(prev => {
      const editData = prev.editingData[rowId]
      if (editData) {
        const updatedData = prev.data.map(row =>
          String(row.id) === rowId ? { ...row, ...editData } : row
        )
        return {
          ...prev,
          data: updatedData,
          filteredData: updatedData,
          editingRows: { ...prev.editingRows, [rowId]: false },
          editingData: { ...prev.editingData, [rowId]: undefined }
        }
      }
      return prev
    }),

    cancelEditingRow: (rowId: string) => setState(prev => ({
      ...prev,
      editingRows: { ...prev.editingRows, [rowId]: false },
      editingData: { ...prev.editingData, [rowId]: undefined }
    })),

    setLoading: (isLoading: boolean) => setState(prev => ({ ...prev, isLoading })),
    setError: (error: string | null) => setState(prev => ({ ...prev, error, isError: !!error })),

    reset: () => setState({
      data: [],
      filteredData: [],
      columns: [],
      pagination: { pageIndex: 0, pageSize: 10 },
      totalRows: 0,
      sorting: [],
      filters: {},
      globalFilter: '',
      rowSelection: {},
      selectedRows: [],
      editingRows: {},
      editingData: {} as Record<string, Partial<TableData> | undefined>,
      isLoading: false,
      isError: false,
      error: null,
    }),

    addRow: (row: TableData) => setState(prev => {
      const newData = [...prev.data, row]
      return {
        ...prev,
        data: newData,
        filteredData: newData,
        totalRows: newData.length
      }
    }),

    updateRow: (rowId: string | number, data: Partial<TableData>) => setState(prev => {
      const updatedData = prev.data.map(row =>
        row.id === rowId ? { ...row, ...data } : row
      )
      return {
        ...prev,
        data: updatedData,
        filteredData: updatedData
      }
    }),

    deleteRow: (rowId: string | number) => setState(prev => {
      const filteredData = prev.data.filter(row => row.id !== rowId)
      return {
        ...prev,
        data: filteredData,
        filteredData,
        totalRows: filteredData.length,
        rowSelection: Object.fromEntries(
          Object.entries(prev.rowSelection).filter(([id]) => id !== String(rowId))
        )
      }
    }),

    deleteSelectedRows: () => setState(prev => {
      const selectedIds = Object.keys(prev.rowSelection).filter(
        id => prev.rowSelection[id]
      )
      const filteredData = prev.data.filter(
        row => !selectedIds.includes(String(row.id))
      )
      return {
        ...prev,
        data: filteredData,
        filteredData,
        totalRows: filteredData.length,
        rowSelection: {},
        selectedRows: []
      }
    })
  }), [state])

  return {
    ...state,
    ...actions
  }
}

// Export default hook
export default useTableStore
