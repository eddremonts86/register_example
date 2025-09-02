# MVP: Aplicaciones React con Componente de Tabla Compartido

Este proyecto demuestra la implementación de un MVP que incluye dos aplicaciones React que comparten un componente de tabla interactiva con funcionalidad de guardado implícito.

## 🏗️ Arquitectura del Proyecto

```
myApp/
├── app-x/                    # Proveedor del componente
│   ├── src/
│   │   ├── components/
│   │   │   └── interactive-table/
│   │   │       ├── InteractiveTable.tsx
│   │   │       ├── EditableCell.tsx
│   │   │       ├── types.ts
│   │   │       └── index.ts
│   │   └── App.tsx          # Demo del componente
│   └── package.json
└── app-y/                   # Consumidor del componente
    ├── src/
    │   ├── components/
    │   │   └── interactive-table/  # Componente copiado desde App X
    │   └── App.tsx          # Aplicación de gestión de inventario
    └── package.json
```

## 🚀 Características Implementadas

### ✅ Componente de Tabla Interactiva (App X)
- **7 columnas** de datos configurables
- **4 columnas editables** con guardado implícito
- **Evento onBlur** para detectar cambios automáticamente
- **TypeScript** con tipos genéricos para máxima reutilización
- **Shadcn/UI** para componentes base (Table, Input)
- **Tailwind CSS** para estilos consistentes

### ✅ Guardado Implícito
- Sin botones de "Guardar" explícitos
- Detección automática de cambios al perder el foco
- Soporte para tecla Enter como confirmación
- Feedback visual durante la edición

### ✅ Arquitectura de Dos Aplicaciones
- **App X**: Desarrolla y mantiene el componente de tabla
- **App Y**: Consume el componente con su propia lógica de negocio
- **Separación clara** de responsabilidades
- **Comunicación** a través de props y callbacks

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm o pnpm

### Instalación

1. **Clonar el proyecto**
```bash
cd /ruta/a/tu/workspace/myApp
```

2. **Configurar App X (Proveedor)**
```bash
cd app-x
npm install
npm run dev
```

3. **Configurar App Y (Consumidor)**
```bash
cd app-y
npm install
npm run dev
```

### Ejecución

- **App X**: http://localhost:5173 (puerto por defecto)
- **App Y**: http://localhost:5174 (puerto automático siguiente)

## 📊 Funcionalidades por Aplicación

### App X - Demostración de Usuarios
| Columna | Tipo | Editable | Función Callback |
|---------|------|----------|------------------|
| ID | number | ❌ | - |
| Nombre de Usuario | string | ✅ | `handleUserNameChange` |
| Email | string | ✅ | `handleEmailChange` |
| Nombre | string | ❌ | - |
| Apellido | string | ❌ | - |
| Edad | number | ✅ | `handleAgeChange` |
| Departamento | string | ✅ | `handleDepartmentChange` |

### App Y - Gestión de Inventario
| Columna | Tipo | Editable | Función Callback |
|---------|------|----------|------------------|
| ID | number | ❌ | - |
| Código | string | ✅ | `handleProductCodeChange` |
| Nombre del Producto | string | ✅ | `handleProductNameChange` |
| Categoría | string | ❌ | - |
| Precio | number | ✅ | `handlePriceChange` |
| Stock | number | ✅ | `handleStockChange` |
| Descripción | string | ❌ | - |

## 🔧 API del Componente

### Props Principales

```typescript
interface InteractiveTableProps<T> {
  data: T[];                    // Datos a mostrar
  columns: ColumnDef<T>[];      // Definición de columnas
  rowKey?: keyof T;             // Clave única (default: 'id')
  onRowUpdate?: (row: T) => void; // Callback de fila completa
}
```

### Definición de Columna

```typescript
interface ColumnDef<T> {
  accessorKey: keyof T;         // Clave del dato
  header: string;               // Texto del encabezado
  isEditable?: boolean;         // Si es editable
  onCellUpdate?: (id, value) => void; // Callback de celda
  cell?: (value, row) => ReactNode;   // Renderizado custom
}
```

### Ejemplo de Uso

```typescript
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    isEditable: true,
    onCellUpdate: (rowId, newValue) => {
      // Tu lógica de actualización aquí
      updateUser(rowId, { name: newValue });
    }
  }
];

<InteractiveTable
  data={users}
  columns={columns}
  rowKey="id"
/>
```

## 🎯 Flujo de Guardado Implícito

1. **Usuario hace clic** en una celda editable
2. **Se activa el modo edición** (highlight visual)
3. **Usuario escribe** el nuevo valor
4. **Usuario pierde el foco** (clic fuera, Tab, Enter)
5. **Se dispara onBlur** automáticamente
6. **Se ejecuta onCellUpdate** con el nuevo valor
7. **App Y actualiza** su estado y llama a su API

## 🧪 Testing y Debugging

### Consola del Navegador
Ambas aplicaciones logean eventos importantes:
- 🔄 Inicio de actualización
- 🌐 Llamadas a API simuladas
- ✅ Confirmación de éxito
- ❌ Errores (si ocurren)

### Verificación Visual
- Highlight durante la edición
- Iconos ✏️ para columnas editables
- Feedback de hover en celdas
- Indicadores de estado (si se implementan)

## 🔄 Compartir Componente

### Método Actual: Copia Directa
Los componentes se copian directamente entre aplicaciones para simplificar la demostración.

### Método de Producción: Módulo NPM
Para un entorno de producción, se recomienda:

1. **Construir biblioteca**
```bash
cd app-x
npm run build-lib
```

2. **Publicar en registro privado**
```bash
npm publish --registry=tu-registro-privado
```

3. **Instalar en App Y**
```bash
npm install @tu-org/interactive-table
```

## 📁 Estructura de Archivos Clave

```
interactive-table/
├── types.ts              # Interfaces TypeScript
├── EditableCell.tsx      # Celda editable con onBlur
├── InteractiveTable.tsx  # Componente principal
└── index.ts             # Exportaciones públicas
```

## 🎨 Personalización

### Estilos
- Modifica `tailwind.config.js` para colores personalizados
- Usa variables CSS custom para temas
- Extiende componentes Shadcn/UI según necesidad

### Comportamiento
- Personaliza el evento de guardado (onBlur, onChange, etc.)
- Añade validaciones antes del guardado
- Implementa debounce para múltiples cambios rápidos

## 🚨 Consideraciones de Producción

### Seguridad
- Validar datos en el servidor
- Sanitizar entrada del usuario
- Implementar autenticación/autorización

### Performance
- Implementar paginación para datasets grandes
- Usar React.memo para evitar re-renders innecesarios
- Considerar virtualización para miles de filas

### UX
- Añadir indicadores de carga
- Implementar manejo de errores robusto
- Añadir confirmaciones para cambios críticos

## 📚 Tecnologías Utilizadas

- **React 18+** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Bundler y servidor de desarrollo
- **Tailwind CSS** - Framework de estilos
- **Shadcn/UI** - Componentes base
- **Class Variance Authority** - Variantes de componentes

## 🤝 Contribución

Para contribuir al proyecto:

1. Realizar cambios en el componente en **App X**
2. Copiar cambios a **App Y** para testing
3. Verificar que ambas aplicaciones funcionen correctamente
4. Documentar nuevas características o cambios de API

## 📄 Licencia

Este proyecto es una demostración educativa del concepto MVP de componentes compartidos.

---

**Desarrollado como MVP para demostrar arquitectura de componentes compartidos entre aplicaciones React** 🚀
