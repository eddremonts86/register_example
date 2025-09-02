import { useState } from 'react';
import type { ColumnDef } from './components/interactive-table';
import { InteractiveTable } from './components/interactive-table/InteractiveTable-basic';

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
    <div style={{
      minHeight: '100vh',
      padding: '32px',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <header style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1a237e',
            marginBottom: '8px'
          }}>
            App Y - Consumidor del Componente
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#424242' }}>
            Gestión de Inventario utilizando el componente de tabla interactiva de App X
          </p>
        </header>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid #e3f2fd',
          padding: '32px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '600',
              color: '#1a237e',
              margin: 0
            }}>
              📦 Catálogo de Productos
            </h2>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>
              Total: {products.length} productos
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '24px' }}>
            Este es un ejemplo de cómo App Y consume el componente de tabla de App X.
            Las columnas marcadas con ✏️ son editables y simulan llamadas a la API de inventario.
          </p>

          <InteractiveTable
            data={products}
            columns={productColumns}
            rowKey="id"
          />
        </div>

        <div style={{
          marginTop: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            border: '1px solid #e8f5e8',
            padding: '24px'
          }}>
            <h3 style={{
              fontWeight: '600',
              fontSize: '1.125rem',
              marginBottom: '12px',
              color: '#2e7d32'
            }}>
              ✅ Características Implementadas
            </h3>
            <ul style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#424242', paddingLeft: '20px' }}>
              <li><strong>7 columnas</strong> con datos de productos</li>
              <li><strong>4 columnas editables:</strong> Código, Nombre, Precio, Stock</li>
              <li><strong>Guardado implícito</strong> con evento onBlur</li>
              <li><strong>Simulación de API</strong> del backend de App Y</li>
              <li><strong>Feedback visual</strong> durante la edición</li>
              <li><strong>Renderizado personalizado</strong> para precio y stock</li>
            </ul>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            border: '1px solid #e3f2fd',
            padding: '24px'
          }}>
            <h3 style={{
              fontWeight: '600',
              fontSize: '1.125rem',
              marginBottom: '12px',
              color: '#1565c0'
            }}>
              🔧 Instrucciones de Uso
            </h3>
            <ul style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#424242', paddingLeft: '20px' }}>
              <li>Haz clic en cualquier celda con ✏️ para editarla</li>
              <li>Presiona <kbd style={{
                backgroundColor: '#f5f5f5',
                padding: '2px 4px',
                borderRadius: '3px',
                fontSize: '0.75rem'
              }}>Tab</kbd> para cambiar de celda</li>
              <li>Presiona <kbd style={{
                backgroundColor: '#f5f5f5',
                padding: '2px 4px',
                borderRadius: '3px',
                fontSize: '0.75rem'
              }}>Enter</kbd> para confirmar</li>
              <li>Haz clic fuera para guardar automáticamente</li>
              <li>Revisa la consola para ver los eventos de API</li>
              <li>Cada cambio simula una llamada al backend</li>
            </ul>
          </div>
        </div>

        <div style={{
          marginTop: '24px',
          backgroundColor: '#fff8e1',
          border: '1px solid #ffb74d',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          alignItems: 'flex-start'
        }}>
          <div style={{ color: '#f57c00', marginRight: '12px', fontSize: '1.25rem' }}>💡</div>
          <div>
            <h4 style={{ fontWeight: '500', color: '#e65100', margin: '0 0 4px 0' }}>Nota de Arquitectura</h4>
            <p style={{ fontSize: '0.875rem', color: '#bf360c', margin: 0, lineHeight: '1.5' }}>
              Este componente de tabla proviene de App X y se reutiliza aquí con datos y lógica de negocio específica de App Y.
              Las funciones de callback permiten que cada aplicación maneje sus propias actualizaciones de datos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
