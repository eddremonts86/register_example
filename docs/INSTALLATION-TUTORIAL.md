# 📋 Step-by-Step Component Installation Guide

## 🎯 Quick Start for New Apps

### Step 1: Ensure Registry Server is Running

First, start the registry server from the main project:

```bash
# Navigate to registry provider
cd myApp/app-x

# Start registry server (serves components at localhost:5173)
npm run start-registry-server
```

The server will show:
```
Serving!
- Local:    http://localhost:5173
- Network:  http://172.20.10.11:5173
```

### Step 2: Create Your New React App

```bash
# Create new React app with Vite
npm create vite@latest my-new-app -- --template react-ts
cd my-new-app
npm install
```

### Step 3: Install Required Dependencies

```bash
# Install Tailwind CSS (required for styling)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install Shadcn CLI
npm install -D shadcn@latest

# Install component dependencies
npm install class-variance-authority clsx tailwind-merge
```

### Step 4: Configure Tailwind CSS

Edit `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add to `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 5: Initialize Shadcn in Your Project

```bash
npx shadcn@latest init
```

When prompted, choose:
- TypeScript: Yes
- Style: Default
- Base color: Neutral
- CSS variables: Yes

### Step 6: Configure Custom Registry

Edit the generated `components.json` file:

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

### Step 7: Install the Interactive Table Component

```bash
# Install from our custom registry
npx shadcn@latest add interactive-table

# Or install directly via URL
npx shadcn@latest add http://localhost:5173/r/interactive-table.json
```

### Step 8: Use the Component

Create `src/App.tsx`:

```tsx
import { InteractiveTable } from '@/components/interactive-table/interactive-table'

const sampleData = [
  { id: 1, name: "John Doe", email: "john@example.com", age: 30, city: "New York" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", age: 25, city: "Los Angeles" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", age: 35, city: "Chicago" }
]

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    isEditable: true,
    onCellUpdate: (id: string | number, newValue: string | number) => {
      console.log(`Updated row ${id}: name = ${newValue}`)
    }
  },
  {
    accessorKey: 'email',
    header: 'Email',
    isEditable: true,
    onCellUpdate: (id: string | number, newValue: string | number) => {
      console.log(`Updated row ${id}: email = ${newValue}`)
    }
  },
  {
    accessorKey: 'age',
    header: 'Age',
    isEditable: true,
    onCellUpdate: (id: string | number, newValue: string | number) => {
      console.log(`Updated row ${id}: age = ${newValue}`)
    }
  },
  {
    accessorKey: 'city',
    header: 'City'
  }
]

function App() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Interactive Table Demo</h1>
      <InteractiveTable 
        data={sampleData} 
        columns={columns}
        rowKey="id"
      />
    </div>
  )
}

export default App
```

### Step 9: Configure Path Aliases

Edit `vite.config.ts`:

```typescript
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

Install path types:
```bash
npm install -D @types/node
```

### Step 10: Run Your App

```bash
npm run dev
```

## 🎉 Features You Get

- ✅ **Inline Editing**: Click any editable cell to modify
- ✅ **Auto-save**: Changes save automatically onBlur
- ✅ **TypeScript**: Full type support
- ✅ **Responsive**: Works on all screen sizes
- ✅ **Customizable**: Easy to extend and style

## 🔧 Troubleshooting

### Registry Not Found
```bash
# Check if registry server is running
curl http://localhost:5173/r/registry.json

# If not, restart registry server
cd myApp/app-x
npm run start-registry-server
```

### Component Installation Failed
```bash
# Clear npm cache
npm cache clean --force

# Reinstall shadcn
npm uninstall -D shadcn
npm install -D shadcn@latest

# Try direct URL installation
npx shadcn@latest add http://localhost:5173/r/interactive-table.json
```

### TypeScript Errors
```bash
# Install missing types
npm install -D @types/react @types/react-dom @types/node

# Check tsconfig.json includes path mapping
```

## 📚 Available Components

From our registry at `http://localhost:5173/r/`:

- `interactive-table` - Main editable table component
- `table-basic` - Basic table UI components
- `input-basic` - Basic input component  
- `pagination` - Pagination component

## 🚀 Next Steps

1. Customize the table styling
2. Add more columns and data
3. Implement server-side data persistence
4. Add validation for editable fields
5. Extend with additional component features
