import { useState } from 'react';
import type { ColumnDef } from './components/interactive-table';
import { InteractiveTable } from './components/interactive-table';

// Interfaz para los datos del producto (diferente dominio de negocio)
interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

// Datos de muestra para productos
const initialProducts: Product[] = [
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

function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // Simulación de llamadas a API para demostrar la integración
  const simulateApiCall = (endpoint: string, data: unknown) => {
    return new Promise((resolve) => {
      console.log(`🌐 [API] POST ${endpoint}`, data);
      setTimeout(() => {
        console.log(`✅ [API] Respuesta exitosa de ${endpoint}`);
        resolve({ success: true, message: 'Actualizado correctamente' });
      }, 800);
    });
  };

  // Función para manejar cambios en el código del producto
  const handleProductCodeChange = async (rowId: string | number, newValue: string | number) => {
    console.log(`🔄 Actualizando código del producto ${rowId}: ${newValue}`);

    // Actualizar estado local inmediatamente para UX responsiva
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === rowId
          ? { ...product, code: String(newValue) }
          : product
      )
    );

    // Simular llamada a API del backend de App Y
    try {
      await simulateApiCall(`/api/products/${rowId}/code`, { code: newValue });
    } catch (error) {
      console.error('❌ Error al actualizar código:', error);
    }
  };

  // Función para manejar cambios en el nombre del producto
  const handleProductNameChange = async (rowId: string | number, newValue: string | number) => {
    console.log(`🔄 Actualizando nombre del producto ${rowId}: ${newValue}`);

    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === rowId
          ? { ...product, name: String(newValue) }
          : product
      )
    );

    try {
      await simulateApiCall(`/api/products/${rowId}/name`, { name: newValue });
    } catch (error) {
      console.error('❌ Error al actualizar nombre:', error);
    }
  };

  // Función para manejar cambios en el precio
  const handlePriceChange = async (rowId: string | number, newValue: string | number) => {
    console.log(`🔄 Actualizando precio del producto ${rowId}: $${newValue}`);

    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === rowId
          ? { ...product, price: Number(newValue) }
          : product
      )
    );

    try {
      await simulateApiCall(`/api/products/${rowId}/price`, { price: newValue });
    } catch (error) {
      console.error('❌ Error al actualizar precio:', error);
    }
  };

  // Función para manejar cambios en el stock
  const handleStockChange = async (rowId: string | number, newValue: string | number) => {
    console.log(`🔄 Actualizando stock del producto ${rowId}: ${newValue} unidades`);

    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === rowId
          ? { ...product, stock: Number(newValue) }
          : product
      )
    );

    try {
      await simulateApiCall(`/api/products/${rowId}/stock`, { stock: newValue });
    } catch (error) {
      console.error('❌ Error al actualizar stock:', error);
    }
  };

  // Definición de las 7 columnas (4 editables) para productos
  const productColumns: ColumnDef<Product>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'code',
      header: 'Código',
      isEditable: true,
      onCellUpdate: handleProductCodeChange,
    },
    {
      accessorKey: 'name',
      header: 'Nombre del Producto',
      isEditable: true,
      onCellUpdate: handleProductNameChange,
    },
    {
      accessorKey: 'category',
      header: 'Categoría',
    },
    {
      accessorKey: 'price',
      header: 'Precio',
      isEditable: true,
      onCellUpdate: handlePriceChange,
      cell: (value: string | number | boolean) => `$${Number(value).toFixed(2)}`,
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      isEditable: true,
      onCellUpdate: handleStockChange,
      cell: (value: string | number | boolean) => `${value} und.`,
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            App Y - Consumidor del Componente
          </h1>
          <p className="text-lg text-gray-600">
            Gestión de Inventario utilizando el componente de tabla interactiva de App X
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              📦 Catálogo de Productos
            </h2>
            <div className="text-sm text-gray-500">
              Total: {products.length} productos
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Este es un ejemplo de cómo App Y consume el componente de tabla de App X.
            Las columnas marcadas con ✏️ son editables y simulan llamadas a la API de inventario.
          </p>

          <InteractiveTable
            data={products}
            columns={productColumns}
            rowKey="id"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="font-semibold text-lg mb-3 text-green-800">
              ✅ Características Implementadas
            </h3>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>• <strong>7 columnas</strong> con datos de productos</li>
              <li>• <strong>4 columnas editables:</strong> Código, Nombre, Precio, Stock</li>
              <li>• <strong>Guardado implícito</strong> con evento onBlur</li>
              <li>• <strong>Simulación de API</strong> del backend de App Y</li>
              <li>• <strong>Feedback visual</strong> durante la edición</li>
              <li>• <strong>Renderizado personalizado</strong> para precio y stock</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="font-semibold text-lg mb-3 text-blue-800">
              🔧 Instrucciones de Uso
            </h3>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>• Haz clic en cualquier celda con ✏️ para editarla</li>
              <li>• Presiona <kbd className="bg-gray-100 px-1 rounded">Tab</kbd> para cambiar de celda</li>
              <li>• Presiona <kbd className="bg-gray-100 px-1 rounded">Enter</kbd> para confirmar</li>
              <li>• Haz clic fuera para guardar automáticamente</li>
              <li>• Revisa la consola para ver los eventos de API</li>
              <li>• Cada cambio simula una llamada al backend</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-amber-600 mr-3">💡</div>
            <div>
              <h4 className="font-medium text-amber-800">Nota de Arquitectura</h4>
              <p className="text-sm text-amber-700 mt-1">
                Este componente de tabla proviene de App X y se reutiliza aquí con datos y lógica de negocio específica de App Y.
                Las funciones de callback permiten que cada aplicación maneje sus propias actualizaciones de datos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
