# Copilot Instructions for Shared Table Components System

## Language & Communication
- **English is mandatory** for all code, comments, documentation, and commit messages.
- Use clear, descriptive naming for components, functions, and variables.
- Document complex component interfaces and API patterns.

## Project Architecture & Structure

### 🏗️ Multi-App Component Registry System
- **app-x**: Registry provider with distributable components and demo
- **app-y**: Client app - Product Management with shared table components
- **app-z**: Client app - Multi-domain dashboard with shared components
- **docs/**: Single unified documentation source (`README.md` only)

### 📁 Directory Structure Standards
- **Registry components** (`app-x/registry/`): JSON distribution files for shadcn CLI
- **Source components** (`app-x/src/`): Original component implementations
- **Client apps** (`app-y/`, `app-z/`): Consume components via registry installation
- **Component folders**: Include main `.tsx`, `types.ts`, `index.ts`, and related files
- **No redundant docs**: Keep only `docs/README.md` - eliminate scattered documentation

## TypeScript & Component Development

### 🔧 Strict Typing Requirements
- **Zero tolerance for `any`**: Use proper interfaces and types
- **Component interfaces**: Define clear props and return types
- **Generic components**: Use `<T>` for reusable table components with `TableData<T>`
- **Mock implementations**: Self-contained without external dependencies
- **Type safety**: All component interactions must be type-safe

### 🧩 Component Architecture Patterns
- **Self-contained components**: No external dependencies (mock Zustand, TanStack Query)
- **Provider pattern**: Use context providers for state and API management
- **Custom hooks**: Separate business logic from UI components
- **Store pattern**: Reactive state management with clear action interfaces
- **Registry distribution**: Components must be shadcn CLI compatible

## Component Registry & Distribution

### 📦 Registry System Standards
- **Port consistency**: Registry server on `localhost:8080` (Python server.py)
- **shadcn CLI integration**: All components distributed via `npx shadcn@latest add`
- **JSON manifests**: Proper component metadata in registry files
- **Component installation**: Use `components.json` with proper aliases
- **Version control**: Track registry changes and component updates

### 🔄 Installation Workflow
```bash
# Registry server (app-x)
python server.py  # Port 8080

# Component installation (client apps)
npx shadcn@latest add http://localhost:8080/r/{component}.json

# Aliases in components.json
"aliases": {
  "components": "@/components",
  "utils": "@/lib/utils",
  "stores": "@/stores",
  "hooks": "@/hooks",
  "providers": "@/providers"
}
```

## UI & State Management Patterns

### 🎨 Design System Standards
- **Tailwind CSS**: All styling via Tailwind classes
- **Responsive design**: Mobile-first approach with proper breakpoints
- **Component variants**: Use `class-variance-authority` for component variations
- **Consistent spacing**: Follow 4px grid system (p-4, m-2, gap-6, etc.)
- **Color scheme**: Use neutral palette with accent colors for actions

### 📊 Table Component Standards
- **Interactive tables**: Editable cells, pagination, filtering, sorting
- **Data structure**: Use `TableData` interface with `id` and dynamic properties
- **State management**: Reactive stores with clear action methods
- **Auto-save**: Implicit saving without user intervention
- **Type-safe columns**: Proper column definitions with accessor functions

### 🔄 State Management Patterns
```typescript
// Store interface pattern
interface TableStore {
  data: TableData[];
  filteredData: TableData[];
  pagination: PaginationState;

  // Actions
  setData: (data: TableData[]) => void;
  updateRow: (id: string | number, updates: Partial<TableData>) => void;

  // Pagination
  nextPage: () => void;
  previousPage: () => void;
}

// API client pattern
const { data, isLoading, error } = useTableData('/api/endpoint');
```

## Code Quality & Standards

### ✅ Development Workflow
- **Component development**: Build in app-x, test with demo, distribute via registry
- **Client integration**: Install via shadcn CLI, integrate with existing app logic
- **Multi-app testing**: Verify components work across different client applications
- **Documentation updates**: Keep single README.md updated with all changes

### 🔍 Quality Verification
```bash
# Build verification
npm run build  # Must pass without errors

# TypeScript checking
npx tsc --noEmit  # Zero type errors

# Component testing
npm run dev  # Verify all apps run on different ports

# Registry verification
curl http://localhost:8080/r/registry.json  # Verify registry accessibility
```

## Application-Specific Patterns

### 🛍️ App-Y (Product Management)
- **Domain**: Product catalog with pricing, inventory, categories
- **Components**: Single table with product-specific formatting
- **Features**: Price formatting, stock warnings, category filtering
- **Port**: 5175

### 🌐 App-Z (Multi-Domain Dashboard)
- **Domain**: Financial, HR, and Inventory data
- **Components**: Tabbed interface with domain-specific tables
- **Features**: Multi-domain navigation, specialized data formatting
- **Port**: 5176

### 🔧 App-X (Registry Provider)
- **Domain**: Component demonstration and distribution
- **Components**: Source components with demo implementations
- **Features**: Registry server, component testing, distribution
- **Port**: 8080 (registry), 5173 (demo)

## Development Commands & Scripts

### 🚀 Quick Start Commands
```bash
# Start all applications
cd app-x && python server.py &  # Registry server
cd app-x && npm run dev &       # Demo app
cd app-y && npm run dev &       # Product management
cd app-z && npm run dev &       # Multi-domain dashboard

# Component installation
npx shadcn@latest add http://localhost:8080/r/interactive-table.json
npx shadcn@latest add http://localhost:8080/r/table-store.json
npx shadcn@latest add http://localhost:8080/r/api-client.json
npx shadcn@latest add http://localhost:8080/r/query-provider.json
```

### 🔧 Development Utilities
```bash
# Registry testing
curl http://localhost:8080/r/registry.json
node test-registry.js

# Component verification
ls src/stores src/hooks src/providers  # Verify installation
npx tsc --noEmit                       # Type checking
```

## Documentation Standards

### 📖 Single Source of Truth
- **Only one doc**: `docs/README.md` contains ALL project information
- **No scattered docs**: Eliminate duplicate or partial documentation
- **Complete coverage**: Installation, usage, APIs, troubleshooting
- **Up-to-date examples**: Real code snippets that work with current implementation

### 📝 Documentation Sections Required
1. **🎯 Vision & Overview**: Project purpose and capabilities
2. **🏗️ Architecture**: System structure and component relationships
3. **🛠️ Installation**: Complete setup instructions
4. **📖 Usage Guide**: Practical implementation examples
5. **🔌 API Reference**: Component interfaces and hooks
6. **⚡ Quick Commands**: Development and troubleshooting commands
7. **📈 Current Status**: System state and running applications
8. **🎉 Migration Info**: Upgrade paths and benefits

## Error Handling & Debugging

### 🐛 Common Issues & Solutions
- **Registry server down**: Check port 8080, restart Python server
- **Component installation fails**: Verify `components.json` and registry URL
- **TypeScript errors**: Check imports and type definitions
- **App crashes**: Verify all dependencies and mock implementations
- **Port conflicts**: Use specific ports (8080, 5173, 5175, 5176)

### 🔧 Debugging Workflow
1. **Verify registry**: `curl http://localhost:8080/r/registry.json`
2. **Check TypeScript**: `npx tsc --noEmit`
3. **Validate installation**: Check component files in correct directories
4. **Test functionality**: Verify table operations and state management
5. **Document fixes**: Update README.md with solution if needed

## Best Practices Summary

### ✨ Component Development
- Build self-contained components with mock dependencies
- Use TypeScript interfaces for all data structures
- Implement reactive state management patterns
- Ensure components work across multiple client applications

### 🔄 Registry Management
- Maintain registry server on consistent port (8080)
- Use shadcn CLI for all component distribution
- Version component changes properly
- Test installation in client applications

### 📚 Documentation Maintenance
- Keep only `docs/README.md` - eliminate all other docs
- Update documentation with every significant change
- Include working code examples and commands
- Maintain current system status information

### 🎯 Development Focus
- Prioritize component reusability across applications
- Ensure type safety in all interactions
- Maintain consistent UI/UX patterns
- Test multi-application integration thoroughly

---

**Goal**: Maintain a clean, efficient system for sharing React table components across multiple applications with excellent developer experience and zero external dependencies.
