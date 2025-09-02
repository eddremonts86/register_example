import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table-basic';
import { EditableCell } from './EditableCell-basic';
import type { InteractiveTableProps } from './types';

/**
 * Componente de tabla interactiva con celdas editables y guardado implícito
 *
 * Este componente genérico permite mostrar datos tabulares con la capacidad
 * de editar ciertas columnas directamente en línea. Los cambios se guardan
 * automáticamente cuando el usuario termina de editar (evento onBlur).
 */
export function InteractiveTable<T>({
  data,
  columns,
  rowKey = 'id' as keyof T,
}: InteractiveTableProps<T>) {
  /**
   * Obtiene el ID único de una fila
   */
  const getRowId = (rowData: T): string | number => {
    const id = rowData[rowKey];
    return typeof id === 'string' || typeof id === 'number' ? id : 0;
  };

  /**
   * Renderiza el contenido de una celda
   */
  const renderCell = (column: (typeof columns)[0], rowData: T) => {
    const value = rowData[column.accessorKey];
    const rowId = getRowId(rowData);

    // Si la columna es editable, usar el componente EditableCell
    if (column.isEditable) {
      return (
        <EditableCell
          value={value as string | number | boolean}
          rowData={rowData}
          column={column}
          rowId={rowId}
        />
      );
    }

    // Si hay una función de renderizado personalizada, usarla
    if (column.cell) {
      return (
        <TableCell>
          {column.cell(value as string | number | boolean, rowData)}
        </TableCell>
      );
    }

    // Renderizado por defecto
    return (
      <TableCell>
        {typeof value === 'boolean' ? (value ? 'Sí' : 'No') : String(value || '')}
      </TableCell>
    );
  };

  return (
    <div style={{ width: '100%' }}>
      <Table>
        {/* Cabecera de la tabla */}
        <TableHeader>
          <TableRow style={{ backgroundColor: '#f8f9fa' }}>
            {columns.map((column) => (
              <TableHead key={String(column.accessorKey)} style={{ fontWeight: '600' }}>
                {column.header}
                {column.isEditable && (
                  <span style={{ marginLeft: '4px', fontSize: '0.75rem', color: '#666' }}>✏️</span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Cuerpo de la tabla */}
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                style={{
                  height: '96px',
                  textAlign: 'center',
                  color: '#666',
                  fontStyle: 'italic'
                }}
              >
                No hay datos para mostrar
              </TableCell>
            </TableRow>
          ) : (
            data.map((rowData, index) => (
              <TableRow key={getRowId(rowData) || index}>
                {columns.map((column) => (
                  <React.Fragment key={String(column.accessorKey)}>
                    {renderCell(column, rowData)}
                  </React.Fragment>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
