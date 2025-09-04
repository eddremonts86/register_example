import { useEffect } from 'react';
import { useTableData } from './hooks/api-client';
import { QueryProvider } from './providers/query-provider';
import { useTableStore, type TableData } from './stores/table-store';

// Datos de muestra para productos compatibles con TableData
const initialProducts: TableData[] = [
  {
    id: 1,
    code: 'PROD-001',
    name: 'Laptop Gaming Pro',
    category: 'Electrónicos',
    price: 1299.99,
    stock: 15,
    description: 'Laptop de alta gama para gaming',
  },
  {
    id: 2,
    code: 'PROD-002',
    name: 'Mouse Inalámbrico',
    category: 'Accesorios',
    price: 29.99,
    stock: 50,
    description: 'Mouse ergonómico inalámbrico',
  },
  {
    id: 3,
    code: 'PROD-003',
    name: 'Teclado Mecánico',
    category: 'Accesorios',
    price: 89.99,
    stock: 25,
    description: 'Teclado mecánico RGB',
  },
  {
    id: 4,
    code: 'PROD-004',
    name: 'Monitor 4K',
    category: 'Electrónicos',
    price: 349.99,
    stock: 8,
    description: 'Monitor 27" 4K Ultra HD',
  },
];

// Componente de tabla simple que usa el store
function SimpleTable() {
  const tableStore = useTableStore();

  // Simular llamada a API
  const { data: apiData, isLoading } = useTableData('/api/products');

  // Configurar datos iniciales
  useEffect(() => {
    if (!isLoading && !apiData) {
      tableStore.setData(initialProducts);
    }
  }, [isLoading, apiData, tableStore]);

  // Configurar datos de API si están disponibles
  useEffect(() => {
    if (apiData?.data) {
      tableStore.setData(apiData.data);
    }
  }, [apiData, tableStore]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🛍️ Gestión de Productos - App Y (Mejorada)
        </h1>
        <p className="text-gray-600">
          Sistema usando los nuevos componentes mejorados del registry
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Estado de la Tabla</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <strong>Total de productos:</strong> {tableStore.data.length}
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <strong>Página actual:</strong> {tableStore.pagination.pageIndex + 1}
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <strong>Filas por página:</strong> {tableStore.pagination.pageSize}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Código</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Categoría</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Precio</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Descripción</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableStore.filteredData.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{String(product.code || '')}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{String(product.name || '')}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{String(product.category || '')}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${Number(product.price || 0)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={Number(product.stock || 0) < 10 ? 'text-red-600 font-medium' : 'text-green-600'}>
                      {Number(product.stock || 0)} unidades
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{String(product.description || '')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Controles de paginación */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => tableStore.previousPage()}
              disabled={!tableStore.canPreviousPage()}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => tableStore.nextPage()}
              disabled={!tableStore.canNextPage()}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          <div className="text-sm text-gray-700">
            Mostrando {tableStore.pagination.pageIndex * tableStore.pagination.pageSize + 1} a{' '}
            {Math.min((tableStore.pagination.pageIndex + 1) * tableStore.pagination.pageSize, tableStore.totalRows)} de{' '}
            {tableStore.totalRows} productos
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
        <h3 className="font-medium text-green-900 mb-2">✅ Componentes Mejorados Integrados:</h3>
        <ul className="text-green-800 text-sm space-y-1">
          <li>• ✨ Store de estado con useTableStore (sin dependencias de Zustand)</li>
          <li>• 🌐 Cliente API con useTableData (mock de TanStack Query)</li>
          <li>• 🔧 Provider de queries con DevTools incluidos</li>
          <li>• 📊 Estado de tabla completamente funcional</li>
          <li>• 🚀 Listo para producción - solo reemplazar mocks con librerías reales</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
        <h3 className="font-medium text-blue-900 mb-2">🔄 Funcionalidades Demostradas:</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Estado reactivo de tabla con paginación</li>
          <li>• Carga de datos con hooks API</li>
          <li>• Interfaz responsiva y moderna</li>
          <li>• Componentes autocontenidos del registry</li>
        </ul>
      </div>
    </div>
  );
}

// Componente principal de la app
function App() {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-gray-50">
        <SimpleTable />
      </div>
    </QueryProvider>
  );
}

export default App;
