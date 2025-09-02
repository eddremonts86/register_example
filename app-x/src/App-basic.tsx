import { useState } from 'react';
import type { ColumnDef } from './components/interactive-table';
import { InteractiveTable } from './components/interactive-table/InteractiveTable-basic';

// Interface for sample data
interface User {
  id: number;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  department: string;
  isActive: boolean;
}

// Sample data with 7 columns
const initialData: User[] = [
  {
    id: 1,
    userName: 'john_doe',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    age: 28,
    department: 'Engineering',
    isActive: true,
  },
  {
    id: 2,
    userName: 'jane_smith',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    age: 32,
    department: 'Marketing',
    isActive: true,
  },
  {
    id: 3,
    userName: 'bob_wilson',
    email: 'bob.wilson@example.com',
    firstName: 'Bob',
    lastName: 'Wilson',
    age: 25,
    department: 'Sales',
    isActive: false,
  },
];

function App() {
  const [data, setData] = useState<User[]>(initialData);

  // Function to handle username changes
  const handleUserNameChange = (rowId: string | number, newValue: string | number) => {
    console.log(`🔄 Updating user ${rowId} - New username: ${newValue}`);

    setData(prevData =>
      prevData.map(user =>
        user.id === rowId
          ? { ...user, userName: String(newValue) }
          : user
      )
    );

    // Simulate API call
    setTimeout(() => {
      console.log(`✅ User ${rowId} updated successfully`);
    }, 500);
  };

  // Function to handle email changes
  const handleEmailChange = (rowId: string | number, newValue: string | number) => {
    console.log(`🔄 Updating user ${rowId} email - New email: ${newValue}`);

    setData(prevData =>
      prevData.map(user =>
        user.id === rowId
          ? { ...user, email: String(newValue) }
          : user
      )
    );

    setTimeout(() => {
      console.log(`✅ User ${rowId} email updated successfully`);
    }, 500);
  };

  // Function to handle age changes
  const handleAgeChange = (rowId: string | number, newValue: string | number) => {
    console.log(`🔄 Updating user ${rowId} age - New age: ${newValue}`);

    setData(prevData =>
      prevData.map(user =>
        user.id === rowId
          ? { ...user, age: Number(newValue) }
          : user
      )
    );

    setTimeout(() => {
      console.log(`✅ User ${rowId} age updated successfully`);
    }, 500);
  };

  // Function to handle department changes
  const handleDepartmentChange = (rowId: string | number, newValue: string | number) => {
    console.log(`🔄 Updating user ${rowId} department - New department: ${newValue}`);

    setData(prevData =>
      prevData.map(user =>
        user.id === rowId
          ? { ...user, department: String(newValue) }
          : user
      )
    );

    setTimeout(() => {
      console.log(`✅ User ${rowId} department updated successfully`);
    }, 500);
  };

  // Definition of 7 columns (4 editable)
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'userName',
      header: 'Username',
      isEditable: true,
      onCellUpdate: handleUserNameChange,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      isEditable: true,
      onCellUpdate: handleEmailChange,
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
    },
    {
      accessorKey: 'age',
      header: 'Age',
      isEditable: true,
      onCellUpdate: handleAgeChange,
    },
    {
      accessorKey: 'department',
      header: 'Department',
      isEditable: true,
      onCellUpdate: handleDepartmentChange,
    },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '32px', backgroundColor: '#f8f9fa' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
            App X - Component Provider
          </h1>
          <p style={{ color: '#666' }}>
            Interactive table component demonstration with implicit saving
          </p>
        </header>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px' }}>User Table</h2>
          <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '24px' }}>
            Columns marked with ✏️ are editable. Changes are saved automatically when focus is lost.
          </p>

          <InteractiveTable
            data={data}
            columns={columns}
            rowKey="id"
          />
        </div>

        <div style={{
          marginTop: '32px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '16px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Instructions:</h3>
          <ul style={{ fontSize: '0.875rem', color: '#666', lineHeight: '1.5' }}>
            <li>• Click on any editable cell to modify its content</li>
            <li>• Press Tab or click outside to save automatically</li>
            <li>• Press Enter to confirm the change</li>
            <li>• Check the browser console to see save events</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
