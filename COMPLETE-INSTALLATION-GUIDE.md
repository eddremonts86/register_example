# 🚀 Component Installation Commands - Zustand + TanStack Query

## Available Components

### 1. **Interactive Table** (React Component)
- ✅ Editable table with inline editing
- ✅ TypeScript support
- ✅ Self-contained (no external dependencies)

### 2. **Table Store** (Zustand State Management)
- ✅ Complete table state management
- ✅ Pagination, filtering, sorting
- ✅ Row selection and editing states
- ✅ Persistence with localStorage
- ✅ Redux DevTools integration

### 3. **API Client** (TanStack Query Hooks)
- ✅ CRUD operations for table data
- ✅ Caching and background updates
- ✅ Optimistic updates
- ✅ Error handling and retries
- ✅ Bulk operations

### 4. **Query Provider** (TanStack Query Provider)
- ✅ Pre-configured QueryClient
- ✅ React Query DevTools
- ✅ Error boundaries
- ✅ Optimized defaults for table apps

## Installation Commands

### Prerequisites
```bash
# Ensure registry server is running
cd myApp/app-x
npm run start-registry-server
# Server will run at: http://localhost:5173
```

### Install Individual Components

```bash
# 1. Install Interactive Table (UI Component)
npx shadcn@latest add http://localhost:5173/r/interactive-table.json

# 2. Install Table Store (Zustand State Management)
npx shadcn@latest add http://localhost:5173/r/table-store.json

# 3. Install API Client (TanStack Query Hooks)
npx shadcn@latest add http://localhost:5173/r/api-client.json

# 4. Install Query Provider (TanStack Query Provider)
npx shadcn@latest add http://localhost:5173/r/query-provider.json
```

### Install Complete Stack (All Components)

```bash
# Install all components at once
npx shadcn@latest add http://localhost:5173/r/interactive-table.json http://localhost:5173/r/table-store.json http://localhost:5173/r/api-client.json http://localhost:5173/r/query-provider.json
```

### Required Dependencies

After installing components, install the required dependencies:

```bash
# For Table Store (Zustand)
npm install zustand

# For API Client & Query Provider (TanStack Query)
npm install @tanstack/react-query @tanstack/react-query-devtools
```

## Usage Example: Complete Integration

### 1. Setup Query Provider (App.tsx)
```tsx
import { QueryProvider } from './providers/query-provider'
import { TableApp } from './components/TableApp'

function App() {
  return (
    <QueryProvider showDevtools={true}>
      <TableApp />
    </QueryProvider>
  )
}
```

### 2. Create Table Component with Store and API
```tsx
import { useEffect } from 'react'
import { InteractiveTable } from './components/interactive-table/interactive-table'
import { useTableStore } from './stores/table-store'
import { useTableData, useUpdateTableRow } from './hooks/api-client'

export function TableApp() {
  const {
    data,
    columns,
    currentPage,
    pageSize,
    setData,
    setColumns,
    updateRow,
    setPage
  } = useTableStore()

  // Fetch data with TanStack Query
  const {
    data: apiData,
    isLoading,
    error
  } = useTableData('/users', {
    page: currentPage,
    pageSize,
    enabled: true
  })

  // Update mutation
  const updateMutation = useUpdateTableRow('/users')

  // Initialize data
  useEffect(() => {
    if (apiData?.data) {
      setData(apiData.data)
    }
  }, [apiData, setData])

  // Initialize columns
  useEffect(() => {
    const tableColumns = [
      {
        accessorKey: 'name',
        header: 'Name',
        isEditable: true,
        onCellUpdate: (id: string | number, newValue: string | number) => {
          // Update local store
          updateRow(id, { name: newValue })

          // Update via API
          updateMutation.mutate({
            id,
            data: { name: newValue }
          })
        }
      },
      {
        accessorKey: 'email',
        header: 'Email',
        isEditable: true,
        onCellUpdate: (id: string | number, newValue: string | number) => {
          updateRow(id, { email: newValue })
          updateMutation.mutate({
            id,
            data: { email: newValue }
          })
        }
      },
      {
        accessorKey: 'age',
        header: 'Age',
        isEditable: true,
        onCellUpdate: (id: string | number, newValue: string | number) => {
          updateRow(id, { age: Number(newValue) })
          updateMutation.mutate({
            id,
            data: { age: Number(newValue) }
          })
        }
      }
    ]

    setColumns(tableColumns)
  }, [setColumns, updateRow, updateMutation])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users Table</h1>

      <InteractiveTable
        data={data}
        columns={columns}
        rowKey="id"
      />

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-3 py-1">
          Page {currentPage} of {apiData?.pagination?.totalPages || 0}
        </span>

        <button
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage >= (apiData?.pagination?.totalPages || 0)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
```

## Component Features

### 🗃️ **Table Store Features**
- ✅ **State Management**: Complete table state (data, pagination, filters, sorting)
- ✅ **Row Selection**: Single and bulk selection
- ✅ **Editing State**: Track which cells are being edited
- ✅ **Persistence**: Save user preferences to localStorage
- ✅ **DevTools**: Redux DevTools integration for debugging

### 🌐 **API Client Features**
- ✅ **CRUD Operations**: Create, Read, Update, Delete
- ✅ **Bulk Operations**: Bulk update and delete
- ✅ **Caching**: Intelligent caching with stale-while-revalidate
- ✅ **Background Updates**: Automatic refetching
- ✅ **Optimistic Updates**: Immediate UI updates
- ✅ **Error Handling**: Retry logic and error boundaries

### 🎛️ **Query Provider Features**
- ✅ **Pre-configured**: Optimized settings for table applications
- ✅ **DevTools**: React Query DevTools integration
- ✅ **Error Boundaries**: Graceful error handling
- ✅ **Performance**: Optimized cache times and retry logic

## Verification Commands

```bash
# Check if registry is accessible
curl http://localhost:5173/r/registry.json

# Check individual components
curl http://localhost:5173/r/table-store.json
curl http://localhost:5173/r/api-client.json
curl http://localhost:5173/r/query-provider.json

# List all available components
curl http://localhost:5173/r/registry.json | jq '.items[].name'
```

## 🎯 Benefits of This Stack

1. **🔄 State Synchronization**: Zustand store + TanStack Query work together
2. **⚡ Performance**: Optimized caching and background updates
3. **🛠️ Developer Experience**: DevTools for both state and queries
4. **🔌 Easy Integration**: Drop-in components with minimal setup
5. **🔧 Type Safety**: Full TypeScript support throughout
6. **📱 Production Ready**: Error handling, retries, and persistence

¡Todo listo para crear aplicaciones de tablas interactivas de nivel profesional! 🚀
