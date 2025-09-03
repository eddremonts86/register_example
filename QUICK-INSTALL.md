# 🚀 Quick Install Guide

## Prerequisites
1. **Registry server running**: `http://localhost:5173`
2. **React app** with TypeScript and Tailwind CSS

## Quick Installation Commands

```bash
# 1. Install Shadcn CLI
npm install -D shadcn@latest

# 2. Initialize Shadcn
npx shadcn@latest init

# 3. Install our component
npx shadcn@latest add http://localhost:5173/r/interactive-table.json
```

## Usage Example

```tsx
import { InteractiveTable } from '@/components/interactive-table/interactive-table'

const data = [
  { id: 1, name: "John", email: "john@example.com", age: 30 }
]

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    isEditable: true,
    onCellUpdate: (id, value) => console.log('Updated:', id, value)
  }
]

function App() {
  return <InteractiveTable data={data} columns={columns} rowKey="id" />
}
```

## Test Registry Access

```bash
# Check registry is accessible
curl http://localhost:5173/r/registry.json

# Check specific component
curl http://localhost:5173/r/interactive-table.json
```

## Current Status
✅ Registry Server: http://localhost:5173
✅ Component Available: interactive-table
✅ Auto-contained: No external dependencies
✅ TypeScript Support: Full type definitions included
