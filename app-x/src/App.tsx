import { useState } from 'react';
import type { ColumnDef } from './components/interactive-table';
import { InteractiveTable } from './components/interactive-table';

// Interfaz para los datos de ejemplo
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

// Datos de muestra con 7 columnas
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

  // Función para manejar cambios en el nombre de usuario
  const handleUserNameChange = (rowId: string | number, newValue: string | number) => {
    console.log(`🔄 Actualizando usuario ${rowId} - Nuevo nombre: ${newValue}`);

    setData(prevData =>
      prevData.map(user =>
        user.id === rowId
          ? { ...user, userName: String(newValue) }
          : user
      )
    );

    // Simular llamada a API
    setTimeout(() => {
      console.log(`✅ Usuario ${rowId} actualizado exitosamente`);
    }, 500);
  };

  // Función para manejar cambios en el email
  const handleEmailChange = (rowId: string | number, newValue: string | number) => {
    console.log(`🔄 Actualizando email del usuario ${rowId} - Nuevo email: ${newValue}`);

    setData(prevData =>
      prevData.map(user =>
        user.id === rowId
          ? { ...user, email: String(newValue) }
          : user
      )
    );

    setTimeout(() => {
      console.log(`✅ Email del usuario ${rowId} actualizado exitosamente`);
    }, 500);
  };

  // Función para manejar cambios en la edad
  const handleAgeChange = (rowId: string | number, newValue: string | number) => {
    console.log(`🔄 Actualizando edad del usuario ${rowId} - Nueva edad: ${newValue}`);

    setData(prevData =>
      prevData.map(user =>
        user.id === rowId
          ? { ...user, age: Number(newValue) }
          : user
      )
    );

    setTimeout(() => {
      console.log(`✅ Edad del usuario ${rowId} actualizada exitosamente`);
    }, 500);
  };

  // Función para manejar cambios en el departamento
  const handleDepartmentChange = (rowId: string | number, newValue: string | number) => {
    console.log(`🔄 Actualizando departamento del usuario ${rowId} - Nuevo departamento: ${newValue}`);

    setData(prevData =>
      prevData.map(user =>
        user.id === rowId
          ? { ...user, department: String(newValue) }
          : user
      )
    );

    setTimeout(() => {
      console.log(`✅ Departamento del usuario ${rowId} actualizado exitosamente`);
    }, 500);
  };

  // Definición de las 7 columnas (4 editables)
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'userName',
      header: 'Nombre de Usuario',
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
      header: 'Nombre',
    },
    {
      accessorKey: 'lastName',
      header: 'Apellido',
    },
    {
      accessorKey: 'age',
      header: 'Edad',
      isEditable: true,
      onCellUpdate: handleAgeChange,
    },
    {
      accessorKey: 'department',
      header: 'Departamento',
      isEditable: true,
      onCellUpdate: handleDepartmentChange,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            App X - Proveedor del Componente
          </h1>
          <p className="text-muted-foreground">
            Demostración del componente de tabla interactiva con guardado implícito
          </p>
        </header>

        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Tabla de Usuarios</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Las columnas marcadas con ✏️ son editables. Los cambios se guardan automáticamente al perder el foco.
          </p>

          <InteractiveTable
            data={data}
            columns={columns}
            rowKey="id"
          />
        </div>

        <div className="mt-8 bg-muted/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Instrucciones:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Haz clic en cualquier celda editable para modificar su contenido</li>
            <li>• Presiona Tab o haz clic fuera para guardar automáticamente</li>
            <li>• Presiona Enter para confirmar el cambio</li>
            <li>• Revisa la consola del navegador para ver los eventos de guardado</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
