import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import React from 'react';
import { EditableCell } from './EditableCell';
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
    <div className="w-full">
      <Table>
        {/* Cabecera de la tabla */}
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map((column) => (
              <TableHead key={String(column.accessorKey)} className="font-semibold">
                {column.header}
                {column.isEditable && (
                  <span className="ml-1 text-xs text-muted-foreground">✏️</span>
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
                className="h-24 text-center text-muted-foreground"
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
