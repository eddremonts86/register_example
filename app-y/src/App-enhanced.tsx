import { useState } from 'react';
import { InfiniteScroll } from './components/InfiniteScroll';
import type { ColumnDef } from './components/interactive-table';
import { InteractiveTable } from './components/interactive-table/InteractiveTable-basic';
import { Pagination } from './components/Pagination';
import { useInfiniteCharacters, usePaginatedAnime, type Anime, type AnimeCharacter } from './hooks/useJikanAPI';

// Interface for product data (different business domain)
interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

// Sample data for products
const initialProducts: Product[] = [
  {
    id: 1,
    code: 'PROD-001',
    name: 'Gaming Laptop Pro',
    category: 'Electronics',
    price: 1299.99,
    stock: 15,
    description: 'High-end gaming laptop',
  },
  {
    id: 2,
    code: 'PROD-002',
    name: 'Wireless Mouse',
    category: 'Accessories',
    price: 29.99,
    stock: 50,
    description: 'Ergonomic wireless mouse',
  },
  {
    id: 3,
    code: 'PROD-003',
    name: 'Mechanical Keyboard',
    category: 'Accessories',
    price: 89.99,
    stock: 25,
    description: 'RGB mechanical keyboard',
  },
  {
    id: 4,
    code: 'PROD-004',
    name: '4K Monitor',
    category: 'Electronics',
    price: 349.99,
    stock: 8,
    description: '27" 4K Ultra HD monitor',
  },
];

