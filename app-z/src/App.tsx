import { useState } from 'react';
import { InteractiveTable } from './components/interactive-table/InteractiveTable';
import type { ColumnDef } from './components/interactive-table/types';

// 💰 Financial Instruments Interface
interface FinancialInstrument {
  id: number;
  symbol: string;
  name: string;
  sector: string;
  price: number;
  volume: number;
  change: string;
}

// 👥 Employee Interface
interface Employee {
  id: number;
  employeeId: string;
  name: string;
  department: string;
  salary: number;
  experience: number;
  status: string;
}

// 📦 Inventory Item Interface
interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  category: string;
  cost: number;
  quantity: number;
  supplier: string;
}

// Sample data for financial instruments
const financialData: FinancialInstrument[] = [
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
    price: 2748.90,
    volume: 1234567,
    change: '-0.8%',
  },
  {
    id: 3,
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    sector: 'Automotive',
    price: 251.20,
    volume: 23456789,
    change: '+5.2%',
  },
];

// Sample data for employees
const employeeData: Employee[] = [
  {
    id: 1,
    employeeId: 'EMP-001',
    name: 'John Smith',
    department: 'Engineering',
    salary: 95000,
    experience: 5,
    status: 'Active',
  },
  {
    id: 2,
    employeeId: 'EMP-002',
    name: 'Sarah Johnson',
    department: 'Marketing',
    salary: 72000,
    experience: 3,
    status: 'Active',
  },
  {
    id: 3,
    employeeId: 'EMP-003',
    name: 'Mike Davis',
    department: 'Sales',
    salary: 68000,
    experience: 2,
    status: 'On Leave',
  },
];

// Sample data for inventory
const inventoryData: InventoryItem[] = [
  {
    id: 1,
    sku: 'INV-001',
    name: 'Bluetooth Headphones',
    category: 'Electronics',
    cost: 89.99,
    quantity: 150,
    supplier: 'TechSupply Co.',
  },
  {
    id: 2,
    sku: 'INV-002',
    name: 'Office Chair',
    category: 'Furniture',
    cost: 245.00,
    quantity: 45,
    supplier: 'OfficeMax Ltd.',
  },
  {
    id: 3,
    sku: 'INV-003',
    name: 'Laptop Stand',
    category: 'Accessories',
    cost: 35.50,
    quantity: 200,
    supplier: 'Ergo Solutions',
  },
];

