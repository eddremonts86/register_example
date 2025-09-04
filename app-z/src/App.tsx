import { useEffect, useState } from 'react';
import { QueryProvider } from './providers/query-provider';
import { useTableStore, type TableData } from './stores/table-store';
import { useTableData } from './hooks/api-client';

// 💰 Financial Instruments Data
const financialData: TableData[] = [
  {
    id: 1,
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    price: 182.50,
    volume: 45234567,
    change: '+2.3%',
  },
  {
    id: 2,
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Technology',
    price: 2750.80,
    volume: 1234567,
    change: '+1.5%',
  },
  {
    id: 3,
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    sector: 'Technology',
    price: 415.20,
    volume: 32567890,
    change: '-0.8%',
  },
  {
    id: 4,
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    sector: 'E-commerce',
    price: 145.67,
    volume: 45678901,
    change: '+3.1%',
  },
];

// 👥 Employee Data  
const employeeData: TableData[] = [
  {
    id: 1,
    employeeId: 'EMP-001',
    name: 'Juan Pérez',
    department: 'Ingeniería',
    salary: 75000,
    experience: 5,
    status: 'Activo',
  },
  {
    id: 2,
    employeeId: 'EMP-002',
    name: 'María García',
    department: 'Marketing',
    salary: 65000,
    experience: 3,
    status: 'Activo',
  },
  {
    id: 3,
    employeeId: 'EMP-003',
    name: 'Carlos López',
    department: 'Ventas',
    salary: 55000,
    experience: 7,
    status: 'Vacaciones',
  },
  {
    id: 4,
    employeeId: 'EMP-004',
    name: 'Ana Martínez',
    department: 'RRHH',
    salary: 60000,
    experience: 4,
    status: 'Activo',
  },
];

// 📦 Inventory Data
const inventoryData: TableData[] = [
  {
    id: 1,
    sku: 'SKU-001',
    name: 'Laptop Dell XPS 13',
    category: 'Electrónicos',
    cost: 999.99,
    quantity: 25,
    supplier: 'Dell Direct',
  },
  {
    id: 2,
    sku: 'SKU-002',
    name: 'Mouse Logitech MX',
    category: 'Accesorios',
    cost: 79.99,
    quantity: 150,
    supplier: 'Logitech Inc.',
  },
  {
    id: 3,
    sku: 'SKU-003',
    name: 'Monitor LG 27"',
    category: 'Pantallas',
    cost: 299.99,
    quantity: 40,
    supplier: 'LG Electronics',
  },
  {
    id: 4,
    sku: 'SKU-004',
    name: 'Teclado Mecánico',
    category: 'Accesorios',
    cost: 129.99,
    quantity: 75,
    supplier: 'Cherry Corp',
  },
];

// Componente de tabla reutilizable
interface TableSectionProps {
  title: string;
  description: string;
  icon: string;
  data: TableData[];
  columns: { key: string; label: string; type?: 'text' | 'number' | 'currency' }[];
}