function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [currentAnimePage, setCurrentAnimePage] = useState(1);

  // Jikan API hooks
  const { data: animeData, loading: animeLoading, error: animeError, pagination } = usePaginatedAnime(currentAnimePage);
  const { data: charactersData, loading: charactersLoading, error: charactersError, hasMore, loadMore } = useInfiniteCharacters();

  // API call simulation to demonstrate integration
  const simulateApiCall = (endpoint: string, data: unknown) => {
    return new Promise((resolve) => {
      console.log(`🌐 [API] POST ${endpoint}`, data);
      setTimeout(() => {
        console.log(`✅ [API] Successful response from ${endpoint}`);
        resolve({ success: true, message: 'Updated successfully' });
      }, 800);
    });
  };

  // Function to handle product code changes
  const handleProductCodeChange = async (rowId: string | number, newValue: string | number) => {
    console.log(`🔄 Updating product ${rowId} code: ${newValue}`);

    // Update local state immediately for responsive UX
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === rowId
          ? { ...product, code: String(newValue) }
          : product
      )
    );

    // Simulate API call to App Y backend
    try {
      await simulateApiCall(`/api/products/${rowId}/code`, { code: newValue });
    } catch (error) {
      console.error('❌ Error updating code:', error);
    }
  };

  // Function to handle product name changes
  const handleProductNameChange = async (rowId: string | number, newValue: string | number) => {
    console.log(`🔄 Updating product ${rowId} name: ${newValue}`);

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
      console.error('❌ Error updating name:', error);
    }
  };

  // Function to handle price changes
  const handlePriceChange = async (rowId: string | number, newValue: string | number) => {
    console.log(`🔄 Updating product ${rowId} price: $${newValue}`);

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
      console.error('❌ Error updating price:', error);
    }
  };

  // Function to handle stock changes
  const handleStockChange = async (rowId: string | number, newValue: string | number) => {
    console.log(`🔄 Updating product ${rowId} stock: ${newValue} units`);

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
      console.error('❌ Error updating stock:', error);
    }
  };

  // Definition of 7 columns (4 editable) for products
  const productColumns: ColumnDef<Product>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'code',
      header: 'Code',
      isEditable: true,
      onCellUpdate: handleProductCodeChange,
    },
    {
      accessorKey: 'name',
      header: 'Product Name',
      isEditable: true,
      onCellUpdate: handleProductNameChange,
    },
    {
      accessorKey: 'category',
      header: 'Category',
    },
    {
      accessorKey: 'price',
      header: 'Price',
      isEditable: true,
      onCellUpdate: handlePriceChange,
      cell: (value: string | number | boolean) => `$${Number(value).toFixed(2)}`,
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      isEditable: true,
      onCellUpdate: handleStockChange,
      cell: (value: string | number | boolean) => `${value} units`,
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
  ];

  // Anime table columns with 7 columns
  const animeColumns: ColumnDef<Anime>[] = [
    {
      accessorKey: 'mal_id',
      header: 'MAL ID',
    },
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'title_english',
      header: 'English Title',
    },
    {
      accessorKey: 'type',
      header: 'Type',
    },
    {
      accessorKey: 'episodes',
      header: 'Episodes',
    },
    {
      accessorKey: 'score',
      header: 'Score',
      cell: (value: string | number | boolean) => value ? `${Number(value).toFixed(1)}/10` : 'N/A',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
  ];

  // Character table columns with 7 columns
  const characterColumns: ColumnDef<AnimeCharacter>[] = [
    {
      accessorKey: 'mal_id',
      header: 'MAL ID',
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'name_kanji',
      header: 'Kanji Name',
    },
    {
      accessorKey: 'nicknames',
      header: 'Nicknames',
      cell: (value: string | number | boolean) => {
        const nicknames = value as string[];
        return Array.isArray(nicknames) ? nicknames.slice(0, 2).join(', ') : 'None';
      },
    },
    {
      accessorKey: 'favorites',
      header: 'Favorites',
      cell: (value: string | number | boolean) => Number(value).toLocaleString(),
    },
    {
      accessorKey: 'about',
      header: 'About',
      cell: (value: string | number | boolean) => {
        const text = String(value || '');
        return text.length > 50 ? text.substring(0, 50) + '...' : text;
      },
    },
    {
      accessorKey: 'images',
      header: 'Image',
      cell: (value: string | number | boolean) => {
        const images = value as { jpg: { image_url: string } };
        return images?.jpg?.image_url ? 'Has Image' : 'No Image';
      },
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
            App Y - Component Consumer
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#424242' }}>
            Multiple table demonstrations using the interactive table component from App X
          </p>
        </header>

        {/* Products Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid #e3f2fd',
          padding: '32px',
          marginBottom: '32px'
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
              📦 Product Catalog
            </h2>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>
              Total: {products.length} products
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '24px' }}>
            This is an example of how App Y consumes the table component from App X.
            Columns marked with ✏️ are editable and simulate inventory API calls.
          </p>

          <InteractiveTable
            data={products}
            columns={productColumns}
            rowKey="id"
          />
        </div>

        {/* Anime Table with Pagination */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid #e3f2fd',
          padding: '32px',
          marginBottom: '32px'
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
              🎌 Top Anime (Paginated)
            </h2>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>
              Data from Jikan API
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '24px' }}>
            Real anime data from MyAnimeList via Jikan API. This table demonstrates pagination functionality.
          </p>

          {animeError && (
            <div style={{
              color: '#dc3545',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              Error loading anime data: {animeError}
            </div>
          )}

          <InteractiveTable
            data={animeData}
            columns={animeColumns}
            rowKey="mal_id"
          />

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentAnimePage}
            isLoading={animeLoading}
          />
        </div>

        {/* Characters Table with Infinite Scroll */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid #e3f2fd',
          padding: '32px',
          marginBottom: '32px'
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
              👥 Top Characters (Infinite Scroll)
            </h2>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>
              Loaded: {charactersData.length} characters
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '24px' }}>
            Real character data from MyAnimeList via Jikan API. This table demonstrates infinite scroll functionality.
          </p>

          {charactersError && (
            <div style={{
              color: '#dc3545',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              Error loading character data: {charactersError}
            </div>
          )}

          <InfiniteScroll
            hasMore={hasMore}
            isLoading={charactersLoading}
            onLoadMore={loadMore}
          >
            <InteractiveTable
              data={charactersData}
              columns={characterColumns}
              rowKey="mal_id"
            />
          </InfiniteScroll>
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
              ✅ Implemented Features
            </h3>
            <ul style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#424242', paddingLeft: '20px' }}>
              <li><strong>7 columns</strong> in each table</li>
              <li><strong>4 editable columns</strong> in product table</li>
              <li><strong>Implicit saving</strong> with onBlur event</li>
              <li><strong>Real API data</strong> from Jikan (MyAnimeList)</li>
              <li><strong>Pagination</strong> for anime table</li>
              <li><strong>Infinite scroll</strong> for characters table</li>
              <li><strong>Error handling</strong> and loading states</li>
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
              🔧 Usage Instructions
            </h3>
            <ul style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#424242', paddingLeft: '20px' }}>
              <li>Click any cell with ✏️ to edit (product table only)</li>
              <li>Use pagination controls for anime table</li>
              <li>Scroll down in characters section for infinite loading</li>
              <li>Check console for API simulation logs</li>
              <li>All tables use the same shared component from App X</li>
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
            <h4 style={{ fontWeight: '500', color: '#e65100', margin: '0 0 4px 0' }}>Architecture Note</h4>
            <p style={{ fontSize: '0.875rem', color: '#bf360c', margin: 0, lineHeight: '1.5' }}>
              This demonstrates three different table use cases: editable inventory management, paginated anime data,
              and infinite-scroll character browsing. All tables share the same reusable component from App X while
              implementing different data sources and interaction patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