function App() {
  const [financialInstruments, setFinancialInstruments] = useState(financialData);
  const [employees, setEmployees] = useState(employeeData);
  const [inventory, setInventory] = useState(inventoryData);

  // Financial Instruments columns
  const financialColumns: ColumnDef<FinancialInstrument>[] = [
    { accessorKey: 'id', header: 'ID' },
    {
      accessorKey: 'symbol',
      header: 'Symbol',
      isEditable: true,
      onCellUpdate: (rowId, newValue) => {
        console.log('📈 Updating financial symbol:', rowId, newValue);
        setFinancialInstruments(prev =>
          prev.map(item =>
            item.id === rowId ? { ...item, symbol: String(newValue) } : item
          )
        );
      }
    },
    {
      accessorKey: 'name',
      header: 'Company Name',
      isEditable: true,
      onCellUpdate: (rowId, newValue) => {
        console.log('🏢 Updating company name:', rowId, newValue);
        setFinancialInstruments(prev =>
          prev.map(item =>
            item.id === rowId ? { ...item, name: String(newValue) } : item
          )
        );
      }
    },
    { accessorKey: 'sector', header: 'Sector' },
    {
      accessorKey: 'price',
      header: 'Price ($)',
      isEditable: true,
      onCellUpdate: (rowId, newValue) => {
        console.log('💰 Updating price:', rowId, newValue);
        setFinancialInstruments(prev =>
          prev.map(item =>
            item.id === rowId ? { ...item, price: Number(newValue) } : item
          )
        );
      },
      cell: (value) => `$${Number(value).toFixed(2)}`
    },
    {
      accessorKey: 'volume',
      header: 'Volume',
      isEditable: true,
      onCellUpdate: (rowId, newValue) => {
        console.log('📊 Updating volume:', rowId, newValue);
        setFinancialInstruments(prev =>
          prev.map(item =>
            item.id === rowId ? { ...item, volume: Number(newValue) } : item
          )
        );
      },
      cell: (value) => Number(value).toLocaleString()
    },
    { accessorKey: 'change', header: 'Change (%)' },
  ];

  // Employee columns
  const employeeColumns: ColumnDef<Employee>[] = [
    { accessorKey: 'id', header: 'ID' },
    {
      accessorKey: 'employeeId',
      header: 'Employee ID',
      isEditable: true,
      onCellUpdate: (rowId, newValue) => {
        console.log('👤 Updating employee ID:', rowId, newValue);
        setEmployees(prev =>
          prev.map(emp =>
            emp.id === rowId ? { ...emp, employeeId: String(newValue) } : emp
          )
        );
      }
    },
    {
      accessorKey: 'name',
      header: 'Full Name',
      isEditable: true,
      onCellUpdate: (rowId, newValue) => {
        console.log('📝 Updating employee name:', rowId, newValue);
        setEmployees(prev =>
          prev.map(emp =>
            emp.id === rowId ? { ...emp, name: String(newValue) } : emp
          )
        );
      }
    },
    { accessorKey: 'department', header: 'Department' },
    {
      accessorKey: 'salary',
      header: 'Salary',
      isEditable: true,
      onCellUpdate: (rowId, newValue) => {
        console.log('💵 Updating salary:', rowId, newValue);
        setEmployees(prev =>
          prev.map(emp =>
            emp.id === rowId ? { ...emp, salary: Number(newValue) } : emp
          )
        );
      },
      cell: (value) => `$${Number(value).toLocaleString()}`
    },
    {
      accessorKey: 'experience',
      header: 'Experience (years)',
      isEditable: true,
      onCellUpdate: (rowId, newValue) => {
        console.log('📅 Updating experience:', rowId, newValue);
        setEmployees(prev =>
          prev.map(emp =>
            emp.id === rowId ? { ...emp, experience: Number(newValue) } : emp
          )
        );
      }
    },
    { accessorKey: 'status', header: 'Status' },
  ];

  // Inventory columns
  const inventoryColumns: ColumnDef<InventoryItem>[] = [
    { accessorKey: 'id', header: 'ID' },
    {
      accessorKey: 'sku',
      header: 'SKU',
      isEditable: true,
      onCellUpdate: (rowId, newValue) => {
        console.log('📋 Updating SKU:', rowId, newValue);
        setInventory(prev =>
          prev.map(item =>
            item.id === rowId ? { ...item, sku: String(newValue) } : item
          )
        );
      }
    },
    {
      accessorKey: 'name',
      header: 'Product Name',
      isEditable: true,
      onCellUpdate: (rowId, newValue) => {
        console.log('🏷️ Updating product name:', rowId, newValue);
        setInventory(prev =>
          prev.map(item =>
            item.id === rowId ? { ...item, name: String(newValue) } : item
          )
        );
      }
    },
    { accessorKey: 'category', header: 'Category' },
    {
      accessorKey: 'cost',
      header: 'Unit Cost',
      isEditable: true,
      onCellUpdate: (rowId, newValue) => {
        console.log('💲 Updating cost:', rowId, newValue);
        setInventory(prev =>
          prev.map(item =>
            item.id === rowId ? { ...item, cost: Number(newValue) } : item
          )
        );
      },
      cell: (value) => `$${Number(value).toFixed(2)}`
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      isEditable: true,
      onCellUpdate: (rowId, newValue) => {
        console.log('📦 Updating quantity:', rowId, newValue);
        setInventory(prev =>
          prev.map(item =>
            item.id === rowId ? { ...item, quantity: Number(newValue) } : item
          )
        );
      }
    },
    { accessorKey: 'supplier', header: 'Supplier' },
  ];

  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <header style={{
        marginBottom: '32px',
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '8px'
        }}>
          🎨 App Z - Tailwind CSS Integration Demo
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          margin: '0'
        }}>
          Demonstrating shared InteractiveTable component across different business domains
        </p>
      </header>

      {/* Financial Dashboard Section */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#333',
              marginBottom: '4px'
            }}>
              📈 Financial Dashboard
            </h2>
            <p style={{
              color: '#666',
              fontSize: '0.9rem',
              margin: '0'
            }}>
              Real-time stock market data with editable prices and volumes
            </p>
          </div>
          <InteractiveTable
            data={financialInstruments}
            columns={financialColumns}
          />
        </div>
      </section>

      {/* HR Management Section */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#333',
              marginBottom: '4px'
            }}>
              👥 HR Management
            </h2>
            <p style={{
              color: '#666',
              fontSize: '0.9rem',
              margin: '0'
            }}>
              Employee data management with editable fields for HR operations
            </p>
          </div>
          <InteractiveTable
            data={employees}
            columns={employeeColumns}
          />
        </div>
      </section>

      {/* Inventory Management Section */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#333',
              marginBottom: '4px'
            }}>
              📦 Inventory Management
            </h2>
            <p style={{
              color: '#666',
              fontSize: '0.9rem',
              margin: '0'
            }}>
              Product inventory tracking with editable costs and quantities
            </p>
          </div>
          <InteractiveTable
            data={inventory}
            columns={inventoryColumns}
          />
        </div>
      </section>

      {/* Features and Integration Guide */}
      <section>
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#333',
            marginBottom: '16px'
          }}>
            ✅ Tailwind CSS Integration Successful!
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                🎯 Integration Steps Completed
              </h4>
              <ul style={{
                color: '#666',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                paddingLeft: '20px',
                margin: '0'
              }}>
                <li>✅ Installed Tailwind CSS dependencies</li>
                <li>✅ Configured tailwind.config.js</li>
                <li>✅ Updated CSS with @tailwind directives</li>
                <li>✅ Copied shared components from App X</li>
                <li>✅ Configured component paths</li>
              </ul>
            </div>

            <div>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                🚀 Features Demonstrated
              </h4>
              <ul style={{
                color: '#666',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                paddingLeft: '20px',
                margin: '0'
              }}>
                <li>💰 Financial data with price editing</li>
                <li>👥 HR data with salary management</li>
                <li>📦 Inventory with cost tracking</li>
                <li>✏️ Implicit saving on cell edit</li>
                <li>🎨 Consistent styling across domains</li>
              </ul>
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '16px',
            borderRadius: '6px',
            border: '1px solid #e9ecef'
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#333',
              marginBottom: '8px'
            }}>
              💡 Architecture Benefits
            </h4>
            <p style={{
              color: '#666',
              fontSize: '0.9rem',
              margin: '0',
              lineHeight: '1.6'
            }}>
              This demonstrates how our shared InteractiveTable component can be successfully
              integrated into any React application. By adding Tailwind CSS configuration,
              we maintain consistent styling and behavior across different business domains
              while preserving the component's reusability and type safety.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
