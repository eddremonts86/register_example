# 🚀 How to Install Components in a New App

## Prerequisites

1. **Start the Registry Server** (from the registry provider app-x):
```bash
cd myApp/app-x
npm run start-registry-server
```
This will serve the component registry at `http://localhost:5173`

## Method 1: Using Shadcn/UI CLI (Recommended)

### Step 1: Install Shadcn CLI in your new app
```bash
cd your-new-app
npm install -D shadcn@latest
```

### Step 2: Initialize Shadcn configuration
```bash
npx shadcn@latest init
```

### Step 3: Configure your `components.json` to use our custom registry
Edit your `components.json` file to include:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  },
  "url": "http://localhost:5173/r"
}
```

### Step 4: Install the interactive-table component
```bash
npx shadcn@latest add interactive-table
```

## Method 2: Direct HTTP Installation

### Using direct URL
```bash
npx shadcn@latest add http://localhost:5173/r/interactive-table.json
```

## Method 3: Manual Installation

### Step 1: Download the component
```bash
curl -o interactive-table.tsx http://localhost:5173/r/interactive-table.json
```

### Step 2: Extract and place in your components folder
Parse the JSON response and extract the component code to place in:
```
src/components/interactive-table/interactive-table.tsx
```

## Available Components in Registry

- **interactive-table**: Main table component with inline editing
- **table-basic**: Basic table UI components
- **input-basic**: Basic input component
- **pagination**: Pagination component

## Example Usage After Installation

```tsx
import { InteractiveTable } from '@/components/interactive-table/interactive-table'

// Your data
const data = [
  { id: 1, name: "John", email: "john@example.com", age: 30 },
  { id: 2, name: "Jane", email: "jane@example.com", age: 25 }
]

// Column configuration
const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    isEditable: true,
    onCellUpdate: (id, value) => console.log('Updated:', id, value)
  },
  {
    accessorKey: 'email',
    header: 'Email',
    isEditable: true
  },
  {
    accessorKey: 'age',
    header: 'Age'
  }
]

function App() {
  return (
    <InteractiveTable
      data={data}
      columns={columns}
      rowKey="id"
    />
  )
}
```

## Troubleshooting

### Registry Server Not Running
```bash
# Check if registry is accessible
curl http://localhost:5173/r/registry.json

# If not working, restart registry server
cd myApp/app-x
npm run start-registry-server
```

### Component Not Found
```bash
# List available components
curl http://localhost:5173/r/registry.json

# Check specific component
curl http://localhost:5173/r/interactive-table.json
```

### CLI Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall shadcn
npm uninstall -D shadcn
npm install -D shadcn@latest

# Try again
npx shadcn@latest add interactive-table
```

## Registry URLs

- **Registry Index**: `http://localhost:5173/r/registry.json`
- **Interactive Table**: `http://localhost:5173/r/interactive-table.json`
- **Basic Table**: `http://localhost:5173/r/table-basic.json`
- **Basic Input**: `http://localhost:5173/r/input-basic.json`