function TableSection({ title, description, icon, data, columns }: TableSectionProps) {
  const tableStore = useTableStore();

  useEffect(() => {
    tableStore.setData(data);
  }, [data, tableStore]);

  const formatValue = (value: unknown, type?: string) => {
    if (value === null || value === undefined) return '';
    
    switch (type) {
      case 'currency':
        return `$${Number(value).toLocaleString()}`;
      case 'number':
        return Number(value).toLocaleString();
      default:
        return String(value);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4 grid grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded">
            <strong>Total registros:</strong> {tableStore.data.length}
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <strong>Página:</strong> {tableStore.pagination.pageIndex + 1}
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <strong>Por página:</strong> {tableStore.pagination.pageSize}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableStore.filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                      {formatValue(row[column.key], column.type)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
            {tableStore.totalRows} registros
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente principal con múltiples dominios
function MultiDomainDashboard() {
  const [activeTab, setActiveTab] = useState<'financial' | 'employees' | 'inventory'>('financial');
  
  // Simular llamadas a API para cada dominio
  const { isLoading: financialLoading } = useTableData('/api/financial');
  const { isLoading: employeesLoading } = useTableData('/api/employees');
  const { isLoading: inventoryLoading } = useTableData('/api/inventory');

  const tabs = [
    {
      id: 'financial' as const,
      label: '💰 Instrumentos Financieros',
      icon: '📈',
      title: 'Instrumentos Financieros',
      description: 'Mercado de valores y acciones en tiempo real',
      data: financialData,
      columns: [
        { key: 'symbol', label: 'Símbolo' },
        { key: 'name', label: 'Empresa' },
        { key: 'sector', label: 'Sector' },
        { key: 'price', label: 'Precio', type: 'currency' as const },
        { key: 'volume', label: 'Volumen', type: 'number' as const },
        { key: 'change', label: 'Cambio' },
      ],
      loading: financialLoading,
    },
    {
      id: 'employees' as const,
      label: '👥 Empleados',
      icon: '👨‍💼',
      title: 'Gestión de Empleados',
      description: 'Personal y recursos humanos de la empresa',
      data: employeeData,
      columns: [
        { key: 'employeeId', label: 'ID Empleado' },
        { key: 'name', label: 'Nombre' },
        { key: 'department', label: 'Departamento' },
        { key: 'salary', label: 'Salario', type: 'currency' as const },
        { key: 'experience', label: 'Experiencia (años)', type: 'number' as const },
        { key: 'status', label: 'Estado' },
      ],
      loading: employeesLoading,
    },
    {
      id: 'inventory' as const,
      label: '📦 Inventario',
      icon: '📋',
      title: 'Control de Inventario',
      description: 'Gestión de productos y almacén',
      data: inventoryData,
      columns: [
        { key: 'sku', label: 'SKU' },
        { key: 'name', label: 'Producto' },
        { key: 'category', label: 'Categoría' },
        { key: 'cost', label: 'Costo', type: 'currency' as const },
        { key: 'quantity', label: 'Cantidad', type: 'number' as const },
        { key: 'supplier', label: 'Proveedor' },
      ],
      loading: inventoryLoading,
    },
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab)!;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          🌐 Dashboard Multi-Dominio - App Z (Mejorada)
        </h1>
        <p className="text-lg text-gray-600">
          Sistema integrado usando los nuevos componentes mejorados del registry
        </p>
      </div>

      {/* Navegación por pestañas */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido de la pestaña activa */}
      {activeTabData.loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando datos de {activeTabData.title.toLowerCase()}...</div>
        </div>
      ) : (
        <TableSection
          title={activeTabData.title}
          description={activeTabData.description}
          icon={activeTabData.icon}
          data={activeTabData.data}
          columns={activeTabData.columns}
        />
      )}

      {/* Información de mejoras */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-400">
          <h3 className="font-medium text-green-900 mb-3">✅ Componentes Mejorados Integrados:</h3>
          <ul className="text-green-800 text-sm space-y-2">
            <li>• ✨ Store de estado unificado para múltiples dominios</li>
            <li>• 🌐 Cliente API con hooks especializados</li>
            <li>• 🔧 Provider de queries con gestión de estado</li>
            <li>• 📊 Componentes de tabla reutilizables</li>
            <li>• 🚀 Arquitectura escalable para N dominios</li>
          </ul>
        </div>

        <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <h3 className="font-medium text-blue-900 mb-3">🔄 Funcionalidades Demostradas:</h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>• Navegación entre dominios (Financial, HR, Inventory)</li>
            <li>• Estado independiente por pestaña</li>
            <li>• Formateo de datos especializado</li>
            <li>• Paginación y filtrado automático</li>
            <li>• Carga asíncrona de datos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Componente principal de la app
function App() {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-gray-50">
        <MultiDomainDashboard />
      </div>
    </QueryProvider>
  );
}

export default App;
