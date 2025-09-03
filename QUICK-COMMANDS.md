# 📋 Installation Commands - Quick Reference

## 🚀 Prerequisites
```bash
# Start registry server
cd myApp/app-x
npm run start-registry-server
# ✅ Server running at: http://localhost:5173
```

## 🎯 Install Commands

### Option 1: Install All Components at Once
```bash
npx shadcn@latest add http://localhost:5173/r/interactive-table.json http://localhost:5173/r/table-store.json http://localhost:5173/r/api-client.json http://localhost:5173/r/query-provider.json
```

### Option 2: Install Individual Components
```bash
# Interactive Table (React Component)
npx shadcn@latest add http://localhost:5173/r/interactive-table.json

# Table Store (Zustand State Management)
npx shadcn@latest add http://localhost:5173/r/table-store.json

# API Client (TanStack Query Hooks)
npx shadcn@latest add http://localhost:5173/r/api-client.json

# Query Provider (TanStack Query Provider)
npx shadcn@latest add http://localhost:5173/r/query-provider.json
```

## 📦 Install Dependencies
```bash
# Zustand for state management
npm install zustand

# TanStack Query for API management
npm install @tanstack/react-query @tanstack/react-query-devtools
```

## ✅ Verify Installation
```bash
# Check if registry is accessible
curl http://localhost:5173/r/registry.json

# List all available components
curl -s http://localhost:5173/r/registry.json | grep '"name"'
```

## 🎉 What You Get
- ✅ **Interactive Table**: React component with inline editing
- ✅ **Table Store**: Complete Zustand state management
- ✅ **API Client**: TanStack Query CRUD operations
- ✅ **Query Provider**: Pre-configured provider with DevTools

Ready to build professional table applications! 🚀
